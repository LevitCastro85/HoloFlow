import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Clock, 
  Flag, 
  XCircle,
  TrendingDown,
  Calendar
} from 'lucide-react';

export default function ControlIndicators({ indicators }) {
  const indicatorConfigs = {
    overdue: {
      icon: Clock,
      title: 'Tareas Retrasadas',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200'
    },
    urgent: {
      icon: Flag,
      title: 'Tareas Urgentes',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-200'
    },
    overLimit: {
      icon: XCircle,
      title: 'Fuera de Límite',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-200'
    },
    attention: {
      icon: AlertTriangle,
      title: 'Requiere Atención',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-200'
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Object.entries(indicators).map(([key, data], index) => {
        const config = indicatorConfigs[key];
        const Icon = config.icon;
        
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-lg p-6 border shadow-sm ${
              data.count > 0 ? config.borderColor : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${config.color}`} />
              </div>
              {data.count > 0 && (
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.bgColor}`}>
                  ¡Atención!
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">{data.count}</h3>
              <p className="text-sm font-medium text-gray-700">{config.title}</p>
              
              {data.details && data.details.length > 0 && (
                <div className="mt-3 space-y-1">
                  {data.details.slice(0, 3).map((detail, idx) => (
                    <div key={idx} className="text-xs text-gray-600 truncate">
                      • {detail.taskTitle} ({detail.brandName})
                    </div>
                  ))}
                  {data.details.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{data.details.length - 3} más...
                    </div>
                  )}
                </div>
              )}
              
              {data.trend && (
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  {data.trend > 0 ? (
                    <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                  ) : (
                    <Calendar className="w-3 h-3 mr-1 text-green-500" />
                  )}
                  <span>
                    {data.trend > 0 ? `+${data.trend} desde ayer` : 'Sin cambios'}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}