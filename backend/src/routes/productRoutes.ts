import express, { Response } from 'express';
import Product from '../models/Product';
import { auth, admin } from '../middleware/auth';

const router = express.Router();

// Get low stock products (Admin only)
router.get('/low-stock', auth, admin, async (req: any, res: Response) => {
  try {
    const threshold = parseInt(req.query.threshold as string) || 10;
    const products = await Product.find({ stock: { $lte: threshold } }).sort({ stock: 1 });
    res.json({ count: products.length, products });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching low stock products', error: error.message });
  }
});

// Get unique brands list
router.get('/brands', async (req, res: Response) => {
  try {
    const brands = await Product.distinct('brand');
    res.json(brands);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching brands', error: error.message });
  }
});

// Get all products (with optional filtering)
router.get('/', async (req: any, res: Response) => {
  try {
    const { category, brand, type, search, isFeatured } = req.query;
    const query: any = {};

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (type) query.type = type;
    if (isFeatured) query.isFeatured = isFeatured === 'true';

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get a single product
router.get('/:id', async (req, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Create product (Admin only)
router.post('/', auth, admin, async (req: any, res: Response) => {
  try {
    const { name, description, brand, category, type, images, wholesalePrice, retailPrice, packSize, sizes, colors, stock, isFeatured } = req.body;

    if (!name || !description || !brand || !category || !type || !wholesalePrice || !retailPrice) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newProduct = new Product({
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
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// Update product (Admin only)
router.put('/:id', auth, admin, async (req: any, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete product (Admin only)
router.delete('/:id', auth, admin, async (req: any, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

export default router;
