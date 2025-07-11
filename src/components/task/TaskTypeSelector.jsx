import React from 'react';
import { motion } from 'framer-motion';
import { 
  Link as LinkIcon, 
  Calendar, 
  Smartphone, 
  Camera, 
  FileText, 
  Code,
  Palette
} from 'lucide-react';

const taskTypes = [
  {
    id: 'resource',
    title: 'Tarea con Recurso',
    description: 'Dar seguimiento a un entregable previamente aprobado',
    details: 'Ideal para correcciones, adaptaciones o entregas finales',
    icon: LinkIcon,
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50 border-purple-200',
    textColor: 'text-purple-900'
  },
  {
    id: 'bulk',
    title: 'Modo Masivo (Calendario Editorial)',
    description: 'Crear múltiples tareas para publicaciones en redes sociales',
    details: 'Formato tipo tabla para una misma marca',
    icon: Calendar,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-900'
  },
  {
    id: 'digital-content',
    title: 'Contenido Digital',
    description: 'Crear piezas visuales o audiovisuales para redes sociales',
    details: 'Publicidad digital o plataformas de comunicación',
    icon: Smartphone,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50 border-green-200',
    textColor: 'text-green-900'
  },
  {
    id: 'field-production',
    title: 'Producción de Campo',
    description: 'Planear y ejecutar sesión fotográfica o de video',
    details: 'Requiere desplazamiento, equipo y logística',
    icon: Camera,
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50 border-orange-200',
    textColor: 'text-orange-900'
  },
  {
    id: 'strategy-documents',
    title: 'Estrategia y Documentos',
    description: 'Desarrollar entregables conceptuales y estratégicos',
    details: 'Diagnósticos, análisis, propuestas estratégicas',
    icon: FileText,
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50 border-violet-200',
    textColor: 'text-violet-900'
  },
  {
    id: 'web-development',
    title: 'Desarrollo Web y Técnico',
    description: 'Creación o mantenimiento de sitios web',
    details: 'Configuraciones técnicas o SEO',
    icon: Code,
    color: 'from-gray-500 to-slate-600',
    bgColor: 'bg-gray-50 border-gray-200',
    textColor: 'text-gray-900'
  }
];

export default function TaskTypeSelector({ brands, selectedBrand, onBrandSelect, onTypeSelect }) {
  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    const brand = brands.find(b => b.id === parseInt(brandId));
    onBrandSelect(brand || null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">
          Paso 1: Selecciona una Marca
        </h3>
        <div className="relative">
          <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedBrand ? selectedBrand.id : ''}
            onChange={handleBrandChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-base"
          >
            <option value="">-- Elige una marca para empezar --</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900">Paso 2: Selecciona el Tipo de Tarea</h2>
        <p className="text-gray-600 mt-1">
          {selectedBrand 
            ? `Creando tareas para: ${selectedBrand.name}` 
            : 'Elige una marca para habilitar los tipos de tarea.'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {taskTypes.map((type, index) => {
          const Icon = type.icon;
          
          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${type.bgColor} rounded-xl p-6 transition-all duration-300 border-2 hover:border-opacity-60 ${
                !selectedBrand ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'
              }`}
              onClick={() => selectedBrand && onTypeSelect(type.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold ${type.textColor} mb-2`}>
                    {type.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                    {type.description}
                  </p>
                  <p className="text-xs text-gray-600 italic">
                    {type.details}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">
                    Seleccionar tipo
                  </span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${!selectedBrand ? 'border-gray-300' : 'border-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${!selectedBrand ? 'bg-gray-300' : 'bg-gray-400'}`}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">💡 Información Importante</h4>
        <ul className="text-yellow-800 text-sm space-y-1">
          <li>• <strong>Tarea con Recurso:</strong> Requiere seleccionar un recurso aprobado existente</li>
          <li>• <strong>Modo Masivo:</strong> Permite crear hasta 10 tareas simultáneamente</li>
          <li>• <strong>Otros tipos:</strong> Formularios especializados con campos específicos</li>
        </ul>
      </div>
    </div>
  );
}