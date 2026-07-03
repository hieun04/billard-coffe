import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Search } from 'lucide-react';
import ProductCard from '@/components/pos/ProductCard';
import CartPanel from '@/components/pos/CartPanel';
import { getProducts, getCategories } from '@/api/products';
import { getTables } from '@/api/tables';
import { Skeleton } from '@/components/ui/Skeleton';
import { toast } from 'sonner';
import { getTableLabel } from '@/lib/utils';
import { Input } from '@/components/ui/Input';

const FILTER_OPTIONS = ['Đồ uống', 'Đồ ăn nhẹ', 'Khác'];

function normalizeCategoryLabel(name = '') {
  const normalized = String(name).trim().toLowerCase();
  if (['bia', 'nuoc uong', 'nước uống', 'tra', 'trà', 'ca phe', 'cà phê', 'coffee', 'drink', 'drinks', 'đồ uống'].includes(normalized)) {
    return 'Đồ uống';
  }
  if (['do an', 'đồ ăn', 'snack', 'thuc an nhe', 'thức ăn nhẹ', 'food', 'đồ ăn nhẹ'].includes(normalized)) {
    return 'Đồ ăn nhẹ';
  }
  if (['khac', 'khác', 'other'].includes(normalized)) {
    return 'Khác';
  }
  return 'Khác';
}

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [tableId, setTableId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getCategories(), getTables()])
      .then(([prods, cats, tableData]) => {
        setProducts(prods.products || prods || []);
        setCategories(cats.categories || cats || []);
        setTables(tableData.tables || tableData || []);
      })
      .catch(() => toast.error('Lỗi khi tải dữ liệu bán hàng'))
      .finally(() => setLoading(false));
  }, []);

  const availableTables = tables.filter(t => t.status === 'empty' || t.status === 'available');
  const selectedTable = tables.find(t => String(t.id) === String(tableId));
  const getCategoryName = (id) => categories.find(c => c.id == id)?.name || 'Khác';
  const categoryOptions = FILTER_OPTIONS;

  const filteredProducts = products.filter(p => {
    const matchCat = activeCategory === 'all' || normalizeCategoryLabel(getCategoryName(p.category_id)) === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        id: product.id,
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      }];
    });
    toast.success(`Đã thêm ${product.name}`);
  };

  const updateCartItem = (id, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
    }
  };

  const removeCartItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const handleOrderComplete = () => {
    setCart([]);
    setTableId(null);
    toast.success('Đơn hàng đã được tạo!');
  };

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6">
      {/* Left - Products */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search & categories */}
        <div className="mb-4 space-y-3">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="relative">
              <Input
                placeholder="Tìm sản phẩm..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-10"
              />
            </div>
            <select
              value={tableId || ''}
              onChange={e => setTableId(e.target.value || null)}
              className="w-full h-10 px-3 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Không gắn bàn / khu cafe</option>
              {availableTables.map(table => (
                <option key={table.id} value={table.id}>
                  Bàn {getTableLabel(table)} · {table.rate_per_hour ? `${table.rate_per_hour.toLocaleString('vi-VN')}đ/giờ` : 'Có thể phục vụ'}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Tất cả
            </button>
            {categoryOptions.map(categoryName => (
              <button
                key={categoryName}
                onClick={() => setActiveCategory(categoryName)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === categoryName
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {categoryName}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-[160px] rounded-2xl" />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <UtensilsCrossed size={40} className="text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">Không có sản phẩm nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right - Cart */}
      <div className="w-80 xl:w-96 shrink-0 rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
        <CartPanel
          cart={cart}
          onUpdateItem={updateCartItem}
          onRemoveItem={removeCartItem}
          onClearCart={clearCart}
          tableId={tableId}
          selectedTable={selectedTable}
          onOrderComplete={handleOrderComplete}
        />
      </div>
    </div>
  );
}
