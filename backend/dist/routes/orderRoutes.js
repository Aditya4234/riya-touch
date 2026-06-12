"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Create Order (Customer)
router.post('/', auth_1.auth, async (req, res) => {
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
        // Verify products and calculate price
        for (const item of items) {
            const dbProduct = await Product_1.default.findById(item.productId);
            if (!dbProduct) {
                return res.status(404).json({ message: `Product ${item.productId} not found` });
            }
            // Check stock
            if (dbProduct.stock < item.packQuantity) {
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
            await dbProduct.save();
        }
        // Create order object
        const newOrder = new Order_1.default({
            user: req.user.id,
            items: finalItems,
            totalAmount: calculatedTotal,
            totalPacks,
            totalItems,
            businessName: businessName || req.user.businessName || req.user.name,
            gstin: gstin || req.user.gstin || '',
            shippingAddress,
            paymentMethod,
            paymentStatus: paymentMethod === 'COD' || paymentMethod === 'WhatsApp Checkout' ? 'Pending' : 'Pending',
            paymentReceipt: paymentReceipt || '',
            status: 'Pending'
        });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    }
    catch (error) {
        res.status(500).json({ message: 'Error placing order', error: error.message });
    }
});
// Get User's Orders (Customer)
router.get('/me', auth_1.auth, async (req, res) => {
    try {
        const orders = await Order_1.default.find({ user: req.user.id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});
// Get All Orders (Admin only)
router.get('/', auth_1.auth, auth_1.admin, async (req, res) => {
    try {
        const orders = await Order_1.default.find()
            .populate('user', 'name email phone businessName gstin')
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders for admin', error: error.message });
    }
});
// Update Order Status (Admin only)
router.put('/:id/status', auth_1.auth, auth_1.admin, async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (status)
            order.status = status;
        if (paymentStatus)
            order.paymentStatus = paymentStatus;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
});
// Upload Payment Receipt (Customer)
router.put('/:id/receipt', auth_1.auth, async (req, res) => {
    try {
        const { paymentReceipt } = req.body;
        if (!paymentReceipt) {
            return res.status(400).json({ message: 'Receipt URL/string is required' });
        }
        const order = await Order_1.default.findOne({ _id: req.params.id, user: req.user.id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found or access denied' });
        }
        order.paymentReceipt = paymentReceipt;
        order.paymentStatus = 'Pending'; // Remains pending until admin verifies
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    }
    catch (error) {
        res.status(500).json({ message: 'Error uploading payment receipt', error: error.message });
    }
});
exports.default = router;
