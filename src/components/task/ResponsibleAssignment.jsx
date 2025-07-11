import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Users,
  Calendar,
  BarChart3,
  Shield,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { hasPermission } from '@/lib/permissions';
import { useAuth } from '@/contexts/AuthContext';

export default function ResponsibleAssignment({ 
  task, 
  collaborators, 
  onAssignmentChange, 
  showWorkload = true 
}) {
  const [selectedResponsible, setSelectedResponsible] = useState(task?.responsable || '');
  const [workloadData, setWorkloadData] = useState({});
  const { profile: currentUser } = useAuth();
  const [canAssign, setCanAssign] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const canAssignTasks = hasPermission(currentUser.role, 'createTasks');
      setCanAssign(canAssignTasks);
    }
    loadWorkloadData();
  }, [currentUser]);

  useEffect(() => {
    setSelectedResponsible(task?.responsable || '');
  }, [task]);

  const loadWorkloadData = () => {
    const savedTasks = localStorage.getItem('brandTasks');
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      
      const workload = {};
      
      collaborators.forEach(collaborator => {
        const activeTasks = allTasks.filter(t => 
          t.responsable === collaborator.nombre && 
          ['en-fila', 'en-proceso', 'revision'].includes(t.estado)
        );
        
        const completedTasks = allTasks.filter(t => 
          t.responsable === collaborator.nombre && 
          t.estado === 'entregado'
        );

        const tasksWithResponseTime = completedTasks.filter(t => t.tiempoRespuesta);
        const avgResponseTime = tasksWithResponseTime.length > 0 
          ? Math.round(tasksWithResponseTime.reduce((sum, t) => sum + t.tiempoRespuesta, 0) / tasksWithResponseTime.length)
          : 0;

        workload[collaborator.nombre] = {
          activeTasks: activeTasks.length,
          completedTasks: completedTasks.length,
          totalTasks: activeTasks.length + completedTasks.length,
          avgResponseTime,
          efficiency: calculateEfficiency(activeTasks, completedTasks),
          availability: getAvailabilityStatus(activeTasks.length)
        };
      });
      
      setWorkloadData(workload);
    }
  };

  const calculateEfficiency = (activeTasks, completedTasks) => {
    const total = activeTasks.length + completedTasks.length;
    if (total === 0) return 100;
    
    const completionRate = (completedTasks.length / total) * 100;
    const overdueTasks = activeTasks.filter(t => {
      const today = new Date();
      const taskDate = new Date(t.fechaEntrega);
      return taskDate < today;
    }).length;
    
    const overdueRate = activeTasks.length > 0 ? (overdueTasks / activeTasks.length) * 100 : 0;
    
    return Math.max(0, Math.round(completionRate - overdueRate));
  };

  const getAvailabilityStatus = (activeTasks) => {
    if (activeTasks === 0) return { status: 'available', label: 'Disponible', color: 'text-green-600' };
    if (activeTasks <= 2) return { status: 'light', label: 'Carga ligera', color: 'text-yellow-600' };
    if (activeTasks <= 4) return { status: 'moderate', label: 'Carga moderada', color: 'text-orange-600' };
    return { status: 'heavy', label: 'Carga alta', color: 'text-red-600' };
  };

  const handleAssignment = (collaboratorName) => {
    if (!canAssign) {
      toast({
        title: "Sin permisos",
        description: "Solo Administradores y Directores pueden asignar responsables.",
        variant: "destructive"
      });
      return;
    }

    const now = new Date().toISOString();
    const assignmentData = {
      responsable: collaboratorName,
      fechaAsignacion: now,
      asignadoPor: currentUser?.name || 'Sistema',
      rolAsignador: currentUser?.role || 'unknown'
    };

    recordAssignmentMetrics(collaboratorName, assignmentData);

    setSelectedResponsible(collaboratorName);
    onAssignmentChange(assignmentData);

    toast({
      title: "Responsable asignado",
      description: `Tarea asignada a ${collaboratorName} el ${new Date(now).toLocaleString('es-ES')}`
    });

    setTimeout(loadWorkloadData, 100);
  };

  const recordAssignmentMetrics = (collaboratorName, assignmentData) => {
    const savedFreelancers = localStorage.getItem('creativeFreelancers');
    if (savedFreelancers) {
      const freelancers = JSON.parse(savedFreelancers);
      const updatedFreelancers = freelancers.map(freelancer => {
        if (freelancer.nombre === collaboratorName) {
          return {
            ...freelancer,
            tareasAsignadas: (freelancer.tareasAsignadas || 0) + 1,
            ultimaAsignacion: assignmentData.fechaAsignacion,
            asignadoPor: assignmentData.asignadoPor
          };
        }
        return freelancer;
      });
      localStorage.setItem('creativeFreelancers', JSON.stringify(updatedFreelancers));
    }

    const assignmentHistory = JSON.parse(localStorage.getItem('assignmentHistory') || '[]');
    assignmentHistory.push({
      id: Date.now(),
      taskId: task?.id,
      taskTitle: task?.titulo,
      collaborator: collaboratorName,
      assignedBy: assignmentData.asignadoPor,
      assignedByRole: assignmentData.rolAsignador,
      assignmentDate: assignmentData.fechaAsignacion,
      brandName: task?.marcaNombre,
      clientName: task?.clienteNombre
    });
    localStorage.setItem('assignmentHistory', JSON.stringify(assignmentHistory));
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'director': return <Crown className="w-4 h-4 text-purple-600" />;
      case 'supervisor': return <Shield className="w-4 h-4 text-blue-600" />;
      default: return <User className="w-4 h-4 text-green-600" />;
    }
  };

  if (!canAssign && task?.responsable) {
    const assignedCollaborator = collaborators.find(c => c.nombre === task.responsable);
    const workload = workloadData[task.responsable] || {};
    
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <User className="w-5 h-5 mr-2 text-gray-600" />
          Responsable Asignado
        </h4>
        
        {assignedCollaborator && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              {getRoleIcon(assignedCollaborator.rol)}
            </div>
            <div>
              <p className="font-medium text-gray-900">{assignedCollaborator.nombre}</p>
              <p className="text-sm text-gray-600">{assignedCollaborator.especialidad}</p>
              {showWorkload && workload.activeTasks !== undefined && (
                <p className="text-xs text-gray-500">
                  {workload.activeTasks} tareas activas • {workload.avgResponseTime}d promedio
                </p>
              )}
            </div>
          </div>
        )}
        
        {task.fechaAsignacion && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Asignado el {new Date(task.fechaAsignacion).toLocaleString('es-ES')}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-600" />
          Asignación de Responsable
        </h4>
        
        {!canAssign && (
          <div className="flex items-center text-xs text-gray-500">
            <AlertCircle className="w-3 h-3 mr-1" />
            Solo lectura
          </div>
        )}
      </div>

      <div className="grid gap-3">
        {collaborators.map((collaborator, index) => {
          const workload = workloadData[collaborator.nombre] || {};
          const isSelected = selectedResponsible === collaborator.nombre;
          const availability = workload.availability || { status: 'available', label: 'Disponible', color: 'text-green-600' };
          
          return (
            <motion.div
              key={collaborator.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : canAssign 
                    ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    : 'border-gray-200 bg-gray-50'
              } ${!canAssign ? 'cursor-not-allowed opacity-60' : ''}`}
              onClick={() => canAssign && handleAssignment(collaborator.nombre)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {getRoleIcon(collaborator.rol)}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{collaborator.nombre}</p>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{collaborator.especialidad}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className={`text-xs font-medium ${availability.color}`}>
                        {availability.label}
                      </span>
                      {collaborator.disponibilidad && (
                        <span className="text-xs text-gray-500">
                          {collaborator.disponibilidad}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {showWorkload && workload.activeTasks !== undefined && (
                  <div className="text-right">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{workload.activeTasks}</p>
                        <p className="text-xs text-gray-500">Activas</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{workload.avgResponseTime}d</p>
                        <p className="text-xs text-gray-500">Promedio</p>
                      </div>
                      
                      <div className="text-center">
                        <p className={`font-semibold ${
                          workload.efficiency >= 80 ? 'text-green-600' :
                          workload.efficiency >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {workload.efficiency}%
                        </p>
                        <p className="text-xs text-gray-500">Eficiencia</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {isSelected && task?.fechaAsignacion && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-blue-700">
                      <Calendar className="w-4 h-4 mr-1" />
                      Asignado el {new Date(task.fechaAsignacion).toLocaleString('es-ES')}
                    </div>
                    
                    {task.asignadoPor && (
                      <div className="text-blue-600">
                        Por: {task.asignadoPor}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {collaborators.length === 0 && (
        <div className="text-center py-6 border border-gray-200 rounded-lg">
          <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">No hay colaboradores disponibles</p>
        </div>
      )}

      {canAssign && selectedResponsible && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center text-green-800">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              Responsable asignado: {selectedResponsible}
            </span>
          </div>
          <p className="text-green-700 text-xs mt-1">
            Se registrará la fecha y hora de asignación para métricas de rendimiento
          </p>
        </div>
      )}
    </div>
  );
}