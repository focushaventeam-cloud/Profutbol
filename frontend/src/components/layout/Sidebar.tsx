import React from 'react';
import { LayoutDashboard, Radio, BarChart3, Settings, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'live', label: 'En Vivo', icon: <Radio size={20} /> },
  { id: 'matches', label: 'Partidos', icon: <Calendar size={20} /> },
  { id: 'stats', label: 'Estadísticas', icon: <BarChart3 size={20} /> },
  { id: 'settings', label: 'Configuración', icon: <Settings size={20} /> },
];

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar, activeTab, setActiveTab } = useUIStore();

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64
          glass-panel-strong border-r border-white/10 rounded-none
          transition-all duration-300 ease-in-out overflow-hidden
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-0
        `}
      >
        {/* Collapse toggle (desktop only) */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 rounded-full 
                     bg-white/10 border border-white/20 items-center justify-center
                     hover:bg-white/20 transition-colors text-white/60 hover:text-white"
        >
          {isSidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>

        <nav className="flex flex-col gap-1 p-3 mt-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/20 shadow-lg shadow-blue-500/5'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <span
                className={`transition-colors duration-200 ${
                  activeTab === item.id ? 'text-blue-400' : 'text-white/40 group-hover:text-white/70'
                }`}
              >
                {item.icon}
              </span>
              {item.label}
              {item.id === 'live' && (
                <span className="ml-auto flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="glass-panel p-3 text-center">
            <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider">
              Scoreboard Pro v1.0
            </p>
            <p className="text-[10px] text-white/20 mt-0.5">
              © 2024 FocusHaven
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;