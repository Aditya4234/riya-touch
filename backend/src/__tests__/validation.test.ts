import { registerSchema, loginSchema, productSchema, orderSchema } from '../middleware/validate';

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should accept valid registration data', () => {
      const data = {
        name: 'Test Shop',
        email: 'shop@test.com',
        password: 'Password1',
        phone: '+919876543210'
      };
      const result = registerSchema.parse(data);
      expect(result.name).toBe('Test Shop');
    });

    it('should reject short password', () => {
      const data = {
        name: 'Test',
        email: 'test@test.com',
        password: 'short',
        phone: '+919876543210'
      };
      expect(() => registerSchema.parse(data)).toThrow();
    });

    it('should reject missing uppercase in password', () => {
      const data = {
        name: 'Test',
        email: 'test@test.com',
        password: 'password1',
        phone: '+919876543210'
      };
      expect(() => registerSchema.parse(data)).toThrow();
    });

    it('should reject invalid email', () => {
      const data = {
        name: 'Test',
        email: 'not-an-email',
        password: 'Password1',
        phone: '+919876543210'
      };
      expect(() => registerSchema.parse(data)).toThrow();
    });

    it('should reject invalid phone', () => {
      const data = {
        name: 'Test',
        email: 'test@test.com',
        password: 'Password1',
        phone: '123'
      };
      expect(() => registerSchema.parse(data)).toThrow();
    });
  });

  describe('loginSchema', () => {
    it('should accept valid login data', () => {
      const data = { email: 'test@test.com', password: 'Password1' };
      const result = loginSchema.parse(data);
      expect(result.email).toBe('test@test.com');
    });

    it('should reject empty password', () => {
      expect(() => loginSchema.parse({ email: 'test@test.com', password: '' })).toThrow();
    });
  });

  describe('productSchema', () => {
    it('should accept valid product data', () => {
      const data = {
        name: 'Test Product',
        description: 'A valid product description with enough chars',
        brand: 'Test Brand',
        category: 'Men',
        type: 'Briefs',
        wholesalePrice: 50,
        retailPrice: 100
      };
      const result = productSchema.parse(data);
      expect(result.category).toBe('Men');
    });

    it('should reject negative price', () => {
      const data = {
        name: 'Test',
        description: 'A valid product description',
        brand: 'Brand',
        category: 'Men',
        type: 'Briefs',
        wholesalePrice: -50,
        retailPrice: 100
      };
      expect(() => productSchema.parse(data)).toThrow();
    });

    it('should reject invalid category', () => {
      const data = {
        name: 'Test',
        description: 'A valid product description',
        brand: 'Brand',
        category: 'Invalid',
        type: 'Briefs',
        wholesalePrice: 50,
        retailPrice: 100
      };
      expect(() => productSchema.parse(data)).toThrow();
    });
  });

  describe('orderSchema', () => {
    it('should accept valid order data', () => {
      const data = {
        items: [{ productId: '507f1f77bcf86cd799439011', packQuantity: 2 }],
        shippingAddress: {
          street: '123 Main St',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001'
        },
        paymentMethod: 'COD'
      };
      const result = orderSchema.parse(data);
      expect(result.items).toHaveLength(1);
    });

    it('should reject empty items', () => {
      const data = {
        items: [],
        shippingAddress: {
          street: '123 Main St',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001'
        },
        paymentMethod: 'COD'
      };
      expect(() => orderSchema.parse(data)).toThrow();
    });

    it('should reject invalid pincode', () => {
      const data = {
        items: [{ productId: '507f1f77bcf86cd799439011', packQuantity: 2 }],
        shippingAddress: {
          street: '123 Main St',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '123'
        },
        paymentMethod: 'COD'
      };
      expect(() => orderSchema.parse(data)).toThrow();
    });
  });
});
