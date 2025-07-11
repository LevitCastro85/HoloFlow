import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Settings } from 'lucide-react';

export default function MetricsSummary({ summary }) {
  const summaryCards = [
    {
      title: 'Total Tareas',
      value: summary.total || 0,
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      title: 'Activas',
      value: summary.active || 0,
      icon: TrendingUp,
      color: 'text-orange-600'
    },
    {
      title: 'Completadas',
      value: summary.completed || 0,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Tasa Cumplimiento',
      value: `${summary.completionRate || 0}%`,
      icon: Settings,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {summaryCards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 border shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <Icon className={`w-8 h-8 ${card.color}`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}