import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, LayoutDashboard, Users, ShoppingBag, ClipboardList, Package, UserCog, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập tài khoản và mật khẩu');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: LayoutDashboard, label: 'Dashboard', desc: 'Tổng quan hệ thống' },
    { icon: Users, label: 'Khách hàng', desc: 'Quản lý khách hàng' },
    { icon: ShoppingBag, label: 'Bán hàng', desc: 'Tạo đơn nhanh' },
    { icon: ClipboardList, label: 'Đơn hàng', desc: 'Lịch sử đơn' },
    { icon: Package, label: 'Tồn kho', desc: 'Quản lý kho' },
    { icon: UserCog, label: 'Nhân viên', desc: 'Phân quyền' },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-10 relative overflow-hidden">
        {/* Dark indigo gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0f1a2e] to-[#1a1040]" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99,102,241,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139,92,246,0.08) 0%, transparent 40%)'
        }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(255,255,255,0.15)" />
                <path d="M8 10h8M8 14h5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <span className="block text-2xl font-bold tracking-tight text-white">Billiard Cafe</span>
              <span className="text-sm text-indigo-400/60">Hệ thống quản lý</span>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Quản lý<br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Hiệu quả hơn
            </span>
          </h1>
          <p className="text-base text-white/50 max-w-md leading-relaxed">
            Hệ thống quản lý hiện đại cho sân billiard cafe. Theo dõi bàn, đơn hàng và doanh thu real-time.
          </p>
        </div>

        {/* Features grid */}
        <div className="relative z-10 grid grid-cols-3 gap-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-4 backdrop-blur-sm">
                <Icon size={18} className="text-indigo-400 mb-2" />
                <p className="text-sm font-semibold text-white">{f.label}</p>
                <p className="text-xs text-white/30 mt-0.5">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom */}
        <p className="relative z-10 text-xs text-white/20 text-center">
          Billiard Cafe Manager v2.0
        </p>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Mobile logo + Back button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.15)" />
                  <path d="M8 10h8M8 14h5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-bold text-xl text-white">Billiard Cafe</span>
            </div>
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-xl hover:bg-white/10"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Trở về trang chủ</span>
              <span className="sm:hidden">Trang chủ</span>
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white p-6 sm:p-8 shadow-2xl shadow-black/20">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Đăng nhập</h2>
              <p className="text-sm text-slate-500 mt-1.5">
                Nhập thông tin tài khoản để truy cập hệ thống
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-2xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-500"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Tài khoản</label>
                <Input
                  type="text"
                  placeholder="Tài khoản đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Mật khẩu</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20"
                loading={loading}
              >
                <LogIn size={18} />
                Đăng nhập
              </Button>
            </form>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
