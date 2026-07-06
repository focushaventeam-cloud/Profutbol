import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  activeTab: string;
  theme: 'dark' | 'light';
  
  toggleSidebar: () => void;
  setModalOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isModalOpen: false,
  activeTab: 'dashboard',
  theme: 'dark',
  
  toggleSidebar: () => set((state) => ({ 
    isSidebarOpen: !state.isSidebarOpen 
  })),
  
  setModalOpen: (isModalOpen) => set({ isModalOpen }),
  
  setActiveTab: (activeTab) => set({ activeTab }),
  
  setTheme: (theme) => set({ theme }),
}));