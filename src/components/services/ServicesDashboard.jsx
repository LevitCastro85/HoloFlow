import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Clock, 
  DollarSign,
  ChevronDown,
  ChevronRight,
  Eye,
  Settings,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export default function ServicesDashboard({ services, categories, onEditService, onAddService, onAddCategory }) {
  const [expandedCategories, setExpandedCategories] = useState({});

  // Agrupar servicios por categoría
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.categoria]) {
      acc[service.categoria] = [];
    }
    acc[service.categoria].push(service);
    return acc;
  }, {});

  const categoryNames = Object.keys(servicesByCategory);
  
  // Ordenar categorías según el orden definido
  const sortedCategories = categoryNames.sort((a, b) => {
    const catA = categories.find(cat => cat.nombre === a);
    const catB = categories.find(cat => cat.nombre === b);
    return (catA?.orden || 999) - (catB?.orden || 999);
  });

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getCategoryStats = (categoryServices) => {
    const totalServices = categoryServices.length;
    const avgPrice = categoryServices.reduce((sum, s) => sum + s.precioBase, 0) / totalServices;
    const avgTime = categoryServices.reduce((sum, s) => sum + s.tiempoEstimado, 0) / totalServices;
    
    return { totalServices, avgPrice, avgTime };
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Diseño': 'bg-purple-100 text-purple-800 border-purple-200',
      'Audiovisual': 'bg-red-100 text-red-800 border-red-200',
      'Fotografía': 'bg-green-100 text-green-800 border-green-200',
      'Contenido': 'bg-blue-100 text-blue-800 border-blue-200',
      'Marketing Digital': 'bg-orange-100 text-orange-800 border-orange-200',
      'Branding': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'General': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category] || colors['General'];
  };

  return (
    <div className="space-y-6">
      {/* Header con acciones principales */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard de Servicios</h2>
          <p className="text-gray-600">Gestiona tu portafolio organizado por categorías</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => {
            // Expandir/contraer todas las categorías
            const categoryNames = Object.keys(servicesByCategory);
            const allExpanded = categoryNames.every(cat => expandedCategories[cat]);
            const newState = {};
            categoryNames.forEach(cat => {
              newState[cat] = !allExpanded;
            });
            setExpandedCategories(newState);
          }}>
            <Eye className="w-4 h-4 mr-2" />
            {Object.keys(servicesByCategory).every(cat => expandedCategories[cat]) ? 'Contraer Todo' : 'Expandir Todo'}
          </Button>
          <Button variant="outline" onClick={onAddCategory}>
            <Settings className="w-4 h-4 mr-2" />
            Nueva Categoría
          </Button>
          <Button onClick={onAddService}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Servicio
          </Button>
        </div>
      </div>

      {/* Resumen general */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Servicios</p>
              <p className="text-2xl font-bold text-blue-900">{services.length}</p>
            </div>
            <Tag className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Categorías Activas</p>
              <p className="text-2xl font-bold text-green-900">{categoryNames.length}</p>
            </div>
            <Settings className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Precio Promedio</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(services.reduce((sum, s) => sum + s.precioBase, 0) / services.length || 0)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Tiempo Promedio</p>
              <p className="text-2xl font-bold text-orange-900">
                {Math.round(services.reduce((sum, s) => sum + s.tiempoEstimado, 0) / services.length || 0)} días
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Servicios por categoría */}
      <div className="space-y-4">
        {sortedCategories.map((category, categoryIndex) => {
          const categoryServices = servicesByCategory[category];
          const stats = getCategoryStats(categoryServices);
          const isExpanded = expandedCategories[category];
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-white rounded-lg border shadow-sm"
            >
              {/* Header de categoría */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                      <h3 className="text-xl font-semibold text-gray-900">{category}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}>
                        {stats.totalServices} servicio{stats.totalServices !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{formatCurrency(stats.avgPrice)}</p>
                      <p>Precio promedio</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{Math.round(stats.avgTime)} días</p>
                      <p>Tiempo promedio</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Servicios de la categoría */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-200"
                >
                  <div className="p-6 bg-gray-50">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryServices.map((service, serviceIndex) => (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: serviceIndex * 0.05 }}
                          className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-gray-900 text-sm">{service.nombre}</h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditService(service);
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{service.descripcion}</p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Precio base:</span>
                              <span className="font-semibold text-green-600">
                                {formatCurrency(service.precioBase)}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Tiempo:</span>
                              <span className="font-medium text-gray-900">
                                {service.tiempoEstimado} días
                              </span>
                            </div>
                          </div>
                          
                          {service.observaciones && (
                            <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded border">
                              {service.observaciones}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No hay servicios registrados</h3>
          <p className="text-gray-600 mb-6">Comienza agregando tu primer servicio al catálogo</p>
          <Button onClick={onAddService}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Primer Servicio
          </Button>
        </div>
      )}
    </div>
  );
}