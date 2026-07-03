import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createTable } from '@/api/tables';
import { toast } from 'sonner';

const initialForm = { table_number: '', rate_per_hour: 50000, description: '' };

export default function AddTableModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setForm(initialForm);
    setError('');
  };

  const handleClose = () => {
    if (loading) return;
    reset();
    onClose();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    const trimmedNumber = form.table_number.trim();
    if (!trimmedNumber) {
      setError('Vui lòng nhập số bàn');
      return;
    }
    const rate = Number(form.rate_per_hour);
    if (!Number.isFinite(rate) || rate <= 0) {
      setError('Giá/giờ phải là số dương');
      return;
    }

    setLoading(true);
    try {
      await createTable({
        table_number: trimmedNumber,
        rate_per_hour: rate,
        description: form.description?.trim() || '',
      });
      toast.success(`Đã thêm bàn ${trimmedNumber}`);
      reset();
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Không thể thêm bàn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Thêm bàn mới" size="sm">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Số bàn <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="VD: 13, VIP-1, Bàn góc…"
            value={form.table_number}
            onChange={(e) => setForm((f) => ({ ...f, table_number: e.target.value }))}
            error={!!error && !form.table_number.trim()}
            autoFocus
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Giá / giờ (VNĐ) <span className="text-destructive">*</span>
          </label>
          <Input
            type="number"
            min={0}
            step={1000}
            value={form.rate_per_hour}
            onChange={(e) => setForm((f) => ({ ...f, rate_per_hour: e.target.value }))}
            placeholder="50000"
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Mặc định 50.000 VNĐ/giờ. Có thể sửa lại sau khi tạo.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Mô tả</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="VD: Bàn VIP tầng 2, bàn góc trái…"
            rows={3}
            maxLength={500}
            className="flex min-h-[80px] w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" className="flex-1" loading={loading}>
            <Plus size={16} /> Thêm bàn
          </Button>
        </div>
      </form>
    </Modal>
  );
}