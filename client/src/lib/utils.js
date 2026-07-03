import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export function formatDuration(startStr, endStr) {
  if (!startStr) return '0m';
  const start = new Date(startStr);
  const end = endStr ? new Date(endStr) : new Date();
  const diffMs = end - start;
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getTierColor(tier) {
  if (!tier) return 'bg-muted text-muted-foreground border-transparent';
  const colors = {
    Bronze: 'bg-amber-700/20 text-amber-400 border-amber-700/30',
    Silver: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
    Gold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Platinum: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };
  return colors[tier] || 'bg-muted text-muted-foreground border-transparent';
}

export function getStatusColor(status) {
  const colors = {
    available: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    empty: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    playing: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    occupied: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    reserved: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    maintenance: 'bg-red-500/15 text-red-400 border-red-500/30',
    held: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    checked_in: 'bg-amber-600/15 text-amber-500 border-amber-600/30',
  };
  return colors[status?.toLowerCase()] || 'bg-muted text-muted-foreground';
}

export function getTableLabel(table) {
  if (!table) return 'Bàn không xác định';
  const raw = table.table_number || table.name || table.id;
  if (!raw) return 'Bàn không xác định';
  return `Bàn ${raw}`;
}

export function getTableNumber(table) {
  if (!table) return '';
  const raw = table.table_number || table.name || table.id;
  return String(raw).replace(/[^0-9]/g, '') || String(table.id);
}

export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function resolveImageUrl(raw) {
  if (!raw) return null;
  if (raw.startsWith('/uploads/')) {
    return raw;
  }
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }
  return null;
}
