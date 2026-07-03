import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, DollarSign, Clock, Star, Users, Database, UserPlus, Shield, Download, KeyRound, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { getSettings, updateBusiness, updatePricing, getUsers, createUser, deleteUser, changePassword, backupData, getBackups, downloadBackup, updateMedia } from '@/api/settings';
import { updateHours, updateLoyalty } from '@/api/settings';
import { uploadImage } from '@/api/products';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const sections = [
  { key: 'business', label: 'Thông tin kinh doanh', icon: Building2 },
  { key: 'pricing', label: 'Giá dịch vụ', icon: DollarSign },
  { key: 'hours', label: 'Giờ mở cửa', icon: Clock },
  { key: 'loyalty', label: 'Tích điểm', icon: Star },
  { key: 'media', label: 'Hình ảnh & Bản đồ', icon: ImageIcon },
  { key: 'users', label: 'Tài khoản', icon: Users, adminOnly: true },
  { key: 'security', label: 'Bảo mật', icon: Shield },
  { key: 'backup', label: 'Sao lưu', icon: Database, adminOnly: true },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [activeSection, setActiveSection] = useState('business');
  const [settings, setSettings] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [backups, setBackups] = useState([]);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({ full_name: '', phone: '', cccd: '', username: '', password: '', role: 'staff' });
  const [deleteUserTarget, setDeleteUserTarget] = useState(null);

  // Change password state
  const [passwords, setPasswords] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [changingPw, setChangingPw] = useState(false);

  // Backup state
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [loadingBackups, setLoadingBackups] = useState(false);

  const fetchData = async () => {
    try {
      const settingsRes = await getSettings();
      setSettings(settingsRes.settings || settingsRes || {});

      if (isAdmin) {
        const usersRes = await getUsers();
        setUsers(usersRes.users || usersRes || []);
      } else {
        setUsers([]);
      }
    } catch {
      toast.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const fetchBackups = async () => {
    setLoadingBackups(true);
    try {
      const data = await getBackups();
      setBackups(data.backups || []);
    } catch {} finally { setLoadingBackups(false); }
  };

  useEffect(() => {
    fetchData();
    if (activeSection === 'backup' && isAdmin) fetchBackups();
  }, [activeSection, isAdmin]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeSection === 'business') await updateBusiness(settings);
      if (activeSection === 'pricing') await updatePricing(settings);
      if (activeSection === 'hours') await updateHours(settings);
      if (activeSection === 'loyalty') await updateLoyalty(settings);
      toast.success('Đã lưu thay đổi');
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleSaveMedia = async () => {
    setSaving(true);
    try {
      const toSave = {};
      for (const key of ['logo_url', 'hero_image', 'billiard_space_image', 'cafe_space_image', 'billiard_gallery_images', 'lat', 'lng']) {
        toSave[key] = settings[key] ?? null;
      }
      await updateMedia(toSave);
      toast.success('Đã lưu hình ảnh & bản đồ');
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleCreateUser = async () => {
    if (!newUser.full_name.trim() || !newUser.username.trim() || !newUser.password.trim()) {
      toast.error('Vui lòng nhập họ tên, tài khoản và mật khẩu');
      return;
    }
    try {
      await createUser({
        ...newUser,
        full_name: newUser.full_name.trim(),
        phone: newUser.phone.trim(),
        cccd: newUser.cccd.trim(),
        username: newUser.username.trim(),
      });
      toast.success('Đã thêm nhân viên mới');
      setShowCreateUser(false);
      setNewUser({ full_name: '', phone: '', cccd: '', username: '', password: '', role: 'staff' });
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      setDeleteUserTarget(null);
      toast.success('Đã xóa tài khoản');
    } catch (e) { toast.error(e.message); }
  };

  const handleChangePassword = async () => {
    if (!passwords.old_password || !passwords.new_password || !passwords.confirm_password) {
      toast.error('Vui lòng điền đầy đủ các trường');
      return;
    }
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }
    setChangingPw(true);
    try {
      await changePassword(passwords);
      toast.success('Đổi mật khẩu thành công!');
      setPasswords({ old_password: '', new_password: '', confirm_password: '' });
    } catch (e) { toast.error(e.message); }
    finally { setChangingPw(false); }
  };

  const handleBackup = async () => {
    setCreatingBackup(true);
    try {
      const res = await backupData();
      toast.success(`Sao lưu thành công: ${res.message}`);
      fetchBackups();
    } catch (e) { toast.error(e.message); }
    finally { setCreatingBackup(false); }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const visibleSections = sections.filter(section => !section.adminOnly || isAdmin);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold tracking-tight">Cài đặt</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Cấu hình hệ thống</p>
      </motion.div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <motion.div variants={item} className="w-56 shrink-0 hidden xl:block">
          <Card className="p-2">
            {visibleSections.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                    activeSection === s.key
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon size={16} />
                  {s.label}
                </button>
              );
            })}
          </Card>
        </motion.div>

        {/* Mobile tabs */}
        <motion.div variants={item} className="flex xl:hidden gap-2 overflow-x-auto pb-1">
          {visibleSections.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-medium whitespace-nowrap transition-all ${
                  activeSection === s.key
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground bg-muted'
                }`}
              >
                <Icon size={14} />
                {s.label}
              </button>
            );
          })}
        </motion.div>

        {/* Content */}
        <motion.div variants={item} className="flex-1 min-w-0">
          {loading ? <Skeleton className="h-64 rounded-2xl" /> : (
            <>
              {/* Business */}
              {activeSection === 'business' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin kinh doanh</CardTitle>
                    <CardDescription>Thay đổi tên và thông tin cửa hàng</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: 'Tên cửa hàng', key: 'name', placeholder: 'Billiard Cafe' },
                      { label: 'Địa chỉ', key: 'address', placeholder: '123 Đường ABC, TP.HCM' },
                      { label: 'SDT', key: 'phone', placeholder: '0901234567' },
                      { label: 'Email', key: 'email', placeholder: 'contact@billiardcafe.com' },
                    ].map(f => (
                      <div key={f.key}>
                        <Label className="mb-1.5 block">{f.label}</Label>
                        <Input
                          value={settings[f.key] || ''}
                          onChange={e => setSettings(prev => ({ ...prev, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                        />
                      </div>
                    ))}
                    <Button onClick={handleSave} loading={saving}>Lưu thay đổi</Button>
                  </CardContent>
                </Card>
              )}

              {/* Pricing */}
              {activeSection === 'pricing' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Giá dịch vụ</CardTitle>
                    <CardDescription>Cấu hình giá theo giờ cho từng loại bàn</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="mb-1.5 block">Giá mặc định (VND/giờ)</Label>
                      <Input
                        type="number"
                        value={settings.default_rate || ''}
                        onChange={e => setSettings(prev => ({ ...prev, default_rate: e.target.value }))}
                        placeholder="50000"
                      />
                    </div>
                    <Button onClick={handleSave} loading={saving}>Lưu thay đổi</Button>
                  </CardContent>
                </Card>
              )}

              {/* Hours */}
              {activeSection === 'hours' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Giờ mở cửa</CardTitle>
                    <CardDescription>Đặt giờ hoạt động của sân bida</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-1.5 block">Mở cửa</Label>
                        <Input type="time" value={settings.open_time || '08:00'}
                          onChange={e => setSettings(prev => ({ ...prev, open_time: e.target.value }))} />
                      </div>
                      <div>
                        <Label className="mb-1.5 block">Đóng cửa</Label>
                        <Input type="time" value={settings.close_time || '23:00'}
                          onChange={e => setSettings(prev => ({ ...prev, close_time: e.target.value }))} />
                      </div>
                    </div>
                    <Button onClick={handleSave} loading={saving}>Lưu thay đổi</Button>
                  </CardContent>
                </Card>
              )}

              {/* Loyalty */}
              {activeSection === 'loyalty' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Chương trình tích điểm</CardTitle>
                    <CardDescription>Cấu hình điểm thưởng cho khách hàng</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="mb-1.5 block">Tỷ lệ tích điểm (VND = điểm)</Label>
                      <Input
                        type="number"
                        value={settings.points_rate || '1000'}
                        onChange={e => setSettings(prev => ({ ...prev, points_rate: e.target.value }))}
                      />
                    </div>
                    <Button onClick={handleSave} loading={saving}>Lưu thay đổi</Button>
                  </CardContent>
                </Card>
              )}

              {/* Media: Logo, Images, Map */}
              {activeSection === 'media' && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Logo cửa hàng</CardTitle>
                      <CardDescription>Ảnh logo hiển thị trên landing page (thay thế chữ B)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        {settings.logo_url ? (
                          <div className="relative group">
                            <img src={settings.logo_url} alt="Logo" className="w-16 h-16 rounded-xl object-cover border" />
                            <button
                              onClick={() => setSettings(prev => ({ ...prev, logo_url: undefined }))}
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                              title="Xóa ảnh"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">B</div>
                        )}
                        <label className="cursor-pointer">
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            try {
                              const res = await uploadImage(file);
                              setSettings(prev => ({ ...prev, logo_url: res.url }));
                            } catch { toast.error('Upload thất bại'); }
                          }} />
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-border text-sm hover:bg-muted transition-colors">
                            <ImageIcon size={14} /> {settings.logo_url ? 'Đổi logo' : 'Tải lên logo'}
                          </span>
                        </label>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Ảnh không gian quán</CardTitle>
                      <CardDescription>Cập nhật ảnh hiển thị trên landing page</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {[
                        { key: 'hero_image', label: 'Ảnh nền (Hero)' },
                        { key: 'billiard_space_image', label: 'Ảnh khu vực chơi bida' },
                        { key: 'cafe_space_image', label: 'Ảnh khu vực cafe' },
                      ].map(field => (
                        <div key={field.key}>
                          <Label className="mb-2 block">{field.label}</Label>
                          <div className="flex items-center gap-4">
                            {settings[field.key] ? (
                              <div className="relative group">
                                <img src={settings[field.key]} alt={field.label} className="w-24 h-16 rounded-xl object-cover border" />
                                <button
                                  onClick={() => setSettings(prev => ({ ...prev, [field.key]: undefined }))}
                                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                  title="Xóa ảnh"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ) : (
                              <div className="w-24 h-16 rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-xs">Chưa có</div>
                            )}
                            <label className="cursor-pointer">
                              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                try {
                                  const res = await uploadImage(file);
                                  setSettings(prev => ({ ...prev, [field.key]: res.url }));
                                } catch { toast.error('Upload thất bại'); }
                              }} />
                              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-border text-sm hover:bg-muted transition-colors">
                                <ImageIcon size={14} /> {settings[field.key] ? 'Đổi ảnh' : 'Tải lên'}
                              </span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Thư viện ảnh khu vực chơi bida</CardTitle>
                      <CardDescription>Thêm hoặc xóa ảnh khu vực bi-a trên landing page</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(() => {
                        const imgs = (settings.billiard_gallery_images || '').split(',').filter(Boolean);
                        return (
                          <div className="space-y-3">
                            {imgs.length > 0 ? (
                              <div className="flex gap-3 flex-wrap">
                                {imgs.map((url, i) => (
                                  <div key={i} className="relative group">
                                    <img
                                      src={url.trim()}
                                      alt={`Gallery ${i + 1}`}
                                      className="w-28 h-20 rounded-xl object-cover border"
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                    <button
                                      onClick={() => {
                                        const updated = imgs.filter((_, idx) => idx !== i).join(',');
                                        setSettings(prev => ({ ...prev, billiard_gallery_images: updated }));
                                      }}
                                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                      title="Xóa ảnh"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="w-full h-20 rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-sm">Chưa có ảnh nào</div>
                            )}
                          </div>
                        );
                      })()}
                      <label className="cursor-pointer inline-block">
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          try {
                            const res = await uploadImage(file);
                            const current = settings.billiard_gallery_images || '';
                            const updated = current ? `${current},${res.url}` : res.url;
                            setSettings(prev => ({ ...prev, billiard_gallery_images: updated }));
                          } catch { toast.error('Upload thất bại'); }
                        }} />
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-border text-sm hover:bg-muted transition-colors">
                          <ImageIcon size={14} /> Thêm ảnh vào thư viện
                        </span>
                      </label>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Bản đồ</CardTitle>
                      <CardDescription>Cấu hình tọa độ hiển thị Google Maps trên landing page</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="mb-1.5 block">Vĩ độ (Latitude)</Label>
                          <Input
                            value={settings.lat || ''}
                            onChange={e => setSettings(prev => ({ ...prev, lat: e.target.value }))}
                            placeholder="10.8231"
                          />
                        </div>
                        <div>
                          <Label className="mb-1.5 block">Kinh độ (Longitude)</Label>
                          <Input
                            value={settings.lng || ''}
                            onChange={e => setSettings(prev => ({ ...prev, lng: e.target.value }))}
                            placeholder="106.6297"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Lấy tọa độ: tìm địa chỉ trên Google Maps → nhấn chuột phải vào vị trí → chọn số đầu tiên (vĩ độ) và số thứ hai (kinh độ).
                      </p>
                      {settings.lat && settings.lng && (
                        <div className="rounded-xl overflow-hidden border">
                          <iframe
                            title="Store Location"
                            width="100%"
                            height="250"
                            style={{ border: 0 }}
                            src={`https://www.google.com/maps?q=${settings.lat},${settings.lng}&z=15&output=embed`}
                            allowFullScreen
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Button onClick={handleSaveMedia} loading={saving} className="w-full sm:w-auto">
                    Lưu tất cả hình ảnh & bản đồ
                  </Button>
                </div>
              )}

              {/* Users */}
              {activeSection === 'users' && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <CardTitle>Tài khoản nhân viên</CardTitle>
                        <CardDescription>Quản lý người dùng truy cập hệ thống</CardDescription>
                      </div>
                      <Button onClick={() => setShowCreateUser(true)}>
                        <UserPlus size={16} /> Thêm tài khoản
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {users.map(u => (
                        <div key={u.id} className="flex items-center justify-between p-3 rounded-2xl border border-border hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                              {u.username[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{u.full_name || u.username}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">@{u.username}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs capitalize">{u.role}</Badge>
                                {u.phone && <span className="text-xs text-muted-foreground">SĐT: {u.phone}</span>}
                                {u.cccd && <span className="text-xs text-muted-foreground">CCCD: {u.cccd}</span>}
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => setDeleteUserTarget(u)} className="text-red-400 hover:text-red-500">
                            Xóa
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Security - Change Password */}
              {activeSection === 'security' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <KeyRound size={18} /> Đổi mật khẩu
                    </CardTitle>
                    <CardDescription>Thay đổi mật khẩu tài khoản của bạn</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="mb-1.5 block">Mật khẩu cũ</Label>
                      <Input
                        type="password"
                        value={passwords.old_password}
                        onChange={e => setPasswords(p => ({ ...p, old_password: e.target.value }))}
                        placeholder="Nhập mật khẩu cũ"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Mật khẩu mới</Label>
                      <Input
                        type="password"
                        value={passwords.new_password}
                        onChange={e => setPasswords(p => ({ ...p, new_password: e.target.value }))}
                        placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Xác nhận mật khẩu mới</Label>
                      <Input
                        type="password"
                        value={passwords.confirm_password}
                        onChange={e => setPasswords(p => ({ ...p, confirm_password: e.target.value }))}
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>
                    <Button onClick={handleChangePassword} loading={changingPw}>
                      <KeyRound size={16} /> Đổi mật khẩu
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Backup */}
              {activeSection === 'backup' && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database size={18} /> Sao lưu dữ liệu
                      </CardTitle>
                      <CardDescription>Tạo bản sao lưu toàn bộ dữ liệu của hệ thống</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={handleBackup} loading={creatingBackup}>
                        <Download size={16} /> Tạo bản sao lưu ngay bây giờ
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Lịch sử sao lưu</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingBackups ? (
                        <div className="space-y-2">
                          <Skeleton className="h-10" />
                          <Skeleton className="h-10" />
                        </div>
                      ) : backups.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Chưa có bản sao lưu nào.</p>
                      ) : (
                        <div className="space-y-2">
                          {backups.map(b => (
                            <div key={b.name} className="flex items-center justify-between p-3 rounded-2xl border border-border hover:bg-muted/30 transition-colors">
                              <div>
                                <p className="text-sm font-medium">{b.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(b.created).toLocaleString('vi-VN')} - {formatSize(b.size)}
                                </p>
                              </div>
                              <Button size="sm" variant="outline" asChild>
                                <a href={downloadBackup(b.name)} download={b.name}>
                                  <Download size={14} /> Tải về
                                </a>
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      <Modal open={showCreateUser} onClose={() => setShowCreateUser(false)} title="Thêm nhân viên mới" size="sm">
        <div className="p-6 space-y-4">
          <div>
            <Label className="mb-1.5 block">Họ và tên</Label>
            <Input value={newUser.full_name} onChange={e => setNewUser(prev => ({ ...prev, full_name: e.target.value }))} placeholder="Nguyễn Văn A" />
          </div>
          <div>
            <Label className="mb-1.5 block">Số điện thoại</Label>
            <Input value={newUser.phone} onChange={e => setNewUser(prev => ({ ...prev, phone: e.target.value }))} placeholder="0901234567" />
          </div>
          <div>
            <Label className="mb-1.5 block">CCCD</Label>
            <Input value={newUser.cccd} onChange={e => setNewUser(prev => ({ ...prev, cccd: e.target.value }))} placeholder="07920300xxxx" />
          </div>
          <div>
            <Label className="mb-1.5 block">Tên đăng nhập</Label>
            <Input value={newUser.username} onChange={e => setNewUser(prev => ({ ...prev, username: e.target.value }))} placeholder="nhanvien01" />
          </div>
          <div>
            <Label className="mb-1.5 block">Mật khẩu</Label>
            <Input type="password" value={newUser.password} onChange={e => setNewUser(prev => ({ ...prev, password: e.target.value }))} placeholder="Nhập mật khẩu" />
          </div>
          <div>
            <Label className="mb-1.5 block">Vai trò</Label>
            <select
              className="w-full h-10 px-3 rounded-2xl border border-border bg-background text-sm"
              value={newUser.role}
              onChange={e => setNewUser(prev => ({ ...prev, role: e.target.value }))}
            >
              <option value="staff">Nhân viên</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          <div className="rounded-2xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            Sau khi thêm, họ tên nhân viên sẽ tự xuất hiện ở màn `Nhân viên` để chấm công.
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowCreateUser(false)}>Hủy</Button>
            <Button className="flex-1" onClick={handleCreateUser}>Tạo tài khoản</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteUserTarget} onClose={() => setDeleteUserTarget(null)} title="Xác nhận xóa tài khoản" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Bạn có chắc chắn muốn xóa tài khoản <span className="font-medium text-foreground">{deleteUserTarget?.username}</span> không?
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteUserTarget(null)}>Hủy</Button>
            <Button variant="destructive" className="flex-1" onClick={() => handleDeleteUser(deleteUserTarget.id)}>Xóa</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
