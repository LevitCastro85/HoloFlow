import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import DeliveryUploader from '@/components/delivery/DeliveryUploader';
import FreelancerHeader from '@/components/freelancer/FreelancerHeader';
import FreelancerDashboard from '@/components/freelancer/FreelancerDashboard';
import FreelancerTaskDetail from '@/components/freelancer/FreelancerTaskDetail';
import { tasksService, collaboratorsService } from '@/lib/supabaseHelpers';

export default function FreelancerView({ onBackToAdmin }) {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDeliveryUploader, setShowDeliveryUploader] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadAssignedTasks();
    }
  }, [currentUser]);

  const loadCurrentUser = async () => {
    try {
      const collaborators = await collaboratorsService.getAll();
      if (collaborators && collaborators.length > 0) {
        const freelancer = collaborators.find(c => c.collaborator_type === 'freelancer') || collaborators[0];
        setCurrentUser(freelancer);
      } else {
        const mockUser = {
          id: 1,
          name: 'Usuario Freelancer',
          email: 'freelancer@ejemplo.com',
          specialty: 'Diseño Gráfico',
          collaborator_type: 'freelancer'
        };
        setCurrentUser(mockUser);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
      const mockUser = {
        id: 1,
        name: 'Usuario Freelancer',
        email: 'freelancer@ejemplo.com',
        specialty: 'Diseño Gráfico',
        collaborator_type: 'freelancer'
      };
      setCurrentUser(mockUser);
    }
  };

  const loadAssignedTasks = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const allTasks = await tasksService.getAll();
      const userTasks = allTasks.filter(task => 
        task.assigned_to === currentUser.id || 
        task.assigned_collaborator?.id === currentUser.id
      );
      setAssignedTasks(userTasks);
    } catch (error) {
      console.error('Error loading assigned tasks:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las tareas asignadas",
        variant: "destructive"
      });
      setAssignedTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverySubmit = async (delivery) => {
    try {
      toast({
        title: "Entregable subido",
        description: "El entregable se ha guardado correctamente"
      });
      setShowDeliveryUploader(false);
      setSelectedTask(null);
      await loadAssignedTasks();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo subir el entregable",
        variant: "destructive"
      });
    }
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
  };

  const handleUploadDelivery = (task) => {
    setSelectedTask(task);
    setShowDeliveryUploader(true);
  };

  const handleBackToTasks = () => {
    setSelectedTask(null);
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await tasksService.update(taskId, { status: newStatus });
      await loadAssignedTasks();
      if (selectedTask?.id === taskId) {
        setSelectedTask(prev => ({...prev, status: newStatus}));
      }
      toast({
        title: "Estado actualizado",
        description: "El estado de la tarea se ha actualizado correctamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la tarea",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel freelancer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FreelancerHeader 
        currentUser={currentUser}
        assignedTasks={assignedTasks}
        onBackToAdmin={onBackToAdmin}
      />

      <div className="p-6">
        {!selectedTask ? (
          <FreelancerDashboard
            currentUser={currentUser}
            assignedTasks={assignedTasks}
            onSelectTask={handleSelectTask}
            onUploadDelivery={handleUploadDelivery}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            loading={loading}
          />
        ) : (
          <FreelancerTaskDetail
            task={selectedTask}
            onBack={handleBackToTasks}
            onUpdateStatus={handleUpdateTaskStatus}
            onUploadDelivery={() => handleUploadDelivery(selectedTask)}
          />
        )}
        
        {showDeliveryUploader && selectedTask && (
          <DeliveryUploader
            task={selectedTask}
            onDeliverySubmit={handleDeliverySubmit}
            onClose={() => setShowDeliveryUploader(false)}
          />
        )}
      </div>
    </div>
  );
}