import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TablesPage = lazy(() => import('./pages/TablesPage'));
const POSPage = lazy(() => import('./pages/POSPage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const CustomersPage = lazy(() => import('./pages/CustomersPage'));
const BookingsPage = lazy(() => import('./pages/BookingsPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const StaffPage = lazy(() => import('./pages/StaffPage'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const VouchersPage = lazy(() => import('./pages/VouchersPage'));
const PurchasesPage = lazy(() => import('./pages/PurchasesPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh] bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <span className="text-muted-foreground text-sm">Đang tải trang...</span>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-muted-foreground text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/tables" replace />;
  return children;
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route index element={<LandingPage />} />

        {/* Protected */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tables" element={<TablesPage />} />
          <Route path="pos" element={<POSPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="vouchers" element={<VouchersPage />} />
          <Route path="purchases" element={<PurchasesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
