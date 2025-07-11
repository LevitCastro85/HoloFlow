import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Building, 
  Tag, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const statusConfig = {
  'en-fila': { 
    label: 'En Fila', 
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: Clock 
  },
  'en-proceso': { 
    label: 'En Proceso', 
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: Clock 
  },
  'revision': { 
    label: 'En Revisión', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: AlertCircle 
  },
  'entregado': { 
    label: 'Entregado', 
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: CheckCircle 
  },
  'requiere-atencion': { 
    label: 'Requiere Atención', 
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: AlertCircle 
  }
};

const priorityConfig = {
  'baja': { label: 'Baja', color: 'text-gray-600', icon: '⚪' },
  'normal': { label: 'Normal', color: 'text-blue-600', icon: '🔵' },
  'media': { label: 'Media', color: 'text-yellow-600', icon: '🟡' },
  'alta': { label: 'Alta', color: 'text-orange-600', icon: '🟠' },
  'urgente': { label: 'Urgente', color: 'text-red-600', icon: '🔴' }
};

export default function FreelancerTaskDetail({ task, onBack, onUpdateStatus, onUploadDelivery }) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isOverdue = () => {
    return task.status !== 'entregado' && 
           task.due_date && 
           new Date(task.due_date) < new Date();
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      await onUpdateStatus(task.id, newStatus);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getAvailableStatusTransitions = () => {
    switch (task.status) {
      case 'en-fila':
        return ['en-proceso'];
      case 'requiere-atencion':
        return ['en-proceso'];
      default:
        return [];
    }
  };

  const status = statusConfig[task.status] || statusConfig['en-fila'];
  const priority = priorityConfig[task.priority] || priorityConfig['normal'];
  const StatusIcon = status.icon;
  const availableTransitions = getAvailableStatusTransitions();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Tareas
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          <p className="text-gray-600">Detalles completos de la tarea</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información General</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Marca</p>
                  <p className="font-medium text-gray-900">{task.brand?.name || 'Sin marca'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Tag className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Tipo de Servicio</p>
                  <p className="font-medium text-gray-900">{task.service?.name || 'Sin servicio'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Fecha de Entrega</p>
                  <p className={`font-medium ${isOverdue() ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatDate(task.due_date)}
                    {isOverdue() && <span className="text-xs ml-1">(Vencida)</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`text-lg ${priority.color}`}>{priority.icon}</span>
                <div>
                  <p className="text-sm text-gray-600">Prioridad</p>
                  <p className={`font-medium ${priority.color}`}>{priority.label}</p>
                </div>
              </div>
            </div>

            {task.description && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">{task.description}</p>
              </div>
            )}

            {task.brief && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Brief Creativo</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 leading-relaxed">{task.brief}</p>
                </div>
              </div>
            )}

            {task.notes && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Notas Adicionales</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{task.notes}</p>
                </div>
              </div>
            )}
          </motion.div>

          {(task.social_network || task.campaign_theme || task.header_text || task.call_to_action) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles de Contenido</h2>
              
              <div className="space-y-4">
                {task.social_network && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Red Social</p>
                    <p className="font-medium text-gray-900 capitalize">{task.social_network}</p>
                  </div>
                )}

                {task.campaign_theme && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tema de Campaña</p>
                    <p className="font-medium text-gray-900">{task.campaign_theme}</p>
                  </div>
                )}

                {task.header_text && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Texto Principal</p>
                    <p className="font-medium text-gray-900">{task.header_text}</p>
                  </div>
                )}

                {task.descriptive_text && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Texto Descriptivo</p>
                    <p className="font-medium text-gray-900">{task.descriptive_text}</p>
                  </div>
                )}

                {task.call_to_action && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Call to Action</p>
                    <p className="font-medium text-gray-900">{task.call_to_action}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado Actual</h2>
            
            <div className="flex items-center space-x-3 mb-4">
              <StatusIcon className="w-6 h-6 text-gray-600" />
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
                {status.label}
              </span>
            </div>

            {availableTransitions.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-3">Cambiar estado:</p>
                <div className="space-y-2">
                  {availableTransitions.map(statusKey => {
                    const targetStatus = statusConfig[statusKey];
                    return (
                      <Button
                        key={statusKey}
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(statusKey)}
                        disabled={isUpdatingStatus}
                        className="w-full justify-start"
                      >
                        <targetStatus.icon className="w-4 h-4 mr-2" />
                        {targetStatus.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h2>
            
            <div className="space-y-3">
              {['en-proceso', 'requiere-atencion'].includes(task.status) && (
                <Button
                  className="w-full justify-start"
                  onClick={onUploadDelivery}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Subir Entregable
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast({
                  title: "🚧 Próximamente",
                  description: "La funcionalidad de comentarios estará disponible pronto"
                })}
              >
                <FileText className="w-4 h-4 mr-2" />
                Agregar Comentario
              </Button>
            </div>
          </motion.div>

          {task.created_at && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-lg p-4"
            >
              <h3 className="font-medium text-gray-900 mb-2">Información de Creación</h3>
              <p className="text-sm text-gray-600">
                Creada el {formatDate(task.created_at)}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}