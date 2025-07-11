import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Settings, Calendar, Palette as BrandIcon, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'my-profile', label: 'Mi Perfil', icon: User },
  { id: 'production-engine', label: 'Motor de Producción', icon: Settings },
  { id: 'delivery-calendar', label: 'Calendario de Entregas', icon: Calendar },
  { id: 'brand-hub', label: 'Brand Hub', icon: BrandIcon },
];

export default function CreativeTeamSidebar({ activeView, setActiveView }) {
  const { signOut } = useAuth();

  return (
    <aside className="w-64 bg-white border-r flex-shrink-0 flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-lg font-bold text-gray-800">Panel del Equipo</h2>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeView === item.id
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </nav>
      <div className="mt-auto p-4 border-t border-gray-200">
        <Button variant="ghost" onClick={signOut} className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700">
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
}