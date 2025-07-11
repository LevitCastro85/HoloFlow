import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Globe, Settings, ClipboardList } from 'lucide-react';

export default function BrandControlStats({ brands }) {
  const stats = [
    {
      label: 'Total Marcas',
      value: brands.length,
      icon: Palette,
      color: 'text-blue-600',
      delay: 0
    },
    {
      label: 'Con Sitio Web',
      value: brands.filter(b => b.sitioWeb).length,
      icon: Globe,
      color: 'text-green-600',
      delay: 0.1
    },
    {
      label: 'Redes Administradas',
      value: brands.filter(b => b.administraRedes).length,
      icon: Settings,
      color: 'text-purple-600',
      delay: 0.2
    },
    {
      label: 'Industrias',
      value: new Set(brands.map(b => b.industria)).size,
      icon: ClipboardList,
      color: 'text-orange-600',
      delay: 0.3
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
            className="bg-white rounded-lg p-6 border shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <Icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}