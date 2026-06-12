import express, { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { auth, AuthRequest } from '../middleware/auth';
import { validate, registerSchema, loginSchema } from '../middleware/validate';

const router = express.Router();

// Register User
router.post('/register', validate(registerSchema), async (req: any, res: Response) => {
  try {
    const { name, email, password, phone, businessName, gstin, address } = req.body;

    // Validate inputs
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    // Check existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
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
    const JWT_SECRET = process.env.JWT_SECRET || 'ISsY6b+/8xX7PK0X0P31hOy+ug1i3whEK+h+uoXZA6o=';
    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: '7d' });

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
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// Login User
router.post('/login', validate(loginSchema), async (req: any, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Find User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT
    const JWT_SECRET = process.env.JWT_SECRET || 'ISsY6b+/8xX7PK0X0P31hOy+ug1i3whEK+h+uoXZA6o=';
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

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
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// Get User Profile
router.get('/me', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error fetching user', error: error.message });
  }
});

// Update User Profile
router.put('/profile', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, businessName, gstin, address } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (businessName !== undefined) user.businessName = businessName;
    if (gstin !== undefined) user.gstin = gstin;
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
  } catch (error: any) {
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
});

export default router;
