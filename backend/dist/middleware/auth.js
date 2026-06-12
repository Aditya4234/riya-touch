"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }
        const JWT_SECRET = process.env.JWT_SECRET || 'riyatouch_wholesale_secret_key_2026_jwt';
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_1.default.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Token is valid, but user was not found' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token is invalid or expired' });
    }
};
exports.auth = auth;
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ message: 'Access denied: Admin resources' });
    }
};
exports.admin = admin;
