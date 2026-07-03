import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createSupplier, updateSupplier } from '@/api/inventory';
import { toast } from 'sonner';

const emptyForm = {
  name: '',
  phone: '',
  address: '',
  category: '',
};

export function SupplierModal({ open, onClose, onSuccess, supplier }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (supplier) {
        setForm({
          name: supplier.name || '',
          phone: supplier.phone || '',
          address: supplier.address || '',
          category: supplier.category || '',
        });
      } else {
        setForm(emptyForm);
      }
    }
  }, [open, supplier]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Tên nhà cung cấp không được để trống');
      return;
    }
    setLoading(true);
    try {
      if (supplier) {
        await updateSupplier(supplier.id, form);
        toast.success('Đã cập nhật nhà cung cấp');
      } else {
        await createSupplier(form);
        toast.success('Đã thêm nhà cung cấp');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={supplier ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Tên nhà cung cấp *</label>
          <Input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="VD: Công ty ABC"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Số điện thoại</label>
          <Input
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
            placeholder="VD: 0901 234 567"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Địa chỉ</label>
          <Input
            value={form.address}
            onChange={e => set('address', e.target.value)}
            placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Loại hàng cung cấp</label>
          <Input
            value={form.category}
            onChange={e => set('category', e.target.value)}
            placeholder="VD: Nước giải khát, Dụng cụ billiard"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" className="flex-1" loading={loading}>
            {supplier ? 'Lưu thay đổi' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
