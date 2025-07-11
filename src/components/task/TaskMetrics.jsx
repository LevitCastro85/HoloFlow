import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, User, Flag } from 'lucide-react';

export default function TaskMetrics({ metrics }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 border shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Tareas</p>
            <p className="text-2xl font-bold text-blue-600">{metrics.total}</p>
          </div>
          <BarChart3 className="w-8 h-8 text-blue-600" />
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
            <p className="text-sm font-medium text-gray-600">Activas</p>
            <p className="text-2xl font-bold text-orange-600">{metrics.activas}</p>
          </div>
          <Clock className="w-8 h-8 text-orange-600" />
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
            <p className="text-sm font-medium text-gray-600">Completadas</p>
            <p className="text-2xl font-bold text-green-600">{metrics.completadas}</p>
          </div>
          <User className="w-8 h-8 text-green-600" />
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
            <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
            <p className="text-2xl font-bold text-purple-600">{metrics.tiempoPromedio}d</p>
          </div>
          <Flag className="w-8 h-8 text-purple-600" />
        </div>
      </motion.div>
    </div>
  );
}