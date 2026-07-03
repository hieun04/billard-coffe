import { z } from 'zod';

// Auth
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Products
export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  category_id: z.number().int().positive().optional(),
  price: z.number().positive('Price must be positive'),
  stock: z.number().int().min(0).default(0),
  unit: z.string().max(50).optional(),
  image_url: z.string().optional().or(z.literal('')),
  cost_price: z.number().min(0).optional(),
});

export const productUpdateSchema = productSchema.partial();

// Customers
export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  phone: z.string().min(6, 'Invalid phone number').max(20),
  points: z.number().int().min(0).default(0),
  tier: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
});

export const addPointsSchema = z.object({
  points: z.number().int().min(1, 'Points must be positive'),
  note: z.string().max(500).optional(),
});

// Orders
export const orderSchema = z.object({
  customer_id: z.number().int().positive().optional(),
  table_id: z.number().int().positive().optional(),
  items: z.array(z.object({
    product_id: z.number().int().positive(),
    quantity: z.number().int().positive(),
  })).min(1, 'At least one item required'),
  payment_method: z.enum(['cash', 'transfer', 'vnpay', 'momo']).optional(),
  discount: z.number().min(0).default(0),
  note: z.string().max(500).optional(),
  voucher_id: z.number().int().positive().optional(),
});

// Tables
export const startSessionSchema = z.object({
  customer_id: z.number().int().positive().optional().nullable(),
});

export const addDrinkSchema = z.object({
  product_id: z.number().int().positive('Product ID required'),
  quantity: z.number().int().positive().default(1),
});

export const tableSchema = z.object({
  table_number: z.string().min(1, 'Số bàn là bắt buộc').max(50, 'Tối đa 50 ký tự'),
  rate_per_hour: z.number().positive('Giá/giờ phải > 0').default(50000),
  description: z.string().max(500, 'Mô tả tối đa 500 ký tự').optional().or(z.literal('')),
});

// Bookings
export const bookingSchema = z.object({
  customer_name: z.string().min(1, 'Customer name required').max(200),
  phone: z.string().min(6).max(20),
  table_id: z.number().int().positive().optional(),
  start_time: z.string(),
  end_time: z.string().optional(),
  notes: z.string().max(500).optional(),
});

// Staff
export const staffSchema = z.object({
  name: z.string().min(1, 'Name required').max(200),
  role: z.enum(['admin', 'manager', 'cashier', 'server']).optional(),
});

// Purchases
export const purchaseSchema = z.object({
  supplier_id: z.number().int().positive().optional(),
  items: z.array(z.object({
    product_id: z.number().int().positive(),
    quantity: z.number().int().positive(),
    unit_cost: z.number().positive(),
  })).min(1),
});

// Vouchers
export const voucherSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 chars').max(50),
  type: z.enum(['percent', 'fixed']),
  value: z.number().positive(),
  expiry_date: z.string().optional(),
  min_order: z.number().min(0).default(0),
  quantity: z.number().int().positive().optional(),
});

// Inventory
export const adjustStockSchema = z.object({
  quantity: z.number().int(),
  reason: z.string().max(200).optional(),
});

// Settings
export const changePasswordSchema = z.object({
  old_password: z.string().min(1, 'Old password required'),
  new_password: z.string().min(6, 'New password must be at least 6 characters'),
  confirm_password: z.string().min(1, 'Please confirm your new password'),
});

// AI Chat
export const chatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000),
});

// Helper to create validation middleware
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const data = source === 'query' ? req.query : req.body;
      req.body = schema.parse(data);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const messages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        return res.status(400).json({ success: false, error: messages[0], errors: err.errors });
      }
      return res.status(400).json({ success: false, error: err.message });
    }
  };
}
