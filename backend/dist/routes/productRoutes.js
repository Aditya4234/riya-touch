"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Product_1 = __importDefault(require("../models/Product"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get unique brands list
router.get('/brands', async (req, res) => {
    try {
        const brands = await Product_1.default.distinct('brand');
        res.json(brands);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching brands', error: error.message });
    }
});
// Get all products (with optional filtering)
router.get('/', async (req, res) => {
    try {
        const { category, brand, type, search, isFeatured } = req.query;
        const query = {};
        if (category)
            query.category = category;
        if (brand)
            query.brand = brand;
        if (type)
            query.type = type;
        if (isFeatured)
            query.isFeatured = isFeatured === 'true';
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }
        const products = await Product_1.default.find(query).sort({ createdAt: -1 });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});
// Get a single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});
// Create product (Admin only)
router.post('/', auth_1.auth, auth_1.admin, async (req, res) => {
    try {
        const { name, description, brand, category, type, images, wholesalePrice, retailPrice, packSize, sizes, colors, stock, isFeatured } = req.body;
        if (!name || !description || !brand || !category || !type || !wholesalePrice || !retailPrice) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const newProduct = new Product_1.default({
            name,
            description,
            brand,
            category,
            type,
            images: images || [],
            wholesalePrice,
            retailPrice,
            packSize: packSize || 10,
            sizes: sizes || ['S', 'M', 'L', 'XL'],
            colors: colors || ['Assorted'],
            stock: stock || 100,
            isFeatured: isFeatured || false
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});
// Update product (Admin only)
router.put('/:id', auth_1.auth, auth_1.admin, async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});
// Delete product (Admin only)
router.delete('/:id', auth_1.auth, auth_1.admin, async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});
exports.default = router;
