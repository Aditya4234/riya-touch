import express, { Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import Product from '../models/Product';
import { auth, admin, AuthRequest } from '../middleware/auth';

const MIN_ORDER_VALUE = 5000;

const router = express.Router();

// Create Order (Customer)
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod, businessName, gstin, paymentReceipt } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    let calculatedTotal = 0;
    let totalPacks = 0;
    let totalItems = 0;
    const finalItems = [];

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Verify products and calculate price
      for (const item of items) {
        const dbProduct = await Product.findById(item.productId).session(session);
        if (!dbProduct) {
          await session.abortTransaction();
          return res.status(404).json({ message: `Product ${item.productId} not found` });
        }

        // Check stock
        if (dbProduct.stock < item.packQuantity) {
          await session.abortTransaction();
          return res.status(400).json({ message: `Insufficient stock for product ${dbProduct.name}. Available packs: ${dbProduct.stock}` });
        }

        const itemCost = dbProduct.wholesalePrice * dbProduct.packSize * item.packQuantity;
        calculatedTotal += itemCost;
        totalPacks += item.packQuantity;
        totalItems += item.packQuantity * dbProduct.packSize;

        finalItems.push({
          product: dbProduct._id,
          size: item.size,
          color: item.color || 'Assorted',
          packQuantity: item.packQuantity,
          packSize: dbProduct.packSize,
          wholesalePrice: dbProduct.wholesalePrice
        });

        // Deduct stock
        dbProduct.stock -= item.packQuantity;
        await dbProduct.save({ session });
      }

      // Validate minimum order value
      if (calculatedTotal < MIN_ORDER_VALUE) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Minimum order value is ₹${MIN_ORDER_VALUE}` });
      }

      // Create order object
      const newOrder = new Order({
        user: req.user.id,
        items: finalItems,
        totalAmount: calculatedTotal,
        totalPacks,
        totalItems,
        businessName: businessName || req.user.businessName || req.user.name,
        gstin: gstin || req.user.gstin || '',
        shippingAddress,
        paymentMethod,
        paymentStatus: 'Pending',
        paymentReceipt: paymentReceipt || '',
        status: 'Pending'
      });

      await newOrder.save({ session });
      await session.commitTransaction();
      res.status(201).json(newOrder);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
});

// Get User's Orders (Customer)
router.get('/me', auth, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get All Orders (Admin only)
router.get('/', auth, admin, async (req: any, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone businessName gstin')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching orders for admin', error: error.message });
  }
});

// Get Pending Orders Count (Admin only)
router.get('/pending-count', auth, admin, async (req: any, res: Response) => {
  try {
    const count = await Order.countDocuments({ status: 'Pending' });
    res.json({ count });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching pending count', error: error.message });
  }
});

// Update Order Status (Admin only)
router.put('/:id/status', auth, admin, async (req: any, res: Response) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
});

// Get Single Order by ID (Customer/Admin)
router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user', 'name email phone businessName gstin address');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Allow only the order owner or admin to view
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

// Cancel Order (Customer - only if Pending)
router.patch('/:id/cancel', auth, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found or access denied' });
    }
    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    order.status = 'Cancelled';
    order.paymentStatus = 'Failed';

    // Restore stock for each item
    for (const item of order.items) {
      const dbProduct = await Product.findById(item.product);
      if (dbProduct) {
        dbProduct.stock += item.packQuantity;
        await dbProduct.save();
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
});

// Export Orders as CSV (Admin only)
router.get('/export', auth, admin, async (req: any, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone businessName gstin')
      .populate('items.product')
      .sort({ createdAt: -1 });

    const headers = 'OrderID,Date,BusinessName,GSTIN,BuyerName,BuyerPhone,BuyerEmail,Street,City,State,Pincode,PaymentMethod,PaymentStatus,OrderStatus,TotalPacks,TotalItems,TotalAmount,Items\n';
    const rows = orders.map((o: any) => {
      const itemsStr = o.items.map((i: any) =>
        `${i.product?.name || 'Deleted'}|${i.size}|${i.color}|${i.packQuantity}boxes|${i.packQuantity * i.packSize}pcs|₹${i.wholesalePrice}/pc`
      ).join('; ');
      return `"${o._id}","${new Date(o.createdAt).toISOString()}","${o.businessName}","${o.gstin || ''}","${o.user?.name || ''}","${o.user?.phone || ''}","${o.user?.email || ''}","${o.shippingAddress?.street || ''}","${o.shippingAddress?.city || ''}","${o.shippingAddress?.state || ''}","${o.shippingAddress?.pincode || ''}","${o.paymentMethod}","${o.paymentStatus}","${o.status}",${o.totalPacks},${o.totalItems},${o.totalAmount},"${itemsStr}"`;
    }).join('\n');

    const csv = headers + rows;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=riya-touch-orders-${Date.now()}.csv`);
    res.send(csv);
  } catch (error: any) {
    res.status(500).json({ message: 'Error exporting orders', error: error.message });
  }
});

// Upload Payment Receipt (Customer)
router.put('/:id/receipt', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { paymentReceipt } = req.body;
    if (!paymentReceipt) {
      return res.status(400).json({ message: 'Receipt URL/string is required' });
    }

    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found or access denied' });
    }

    order.paymentReceipt = paymentReceipt;
    order.paymentStatus = 'Pending'; // Remains pending until admin verifies

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: 'Error uploading payment receipt', error: error.message });
  }
});

export default router;
