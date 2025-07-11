import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Plus, 
  Settings, 
  Users, 
  UserCheck, 
  BarChart3, 
  Palette, 
  Calendar, 
  FolderOpen, 
  TrendingUp, 
  FileText, 
  DollarSign, 
  ShoppingCart, 
  Cog,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuSections = [
  {
    title: 'Núcleo Operativo',
    items: [
      {
        id: 'dashboard',
        label: 'Panel Principal',
        icon: LayoutDashboard
      },
      {
        id: 'nueva-tarea',
        label: 'Nueva Tarea',
        icon: Plus
      },
      {
        id: 'produccion',
        label: 'Motor de Producción',
        icon: Settings
      },
      {
        id: 'calendario',
        label: 'Calendario',
        icon: Calendar
      },
      {
        id: 'recursos',
        label: 'Banco de Recursos',
        icon: FolderOpen
      }
    ]
  },
  {
    title: 'Gestión de Marcas y Personas',
    items: [
      {
        id: 'brand-hub',
        label: 'Brand Hub',
        icon: Palette
      },
      {
        id: 'clientes',
        label: 'Clientes',
        icon: Users
      },
      {
        id: 'colaboradores',
        label: 'Colaboradores',
        icon: UserCheck
      }
    ]
  },
  {
    title: 'Servicios y Negocio',
    items: [
      {
        id: 'servicios',
        label: 'Servicios y Precios',
        icon: DollarSign
      },
      {
        id: 'ventas',
        label: 'Ventas y Contrataciones',
        icon: ShoppingCart
      },
      {
        id: 'propuestas',
        label: 'Propuestas',
        icon: FileText
      }
    ]
  },
  {
    title: 'Análisis y Control',
    items: [
      {
        id: 'rentabilidad',
        label: 'Rentabilidad',
        icon: TrendingUp
      },
      {
        id: 'metricas',
        label: 'Métricas',
        icon: BarChart3
      },
      {
        id: 'roles',
        label: 'Roles y Permisos',
        icon: Cog
      }
    ]
  }
];

export default function Sidebar({ activeView, setActiveView, onCreativeTeamMode, profile, onSignOut }) {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 leading-tight">HoloFlow – Studio Resource Planner</span>
        </div>

        {profile && (
          <div className="mt-6 mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-semibold text-gray-900 text-sm truncate" title={profile.name}>{profile.name}</p>
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">{profile.role}</p>
          </div>
        )}
        
        <nav className="space-y-6">
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title}>
              
              <div className="mb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                  {section.title}
                </h3>
              </div>
              
              
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: (sectionIndex * 0.1) + (itemIndex * 0.05),
                        duration: 0.3 
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
              Vista Alterna
            </h3>
          </div>
          <Button 
            onClick={onCreativeTeamMode} 
            variant="outline" 
            className="w-full justify-start"
          >
            <Users className="w-4 h-4 mr-2" />
            Panel del Equipo Creativo
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button 
            onClick={onSignOut} 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}