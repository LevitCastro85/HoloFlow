import React from 'react';
import { motion } from 'framer-motion';
import { statusInfo } from '@/lib/resourceConstants';
import { AlertTriangle } from 'lucide-react';

export default function ResourceStatusTrigger({ resource, onClick }) {
  const { label, color, Icon } = statusInfo[resource.status] || {
    label: 'Desconocido',
    color: 'bg-gray-100 text-gray-800',
    Icon: AlertTriangle,
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-full transition-all w-full justify-center ${color}`}
    >
      <Icon className="w-4 h-4 mr-1.5" />
      {label}
    </motion.button>
  );
}