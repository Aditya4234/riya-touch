import express, { Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order';
import { auth, AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

// Create Razorpay order
router.post('/create-order', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const options = {
      amount: Math.round(order.totalAmount * 100),
      currency: 'INR',
      receipt: orderId,
      notes: { orderId }
    };

    const razorpayOrder = await razorpay.orders.create(options);
    res.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error: any) {
    logger.error('Error creating Razorpay order', { error: error.message });
    res.status(500).json({ message: 'Error creating payment order', error: error.message });
  }
});

// Verify payment
router.post('/verify', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (sign !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    const order = await Order.findById(razorpayOrder.receipt);
    if (order) {
      order.paymentStatus = 'Paid';
      order.paymentMethod = 'Razorpay';
      order.paymentDetails = { razorpay_order_id, razorpay_payment_id };
      await order.save();
    }

    res.json({ message: 'Payment verified successfully' });
  } catch (error: any) {
    logger.error('Error verifying payment', { error: error.message });
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
});

export default router;
