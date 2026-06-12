import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      const errors = error.errors?.map((e: any) => ({
        field: e.path.join('.'),
        message: e.message
      })) || [{ field: 'body', message: 'Invalid request body' }];
      res.status(400).json({ message: 'Validation failed', errors });
    }
  };
};

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z.string().regex(/^\+?\d{10,15}$/, 'Invalid phone number'),
  businessName: z.string().optional(),
  gstin: z.string().regex(/^[0-9A-Z]{15}$/, 'Invalid GSTIN format').optional().or(z.literal('')),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional()
  }).optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const productSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(2000),
  brand: z.string().min(2).max(50),
  category: z.enum(['Men', 'Women', 'Girls', 'Kids']),
  type: z.string().min(2).max(50),
  images: z.array(z.string().url()).optional(),
  wholesalePrice: z.number().positive('Wholesale price must be positive'),
  retailPrice: z.number().positive('Retail price must be positive'),
  packSize: z.number().int().positive().optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  stock: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional()
});

export const orderItemSchema = z.object({
  productId: z.string().length(24, 'Invalid product ID'),
  size: z.string().optional(),
  color: z.string().optional(),
  packQuantity: z.number().int().positive('Pack quantity must be at least 1')
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  shippingAddress: z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode')
  }),
  paymentMethod: z.enum(['COD', 'Bank Transfer', 'UPI']),
  businessName: z.string().optional(),
  gstin: z.string().optional(),
  paymentReceipt: z.string().optional()
});
