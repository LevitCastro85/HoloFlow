import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Upload, 
  Eye,
  Calendar,
  User,
  Building,
  Tag,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export default function FreelancerDashboard({ 
  currentUser, 
  assignedTasks, 
  onSelectTask, 
  onUploadDelivery,
  onUpdateTaskStatus,
  loading 
}) {
  const getTaskMetrics = () => {
    const total = assignedTasks.length;
    const enProceso = assignedTasks.filter(t => t.status === 'en-proceso').length;
    const pendientes = assignedTasks.filter(t => ['en-fila', 'en-proceso'].includes(t.status)).length;
    const completadas = assignedTasks.filter(t => t.status === 'entregado').length;
    const vencidas = assignedTasks.filter(t => 
      t.status !== 'entregado' && 
      t.due_date && 
      new Date(t.due_date) < new Date()
    ).length;

    return { total, enProceso, pendientes, completadas, vencidas };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isOverdue = (task) => {
    return task.status !== 'entregado' && 
           task.due_date && 
           new Date(task.due_date) < new Date();
  };

  const canUploadDelivery = (task) => {
    return ['en-proceso', 'revision', 'requiere-atencion'].includes(task.status);
  };

  const metrics = getTaskMetrics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tareas</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Proceso</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.enProceso}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{metrics.pendientes}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-green-600">{metrics.completadas}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vencidas</p>
              <p className="text-2xl font-bold text-red-600">{metrics.vencidas}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Mis Tareas Asignadas</h2>
          <p className="text-gray-600 mt-1">Gestiona tus tareas y sube entregables</p>
        </div>

        <div className="p-6">
          {assignedTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes tareas asignadas</h3>
              <p className="text-gray-600">Las tareas aparecerán aquí cuando te sean asignadas</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {assignedTasks.map((task, index) => {
                const status = statusConfig[task.status] || statusConfig['en-fila'];
                const priority = priorityConfig[task.priority] || priorityConfig['normal'];
                const StatusIcon = status.icon;
                
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      isOverdue(task) ? 'border-red-200 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </span>
                        <span className={`text-xs font-medium ${priority.color}`}>
                          {priority.icon} {priority.label}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Building className="w-4 h-4 mr-2" />
                        <span>{task.brand?.name || 'Sin marca'}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Tag className="w-4 h-4 mr-2" />
                        <span>{task.service?.name || 'Sin servicio'}</span>
                      </div>
                      
                      <div className={`flex items-center ${isOverdue(task) ? 'text-red-600' : 'text-gray-600'}`}>
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(task.due_date)}</span>
                        {isOverdue(task) && <span className="ml-1 text-xs font-medium">(Vencida)</span>}
                      </div>
                    </div>

                    {task.brief && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Brief</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{task.brief}</p>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSelectTask(task)}
                        className="flex-1"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Ver Detalles
                      </Button>
                      
                      {canUploadDelivery(task) && (
                        <Button
                          size="sm"
                          onClick={() => onUploadDelivery(task)}
                          className="flex-1"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Subir Entregable
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}