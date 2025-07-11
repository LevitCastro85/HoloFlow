import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

export default function DashboardHeader() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-900">{getGreeting()}</h1>
      <p className="text-gray-600 mt-1">
        Aquí tienes un resumen del estado de tu operación.
      </p>
    </motion.div>
  );
}