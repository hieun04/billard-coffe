import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Star, ChevronRight, Utensils, Wifi, Car, Users, CheckCircle, ArrowRight, Coffee, Gamepad2 } from 'lucide-react';
import axios from 'axios';
import ChatWidget from '@/components/ai/ChatWidget';
import { formatCurrency, resolveImageUrl, getTableLabel } from '@/lib/utils';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const CATEGORY_ICONS = {
  'Bia': '🍺',
  'Nuoc uong': '🥤',
  'Do an': '🍿',
  'default': '☕',
};

function getCategoryIcon(cat) {
  return CATEGORY_ICONS[cat] || CATEGORY_ICONS['default'];
}

async function fetchPublicData() {
  const [settingsRes, tablesRes, productsRes] = await Promise.all([
    axios.get('/api/settings/public').catch(() => ({ data: { settings: {} } })),
    axios.get('/api/tables/public').catch(() => ({ data: { tables: [] } })),
    axios.get('/api/products/public').catch(() => ({ data: { products: [] } })),
  ]);
  return {
    settings: settingsRes.data.settings || {},
    tables: tablesRes.data.tables || [],
    products: productsRes.data.products || [],
  };
}

const STATUS_LABELS = {
  available: { label: 'Trống', color: 'bg-green-500', bg: 'bg-green-50 text-green-700' },
  occupied: { label: 'Đang chơi', color: 'bg-red-500', bg: 'bg-red-50 text-red-700' },
  reserved: { label: 'Đã đặt', color: 'bg-yellow-500', bg: 'bg-yellow-50 text-yellow-700' },
};

// Space images — dùng ảnh thực từ settings hoặc fallback Unsplash
const DEFAULT_SPACES = {
  billiard: 'https://images.unsplash.com/photo-1616174339498-75932ce10f63?w=800&q=80',
  cafe: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
};

export default function LandingPage() {
  const [data, setData] = useState({ settings: {}, tables: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    fetchPublicData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const { settings, tables, products } = data;
  const availableTables = tables.filter(t => t.status === 'available' || t.status === 'empty').length;
  const totalTables = tables.length;

  // Group products by category for the menu
  const productsByCategory = {};
  for (const p of products) {
    const cat = p.category || 'Khac';
    if (!productsByCategory[cat]) productsByCategory[cat] = [];
    productsByCategory[cat].push(p);
  }
  const categories = Object.keys(productsByCategory);

  const heroImage = settings.hero_image || DEFAULT_SPACES.hero;
  const billiardImage = settings.billiard_space_image || DEFAULT_SPACES.billiard;
  const cafeImage = settings.cafe_space_image || DEFAULT_SPACES.cafe;

  const CATEGORY_LABELS = {
    'Bia': 'Bia các loại',
    'Nuoc uong': 'Nước uống',
    'Do an': 'Đồ ăn',
    'Khac': 'Khác',
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="Logo" className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">B</span>
                </div>
              )}
              <span className="font-bold text-lg">{settings.name || 'Billiard Cafe'}</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="#home" className="hover:text-primary transition-colors">Trang chủ</a>
              <a href="#spaces" className="hover:text-primary transition-colors">Không gian</a>
              <a href="#tables" className="hover:text-primary transition-colors">Bàn bida</a>
              <a href="#menu" className="hover:text-primary transition-colors">Menu</a>
              <a href="#contact" className="hover:text-primary transition-colors">Liên hệ</a>
              <a href="/app/login" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Đăng nhập
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Không gian quán"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-2xl">
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                Quán bida được yêu thích nhất khu vực
              </motion.div>

              <motion.h1 variants={item} className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-white">
                {settings.name || 'Billiard Cafe'}<br />
                <span className="text-primary">Kết nối đam mê</span>
              </motion.h1>

              <motion.p variants={item} className="text-white/80 text-lg mb-8 max-w-lg">
                Không gian hiện đại, bàn bida chuẩn quốc tế, đồ uống ngon — phù hợp gặp gỡ bạn bè và giải trí cuối tuần.
              </motion.p>

              <motion.div variants={item} className="flex flex-wrap gap-4">
                <a href="#tables" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                  Đặt bàn ngay <ChevronRight size={18} />
                </a>
                <a href="#menu" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white border border-white/30 hover:bg-white/20 transition-colors backdrop-blur-sm">
                  Xem menu
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div variants={item} className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/20">
                <div>
                  <p className="text-2xl font-bold text-white">{totalTables}</p>
                  <p className="text-sm text-white/60">Bàn bida</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">{availableTables}</p>
                  <p className="text-sm text-white/60">Bàn trống</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-400">4.8</p>
                  <p className="text-sm text-white/60">Điểm đánh giá</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Gamepad2, title: 'Bàn bida chuẩn quốc tế', desc: '10 bàn chất lượng cao, đủ loại kích thước' },
              { icon: Utensils, title: 'Đồ uống đa dạng', desc: 'Bia, nước giải khát, cà phê...' },
              { icon: Wifi, title: 'Wifi miễn phí', desc: 'Kết nối internet tốc độ cao' },
              { icon: Car, title: 'Chỗ để xe rộng', desc: 'Gửi xe an toàn, miễn phí' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background rounded-2xl p-5 border hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Spaces Section */}
      <section id="spaces" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Không gian quán</h2>
            <p className="text-muted-foreground">Khu vực chơi bida & quán cafe trong cùng một địa điểm</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Billiard Space */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative rounded-3xl overflow-hidden cursor-pointer"
            >
              <div className="aspect-[4/3]">
                <img
                  src={(() => {
                    const imgs = (settings.billiard_gallery_images || '').split(',').filter(Boolean);
                    return imgs[0] || billiardImage;
                  })()}
                  alt="Khu vực chơi bida"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = billiardImage; }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/90 flex items-center justify-center">
                    <Gamepad2 size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Khu vực chơi bida</h3>
                    <p className="text-white/70 text-sm">{totalTables} bàn bida các loại</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm mb-3">
                  Không gian rộng rãi, thoáng mát, ánh sáng chuẩn thi đấu. Phù hợp tất cả các trình độ.
                </p>
                <a href="#tables" className="inline-flex items-center gap-1 text-primary text-sm font-medium text-white/90 hover:text-white">
                  Xem bàn trống <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>

            {/* Cafe Space */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative rounded-3xl overflow-hidden cursor-pointer"
            >
              <div className="aspect-[4/3]">
                <img
                  src={cafeImage}
                  alt="Khu vực cafe"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = DEFAULT_SPACES.cafe; }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/90 flex items-center justify-center">
                    <Coffee size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Khu vực cafe & nước</h3>
                    <p className="text-white/70 text-sm">Hơn {products.length} món để chọn</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm mb-3">
                  Không gian cafe ấm cúng, đồ uống đa dạng, phù hợp thư giãn và làm việc cùng bạn bè.
                </p>
                <a href="#menu" className="inline-flex items-center gap-1 text-orange-300 text-sm font-medium text-white/90 hover:text-white">
                  Xem menu <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Billiard Gallery Strip */}
          {(() => {
            const imgs = (settings.billiard_gallery_images || '').split(',').filter(Boolean);
            if (imgs.length <= 1) return null;
            return (
              <div className="mt-6">
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {imgs.map((url, i) => (
                    <img
                      key={i}
                      src={url.trim()}
                      alt={`Khu vực bi-a ${i + 1}`}
                      className="w-48 h-32 rounded-2xl object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity border-2 border-transparent hover:border-primary"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Tables */}
      <section id="tables" className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Danh sách bàn bida</h2>
            <p className="text-muted-foreground">Tình trạng bàn cập nhật real-time. Bạn có thể hỏi trợ lý ảo để được gợi ý bàn phù hợp.</p>
          </motion.div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : tables.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Chưa có thông tin bàn bida.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tables.map((table, i) => {
                const status = STATUS_LABELS[table.status] || STATUS_LABELS.available;
                const rate = table.rate_per_hour || settings.default_rate || 50000;
                return (
                  <motion.div
                    key={table.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`rounded-2xl border p-5 transition-all ${
                      table.status === 'available' || table.status === 'empty'
                        ? 'hover:border-green-400 hover:shadow-md'
                        : 'opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xl font-bold">
                        🎱
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.bg}`}>
                        {status.label}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{getTableLabel(table)}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{formatCurrency(rate)} / giờ</p>
                    {table.status === 'available' || table.status === 'empty' ? (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full" /> Sẵn sàng đặt
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {table.current_customer_name ? `Đang: ${table.current_customer_name}` : 'Đang sử dụng'}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Menu đồ uống & món ăn</h2>
            <p className="text-muted-foreground">Đa dạng lựa chọn, giá cả hợp lý, phục vụ tận bàn</p>
          </motion.div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Chưa có menu. Hãy liên hệ quán để biết thêm chi tiết.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {categories.map((cat, catIdx) => (
                <div key={cat}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl">{getCategoryIcon(cat)}</span>
                    <h3 className="text-xl font-bold">{CATEGORY_LABELS[cat] || cat}</h3>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-sm text-muted-foreground">{productsByCategory[cat].length} món</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {productsByCategory[cat].map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-muted/30 rounded-2xl border p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-xl flex-shrink-0">
                            {p.image_url ? (
                              <img src={resolveImageUrl(p.image_url)} alt={p.name} className="w-full h-full object-cover rounded-xl" onError={(e) => { e.target.style.display = 'none'; }} />
                            ) : (
                              <span>{getCategoryIcon(p.category)}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{p.name}</h4>
                            <p className="text-primary font-bold text-sm mt-0.5">{formatCurrency(p.price)}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold mb-3">Bảng giá dịch vụ</h2>
            <p className="text-muted-foreground mb-10">Giá thuê bàn & các dịch vụ tại quán</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/5 to-orange-50 rounded-3xl p-8 border"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="font-medium flex items-center gap-2">
                  <Gamepad2 size={16} className="text-primary" /> Thuê bàn bida
                </span>
                <span className="font-bold text-primary text-lg">{formatCurrency(settings.default_rate || 50000)} / giờ</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="font-medium flex items-center gap-2">
                  <Wifi size={16} className="text-primary" /> Wifi
                </span>
                <span className="font-semibold text-green-600">Miễn phí</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="font-medium flex items-center gap-2">
                  <Car size={16} className="text-primary" /> Gửi xe máy / ô tô
                </span>
                <span className="font-semibold text-green-600">Miễn phí</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="font-medium flex items-center gap-2">
                  <Users size={16} className="text-primary" /> Phòng VIP (đặt trước)
                </span>
                <span className="font-semibold">Liên hệ hotline</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold mb-6">Thông tin liên hệ</h2>
              <div className="space-y-5">
                {settings.name && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-lg">🏠</span>
                    </div>
                    <div>
                      <p className="font-medium">{settings.name}</p>
                      <p className="text-sm text-muted-foreground">{settings.address || 'Địa chỉ quán'}</p>
                    </div>
                  </div>
                )}
                {settings.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Hotline</p>
                      <a href={`tel:${settings.phone}`} className="text-sm text-primary hover:underline">{settings.phone}</a>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Giờ mở cửa</p>
                    <p className="text-sm text-muted-foreground">
                      {settings.open_time || '08:00'} — {settings.close_time || '23:00'} hàng ngày
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Địa chỉ</p>
                    <p className="text-sm text-muted-foreground">{settings.address || 'TP. Hồ Chí Minh'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Google Maps */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-muted rounded-3xl overflow-hidden min-h-[300px] border">
              {settings.lat && settings.lng ? (
                <iframe
                  title="Vị trí cửa hàng"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '300px' }}
                  src={`https://www.google.com/maps?q=${settings.lat},${settings.lng}&z=15&output=embed`}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="h-full min-h-[300px] flex items-center justify-center text-center text-muted-foreground">
                  <div>
                    <MapPin size={40} className="mx-auto mb-3 opacity-30" />
                    <p>Chưa có tọa độ bản đồ</p>
                    <p className="text-sm mt-1">Cài đặt trong trang Admin</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 {settings.name || 'Billiard Cafe'}. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="/app/login" className="hover:text-foreground transition-colors">Quản lý</a>
              <span>Hotline: {settings.phone || '0901 234 567'}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <ChatWidget businessInfo={settings} />
    </div>
  );
}
