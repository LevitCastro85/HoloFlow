import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Eye, ArrowRight, Plus, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fileTypeIcons, statusInfo } from '@/lib/resourceConstants';

const fileTypeColors = {
  image: 'bg-green-100 text-green-600',
  video: 'bg-purple-100 text-purple-600',
  audio: 'bg-blue-100 text-blue-600',
  document: 'bg-red-100 text-red-600',
  archive: 'bg-yellow-100 text-yellow-600',
  url: 'bg-indigo-100 text-indigo-600',
  unknown: 'bg-gray-100 text-gray-600'
};

export default function ResourceCard({ 
  resource, 
  index, 
  onUseAsInput, 
  onResourceAction 
}) {
  const FileIcon = fileTypeIcons[resource.tipo] || FileText;
  const statusDetails = statusInfo[resource.status] || {
    label: resource.status,
    color: 'bg-gray-100 text-gray-800 border-gray-300'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border p-6 card-hover flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${fileTypeColors[resource.tipo]}`}>
          <FileIcon className="w-6 h-6" />
        </div>
        <div className="flex flex-col items-end space-y-2">
          {resource.tamaño && resource.tamaño !== '0 Bytes' && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {resource.tamaño}
            </span>
          )}
          {resource.status && (
            <span className={`text-xs px-2 py-1 rounded-full border ${statusDetails.color}`}>
              {statusDetails.label}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-900 mb-2 truncate" title={resource.nombre}>
          {resource.nombre}
        </h3>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600">{resource.marca}</p>
          <p className="text-xs text-gray-500 line-clamp-2 h-8">{resource.descripcion}</p>
          
          <div className="flex flex-wrap gap-1 pt-1">
            {(resource.tags || []).slice(0, 3).map(tag => (
              <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mb-4 mt-auto">
        Subido: {new Date(resource.fechaSubida).toLocaleDateString('es-ES')}
      </div>
      
      {resource.status === 'pendiente-revision' ? (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onResourceAction('preview', resource)}
            >
              <Eye className="w-3 h-3 mr-1" />
              Ver
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onResourceAction('download', resource)}
            >
              <Download className="w-3 h-3 mr-1" />
              Descargar
            </Button>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-orange-600 border-orange-200 hover:bg-orange-50"
            onClick={() => onResourceAction('statusChange', resource)}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Revisar Recurso
          </Button>
        </div>
      ) : resource.status === 'aprobado' ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onResourceAction('preview', resource)}
            >
              <Eye className="w-3 h-3 mr-1" />
              Ver
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onResourceAction('download', resource)}
            >
              <Download className="w-3 h-3 mr-1" />
              Descargar
            </Button>
          </div>
          <Button
            size="sm"
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => onUseAsInput(resource)}
          >
            <ArrowRight className="w-3 h-3 mr-1" />
            Usar como Input
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="w-full text-green-600 border-green-200 hover:bg-green-50"
            onClick={() => onResourceAction('linkTask', resource)}
          >
            <Plus className="w-3 h-3 mr-1" />
            Vincular a Tarea
          </Button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => onResourceAction('preview', resource)}
          >
            <Eye className="w-3 h-3 mr-1" />
            Ver
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onResourceAction('download', resource)}
          >
            <Download className="w-3 h-3 mr-1" />
            Descargar
          </Button>
        </div>
      )}
    </motion.div>
  );
}