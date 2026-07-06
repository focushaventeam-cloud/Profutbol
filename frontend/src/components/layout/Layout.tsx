import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useUIStore } from '../../store/uiStore';

interface LayoutProps {
  children: React.ReactNode;
  matchTitle?: string;
  isConnected?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  matchTitle,
  isConnected,
}) => {
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-900/80 to-slate-900">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <Header
        onToggleSidebar={toggleSidebar}
        isConnected={isConnected}
        matchTitle={matchTitle}
      />

      <div className="flex flex-1 relative z-10">
        <Sidebar />

        <main
          className={`
            flex-1 p-4 lg:p-6 transition-all duration-300
            ${isSidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;