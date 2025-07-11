import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  ShoppingCart
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function SalesMetrics({ 
  activeSales, 
  renewalAlerts, 
  totalSales, 
  totalRevenue 
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 border shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Contratos Activos</p>
            <p className="text-2xl font-bold text-green-600">{activeSales}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg p-6 border shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Ingresos Estimados</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalRevenue)}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg p-6 border shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Alertas de Renovación</p>
            <p className="text-2xl font-bold text-orange-600">{renewalAlerts}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-orange-600" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg p-6 border shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Ventas</p>
            <p className="text-2xl font-bold text-purple-600">{totalSales}</p>
          </div>
          <ShoppingCart className="w-8 h-8 text-purple-600" />
        </div>
      </motion.div>
    </div>
  );
}