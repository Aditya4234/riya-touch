import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Product from './models/Product';
import Order from './models/Order';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/riya_touch';

const productsData = [
  {
    name: "Trylo Juliet Comfort Cotton Panties Pack",
    description: "Super soft combed cotton fabric, thin elastic waistband leaves no marks, breathable and hygienic everyday comfort hipsters.",
    brand: "Juliet",
    category: "Women",
    type: "Panties",
    images: ["https://images.unsplash.com/photo-1618677831708-0e7fda3148b4?w=500&auto=format&fit=crop&q=60"],
    wholesalePrice: 45,
    retailPrice: 85,
    packSize: 12,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Assorted"],
    stock: 150,
    isFeatured: true
  },
  {
    name: "Trylo Premium Soft Cup Cotton Brassiere",
    description: "Non-wired, non-padded cups for natural shape and comfort, broad shoulder straps for optimal support, full coverage double-layered design.",
    brand: "Trylo",
    category: "Women",
    type: "Brassieres",
    images: ["https://images.unsplash.com/photo-1508427953056-b00b8d78ecf5?w=500&auto=format&fit=crop&q=60"],
    wholesalePrice: 110,
    retailPrice: 195,
    packSize: 6,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Beige", "Black"],
    stock: 90,
    isFeatured: true
  },
  {
    name: "Riya Touch Girls Cotton Panties Pack",
    description: "100% pure cotton panties for girls, colorful patterns, soft leg bands, hypoallergenic fabric, ideal for sensitive skin. Available in assorted color packs.",
    brand: "Riya Touch",
    category: "Girls",
    type: "Panties",
    images: ["https://images.unsplash.com/photo-1618677831708-0e7fda3148b4?w=500&auto=format&fit=crop&q=60"],
    wholesalePrice: 28,
    retailPrice: 50,
    packSize: 12,
    sizes: ["S", "M", "L"],
    colors: ["Assorted"],
    stock: 250,
    isFeatured: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing database entries.');

    // Seed Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const customerPassword = await bcrypt.hash('buyer123', salt);

    const adminUser = new User({
      name: "Riya Touch Admin",
      email: "admin@riyatouch.com",
      password: adminPassword,
      phone: "+919876543210",
      businessName: "Riya Touch Wholesale",
      gstin: "07AAAAA1111A1Z1",
      address: {
        street: "Shop 12, Wholesale Cloth Market, Gandhinagar",
        city: "Delhi",
        state: "Delhi",
        pincode: "110031"
      },
      role: "admin"
    });

    const customerUser = new User({
      name: "Aditya Gupta",
      email: "buyer@shop.com",
      password: customerPassword,
      phone: "+919999988888",
      businessName: "Gupta Undergarments & Hosiery",
      gstin: "07BBBBB2222B2Z2",
      address: {
        street: "Bazar Gali No 4, Krishna Nagar",
        city: "Delhi",
        state: "Delhi",
        pincode: "110051"
      },
      role: "customer"
    });

    await adminUser.save();
    await customerUser.save();
    console.log('Seed users created: admin@riyatouch.com / admin123, buyer@shop.com / buyer123');

    // Seed Products
    await Product.insertMany(productsData);
    console.log(`Seeded ${productsData.length} undergarments products.`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
