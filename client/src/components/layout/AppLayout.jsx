import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { MobileSidebar } from './Sidebar';
import Topbar from './Topbar';
import AIAssistantPanel from '@/components/ai/AIAssistantPanel';
import CommandPalette from '@/components/ui/CommandPalette';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function AppLayout() {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Global keyboard shortcut: Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={user?.role}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {/* Main content */}
      <div className={cn(
        'flex-1 flex flex-col min-w-0 transition-all duration-300',
        'lg:pl-4 xl:pl-5'
      )}>
        <Topbar
          onMenuClick={() => setMobileSidebarOpen(true)}
          onSearchOpen={() => setSearchOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 pb-4 lg:px-6 lg:pb-6">
          <div className="h-full rounded-[28px] border border-border/60 bg-background/60">
            <div className="h-full p-4 lg:p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistantPanel open={aiOpen} onToggle={() => setAiOpen(!aiOpen)} />

      {/* Global Search */}
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
