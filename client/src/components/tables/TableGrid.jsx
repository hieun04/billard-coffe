import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import TableCard from './TableCard';
import TableSession from './TableSession';
import AddTableModal from './AddTableModal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { deleteTable } from '@/api/tables';
import { toast } from 'sonner';
import { cn, getTableLabel } from '@/lib/utils';

const filters = [
  { key: 'all', label: 'Tất cả' },
  { key: 'available', label: 'Trống' },
  { key: 'playing', label: 'Đang chơi' },
  { key: 'reserved', label: 'Đặt trước' },
  { key: 'maintenance', label: 'Bảo trì' },
];

export default function TableGrid({ tables = [], upcomingByTable = {}, loading, onRefresh }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTable, setSelectedTable] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = (table) => {
    setDeleteTarget(table);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTable(deleteTarget.id);
      toast.success(`Đã xóa bàn ${getTableLabel(deleteTarget)}`);
      setDeleteTarget(null);
      onRefresh?.();
    } catch (err) {
      toast.error(err.message || 'Không thể xóa bàn');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = activeFilter === 'all'
    ? tables
    : tables.filter(t => {
        if (activeFilter === 'available') return t.status === 'empty' || t.status === 'available';
        if (activeFilter === 'playing') return t.status === 'occupied' || t.status === 'playing';
        return t.status === activeFilter;
      });

  const counts = {
    all: tables.length,
    available: tables.filter(t => t.status === 'empty' || t.status === 'available').length,
    playing: tables.filter(t => t.status === 'occupied' || t.status === 'playing').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    maintenance: tables.filter(t => t.status === 'maintenance').length,
  };

  return (
    <>
      {/* Filter Tabs + Add button */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1 min-w-0">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-200',
                activeFilter === f.key
                  ? 'bg-primary/15 text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              {f.label}
              <span className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                activeFilter === f.key ? 'bg-primary/20' : 'bg-muted'
              )}>
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>
        <Button onClick={() => setShowAddModal(true)} className="shrink-0">
          <Plus size={16} /> Thêm bàn
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-2xl">🎱</span>
          </div>
          <p className="text-muted-foreground">Không có bàn nào phù hợp</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map(table => (
              <TableCard
                key={table.id}
                table={table}
                upcoming={upcomingByTable[table.id]}
                onClick={setSelectedTable}
                selected={selectedTable?.id === table.id}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Session Modal */}
      <TableSession
        table={selectedTable}
        open={!!selectedTable}
        onClose={() => setSelectedTable(null)}
        onRefresh={() => { onRefresh(); setSelectedTable(null); }}
      />

      {/* Add Table Modal */}
      <AddTableModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => onRefresh?.()}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Xóa bàn"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Bạn có chắc muốn xóa <span className="font-semibold text-foreground">{deleteTarget ? getTableLabel(deleteTarget) : ''}</span> không?
          </p>
          <p className="text-xs text-muted-foreground">
            Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={confirmDelete}
              loading={deleting}
            >
              Xóa bàn
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
