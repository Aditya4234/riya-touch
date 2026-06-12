import mongoose, { Schema } from 'mongoose';

const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  size: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  packQuantity: {
    type: Number, // Number of boxes/packs
    required: true,
    min: 1
  },
  packSize: {
    type: Number, // Pack size (e.g. 10 pieces per pack)
    required: true
  },
  wholesalePrice: {
    type: Number, // Price per piece at order time
    required: true
  }
});

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  totalPacks: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true // Sum of (packQuantity * packSize)
  },
  businessName: {
    type: String,
    required: true
  },
  gstin: {
    type: String,
    default: ''
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Bank Transfer', 'UPI', 'Razorpay', 'WhatsApp Checkout'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  paymentReceipt: {
    type: String, // URL of uploaded receipt screenshot
    default: ''
  },
  paymentDetails: {
    type: Schema.Types.Mixed, // Razorpay order/payment IDs
    default: {}
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

export default mongoose.model('Order', OrderSchema);
