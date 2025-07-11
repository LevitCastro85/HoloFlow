import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, FileText, Calendar, Tag, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const TaskCard = ({ task, index }) => {
  const isOverdue = task.status !== 'entregado' && new Date(task.due_date) < new Date();

  const getStatusInfo = () => {
    if (isOverdue) {
      return {
        label: 'Vencida',
        colorClass: 'bg-red-50 border-red-200 text-red-800',
        icon: <AlertTriangle className="w-4 h-4" />
      };
    }
    switch (task.status) {
      case 'entregado':
        return {
          label: 'Completada',
          colorClass: 'bg-green-50 border-green-200 text-green-800',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case 'en-proceso':
      case 'revision':
        return {
          label: 'En Proceso',
          colorClass: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: <Clock className="w-4 h-4" />
        };
      case 'en-fila':
      case 'requiere-atencion':
      default:
        return {
          label: 'Pendiente',
          colorClass: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: <Clock className="w-4 h-4" />
        };
    }
  };

  const statusInfo = getStatusInfo();

  const handleNotImplemented = () => {
    toast({
      title: "🚧 ¡En construcción!",
      description: "Esta función estará disponible muy pronto.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`border rounded-xl p-4 flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1 ${statusInfo.colorClass}`}
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 pr-4">{task.title}</h3>
          <span className={`flex items-center shrink-0 space-x-2 text-xs font-semibold px-2 py-1 rounded-full ${statusInfo.colorClass.replace('bg-opacity-20', '')}`}>
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description || 'Sin descripción.'}</p>
        
        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center text-gray-700">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Entrega: {new Date(task.due_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long' })}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Tag className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{task.brand?.name || 'Marca no asignada'}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-2 mt-auto pt-4 border-t">
        <Button size="sm" className="w-full" onClick={handleNotImplemented}>Ver Detalles</Button>
        <Button size="sm" variant="outline" className="w-full bg-white" onClick={handleNotImplemented}>Subir Entrega</Button>
      </div>
    </motion.div>
  );
};

export default function CreativeTeamDashboard({ tasks, loading }) {
  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Creativo</h1>
        <p className="text-gray-600 mt-1">Aquí están todas tus tareas asignadas. ¡Manos a la obra!</p>
      </div>
      
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No tienes tareas asignadas</h3>
          <p className="mt-1 text-sm text-gray-500">Cuando te asignen una tarea, aparecerá aquí.</p>
        </div>
      )}
    </div>
  );
}