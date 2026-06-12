import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Women', 'Girls'],
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Brassieres', 'Panties'],
    trim: true
  },
  images: [{
    type: String
  }],
  wholesalePrice: {
    type: Number,
    required: true // Price per single item
  },
  retailPrice: {
    type: Number, // MSRP / MRP print price
    required: true
  },
  packSize: {
    type: Number, // Quantity per box/pack (e.g. 6, 10, 12)
    default: 10
  },
  sizes: [{
    type: String,
    enum: ['S', 'M', 'L', 'XL', 'XXL', 'Free Size']
  }],
  colors: [{
    type: String,
    default: 'Assorted'
  }],
  stock: {
    type: Number, // Stock in packs
    required: true,
    default: 100
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', ProductSchema);
