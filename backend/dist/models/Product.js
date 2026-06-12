"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ProductSchema = new mongoose_1.Schema({
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
        enum: ['Men', 'Women', 'Kids'],
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Briefs', 'Boxers', 'Vests', 'Brassieres', 'Panties', 'Socks', 'Thermals', 'Other'],
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
exports.default = mongoose_1.default.model('Product', ProductSchema);
