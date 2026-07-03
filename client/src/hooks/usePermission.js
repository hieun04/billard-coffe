import { useAuth } from '@/contexts/AuthContext';

export function usePermission() {
  const { user } = useAuth();

  return {
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    can: (action) => {
      if (user?.role === 'admin') return true;
      const staffActions = ['tables', 'pos', 'menu', 'orders', 'customers', 'bookings', 'notifications'];
      return staffActions.includes(action);
    },
  };
}
