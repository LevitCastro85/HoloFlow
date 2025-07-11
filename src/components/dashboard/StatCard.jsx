import React from 'react';
import { motion } from 'framer-motion';

const colorVariants = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    gradient: 'from-blue-50 to-blue-100',
    border: 'border-blue-200'
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    gradient: 'from-green-50 to-green-100',
    border: 'border-green-200'
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    gradient: 'from-red-50 to-red-100',
    border: 'border-red-200'
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    gradient: 'from-purple-50 to-purple-100',
    border: 'border-purple-200'
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    gradient: 'from-orange-50 to-orange-100',
    border: 'border-orange-200'
  },
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
    gradient: 'from-indigo-50 to-indigo-100',
    border: 'border-indigo-200'
  }
};

export default function StatCard({ title, value, icon: Icon, description, color = 'blue' }) {
  const variants = colorVariants[color] || colorVariants.blue;

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-sm border p-6 card-hover`}
      whileHover={{ scale: 1.03 }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${variants.text}`}>{value}</p>
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-lg ${variants.bg} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${variants.text}`} />
          </div>
        )}
      </div>
    </motion.div>
  );
}