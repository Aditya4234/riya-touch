"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Register User
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, businessName, gstin, address } = req.body;
        // Validate inputs
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'Please enter all required fields' });
        }
        // Check existing email
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'A user with this email already exists' });
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create user
        const newUser = new User_1.default({
            name,
            email,
            password: hashedPassword,
            phone,
            businessName,
            gstin,
            address,
            role: 'customer' // default role is customer
        });
        const savedUser = await newUser.save();
        // Create JWT
        const JWT_SECRET = process.env.JWT_SECRET || 'riyatouch_wholesale_secret_key_2026_jwt';
        const token = jsonwebtoken_1.default.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                phone: savedUser.phone,
                businessName: savedUser.businessName,
                gstin: savedUser.gstin,
                address: savedUser.address,
                role: savedUser.role
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
});
// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }
        // Find User
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Verify Password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Create JWT
        const JWT_SECRET = process.env.JWT_SECRET || 'riyatouch_wholesale_secret_key_2026_jwt';
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                businessName: user.businessName,
                gstin: user.gstin,
                address: user.address,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
});
// Get User Profile
router.get('/me', auth_1.auth, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching user', error: error.message });
    }
});
// Update User Profile
router.put('/profile', auth_1.auth, async (req, res) => {
    try {
        const { name, phone, businessName, gstin, address } = req.body;
        const user = await User_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (name)
            user.name = name;
        if (phone)
            user.phone = phone;
        if (businessName !== undefined)
            user.businessName = businessName;
        if (gstin !== undefined)
            user.gstin = gstin;
        if (address) {
            user.address = {
                street: address.street ?? user.address?.street,
                city: address.city ?? user.address?.city,
                state: address.state ?? user.address?.state,
                pincode: address.pincode ?? user.address?.pincode
            };
        }
        const updatedUser = await user.save();
        res.json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            businessName: updatedUser.businessName,
            gstin: updatedUser.gstin,
            address: updatedUser.address,
            role: updatedUser.role
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error updating profile', error: error.message });
    }
});
exports.default = router;
