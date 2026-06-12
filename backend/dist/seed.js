"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("./models/User"));
const Product_1 = __importDefault(require("./models/Product"));
const Order_1 = __importDefault(require("./models/Order"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/riya_touch';
const productsData = [
    {
        name: "Rupa Frontline Premium Men's Ribbed Vest",
        description: "100% super combed cotton, contoured fit for maximum flexibility, breathable fabric, classic ribbed pattern, ideal for daily wear.",
        brand: "Rupa",
        category: "Men",
        type: "Vests",
        images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop&q=60"],
        wholesalePrice: 65, // Price per single piece
        retailPrice: 110, // MSRP print price
        packSize: 10, // Pieces in a single pack
        sizes: ["S", "M", "L", "XL"],
        colors: ["White"],
        stock: 80,
        isFeatured: true
    },
    {
        name: "Jockey Athletic Cotton Briefs (Pack of 5)",
        description: "Premium combed cotton fabric, elasticized waistband with Jockey branding, modern low-rise styling, durable double stitching.",
        brand: "Jockey",
        category: "Men",
        type: "Briefs",
        images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&auto=format&fit=crop&q=60"],
        wholesalePrice: 140,
        retailPrice: 220,
        packSize: 5,
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["Black", "Grey", "Blue"],
        stock: 50,
        isFeatured: true
    },
    {
        name: "Lux Cozi Classic Cotton Men's Boxers",
        description: "Pure cotton comfort, side pocket design, elasticated waist with drawcord, light checks pattern, loose fit for loungewear comfort.",
        brand: "Lux Cozi",
        category: "Men",
        type: "Boxers",
        images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&auto=format&fit=crop&q=60"],
        wholesalePrice: 95,
        retailPrice: 160,
        packSize: 6,
        sizes: ["M", "L", "XL"],
        colors: ["Assorted"],
        stock: 120,
        isFeatured: false
    },
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
        name: "Amul Macho Sporty Outer Elastic Briefs",
        description: "Super combed cotton fabric with high-tech elastic waistband, anatomical design for great support, sweat absorbent material.",
        brand: "Amul Macho",
        category: "Men",
        type: "Briefs",
        images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60"],
        wholesalePrice: 75,
        retailPrice: 125,
        packSize: 10,
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Grey", "Charcoal"],
        stock: 110,
        isFeatured: false
    },
    {
        name: "Dixcy Scott Boys Comfort Vests",
        description: "Pure cotton vests for boys, anti-bacterial finish, flatlock seams to avoid skin irritation, sweat absorption properties.",
        brand: "Dixcy Scott",
        category: "Kids",
        type: "Vests",
        images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500&auto=format&fit=crop&q=60"],
        wholesalePrice: 38,
        retailPrice: 65,
        packSize: 10,
        sizes: ["S", "M", "L"],
        colors: ["White"],
        stock: 200,
        isFeatured: false
    },
    {
        name: "Dollar Ultra Premium Men's Cotton Thermal Set",
        description: "Three-layered heat retention technology, lightweight quilted fabric, soft brushed inside, comfortable snug cuffs and neck.",
        brand: "Dollar",
        category: "Men",
        type: "Thermals",
        images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=60"],
        wholesalePrice: 280,
        retailPrice: 495,
        packSize: 4,
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["Grey", "Charcoal"],
        stock: 60,
        isFeatured: true
    }
];
const seedDB = async () => {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log('MongoDB connected for seeding...');
        // Clear existing data
        await User_1.default.deleteMany({});
        await Product_1.default.deleteMany({});
        await Order_1.default.deleteMany({});
        console.log('Cleared existing database entries.');
        // Seed Users
        const salt = await bcryptjs_1.default.genSalt(10);
        const adminPassword = await bcryptjs_1.default.hash('admin123', salt);
        const customerPassword = await bcryptjs_1.default.hash('buyer123', salt);
        const adminUser = new User_1.default({
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
        const customerUser = new User_1.default({
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
        await Product_1.default.insertMany(productsData);
        console.log(`Seeded ${productsData.length} undergarments products.`);
        console.log('Database seeded successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
seedDB();
