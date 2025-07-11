import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X,
  Calendar,
  User,
  Tag,
  MessageSquare,
  ExternalLink,
  Clock,
  AlertTriangle,
  Edit,
  Eye,
  Facebook,
  Instagram,
  Hash,
  Youtube,
  Linkedin,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const socialIcons = {
  'facebook': Facebook,
  'instagram': Instagram,
  'tiktok': Hash,
  'youtube': Youtube,
  'linkedin': Linkedin,
  'web': Globe
};

const statusLabels = {
  'en-fila': 'En Fila',
  'en-proceso': 'En Proceso',
  'revision': 'En Revisión',
  'entregado': 'Entregado',
  'requiere-atencion': 'Requiere Atención'
};

const priorityLabels = {
  'normal': 'Normal',
  'alta': 'Alta',
  'urgente': 'Urgente'
};

const contentTypeLabels = {
  'diseño': 'Diseño',
  'reel': 'Reel',
  'video': 'Video',
  'fotografia': 'Fotografía',
  'copy': 'Copy',
  'historia': 'Historia',
  'carrusel': 'Carrusel'
};

export default function CalendarTaskModal({ task, onClose, onEdit }) {
  const [taskData, setTaskData] = useState(null);
  const [brandData, setBrandData] = useState(null);

  useEffect(() => {
    // Cargar datos completos de la tarea
    loadTaskData();
  }, [task]);

  const loadTaskData = () => {
    // Simular estructura completa de datos de tarea
    const completeTask = {
      ...task,
      // Datos específicos del calendario operativo
      redSocial: task.redSocial || 'instagram',
      temaCampana: task.temaCampana || '',
      encabezado: task.encabezado || task.titulo,
      textoDescriptivo: task.textoDescriptivo || task.descripcion || '',
      cta: task.cta || '',
      notasObservaciones: task.notasObservaciones || task.notas || '',
      // Datos adicionales
      fechaCreacion: task.fechaCreacion || task.fechaSolicitud,
      tiempoEstimado: task.tiempoEstimado || '2-4 horas',
      archivosReferencia: task.archivosReferencia || [],
      entregables: task.entregables || []
    };

    setTaskData(completeTask);

    // Cargar datos de la marca
    const savedBrands = localStorage.getItem('brands');
    if (savedBrands) {
      const brands = JSON.parse(savedBrands);
      const brand = brands.find(b => b.id === task.marcaId);
      setBrandData(brand);
    }
  };

  const isTaskOverdue = () => {
    if (!taskData?.fechaEntrega || taskData.estado === 'entregado') return false;
    const today = new Date();
    const taskDate = new Date(taskData.fechaEntrega);
    return taskDate < today;
  };

  const isTaskUrgent = () => {
    if (!taskData?.fechaEntrega || taskData.estado === 'entregado') return false;
    const today = new Date();
    const taskDate = new Date(taskData.fechaEntrega);
    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  const getSocialIcon = (social) => {
    const IconComponent = socialIcons[social] || Globe;
    return IconComponent;
  };

  if (!taskData) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{taskData.titulo}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-600">{taskData.marcaNombre}</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">{taskData.clienteNombre}</span>
              </div>
            </div>
            
            {(isTaskOverdue() || isTaskUrgent()) && (
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                isTaskOverdue() ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
              }`}>
                <AlertTriangle className="w-3 h-3" />
                <span>{isTaskOverdue() ? 'Vencida' : 'Urgente'}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Información principal */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-blue-600" />
                  Información General
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estado:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      taskData.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                      taskData.estado === 'en-proceso' ? 'bg-blue-100 text-blue-800' :
                      taskData.estado === 'revision' ? 'bg-yellow-100 text-yellow-800' :
                      taskData.estado === 'requiere-atencion' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {statusLabels[taskData.estado]}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Prioridad:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      taskData.prioridad === 'urgente' ? 'bg-red-100 text-red-800' :
                      taskData.prioridad === 'alta' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {priorityLabels[taskData.prioridad]}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tipo de contenido:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {contentTypeLabels[taskData.tipoContenido] || taskData.tipoContenido}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Red social:</span>
                    <div className="flex items-center space-x-2">
                      {React.createElement(getSocialIcon(taskData.redSocial), { 
                        className: "w-4 h-4 text-gray-600" 
                      })}
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {taskData.redSocial}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Fechas y Responsable
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Fecha de solicitud:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(taskData.fechaCreacion).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Fecha de entrega:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(taskData.fechaEntrega).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Responsable:</span>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {taskData.responsable || 'Sin asignar'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tiempo estimado:</span>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {taskData.tiempoEstimado}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Contenido específico */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                  Contenido y Mensaje
                </h4>
                
                <div className="space-y-4">
                  {taskData.temaCampana && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tema o Campaña
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {taskData.temaCampana}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Encabezado
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {taskData.encabezado}
                    </p>
                  </div>
                  
                  {taskData.textoDescriptivo && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Texto Descriptivo
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                        {taskData.textoDescriptivo}
                      </p>
                    </div>
                  )}
                  
                  {taskData.cta && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Call to Action (CTA)
                      </label>
                      <p className="text-sm text-gray-900 bg-blue-50 p-2 rounded border border-blue-200">
                        {taskData.cta}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notas y observaciones */}
              {taskData.notasObservaciones && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Notas y Observaciones
                  </h4>
                  <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded border border-yellow-200">
                    {taskData.notasObservaciones}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Archivos y entregables */}
          {(taskData.archivosReferencia?.length > 0 || taskData.entregables?.length > 0) && (
            <div className="border-t pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {taskData.archivosReferencia?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Archivos de Referencia</h4>
                    <div className="space-y-2">
                      {taskData.archivosReferencia.map((archivo, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-700">{archivo}</span>
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {taskData.entregables?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Entregables</h4>
                    <div className="space-y-2">
                      {taskData.entregables.map((entregable, index) => (
                        <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded">
                          <span className="text-sm text-gray-700">{entregable}</span>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Información de la marca */}
          {brandData && (
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Información de la Marca</h4>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-purple-900">{brandData.nombre}</span>
                  <Button size="sm" variant="outline">
                    <Eye className="w-3 h-3 mr-1" />
                    Ver Branding
                  </Button>
                </div>
                <p className="text-sm text-purple-700">
                  {brandData.industria} • {brandData.sitioWeb}
                </p>
                {brandData.redesSociales && (
                  <div className="flex items-center space-x-2 mt-2">
                    {Object.entries(brandData.redesSociales).map(([red, url]) => {
                      if (!url) return null;
                      const IconComponent = getSocialIcon(red);
                      return (
                        <IconComponent key={red} className="w-4 h-4 text-purple-600" />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Editar Tarea
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}