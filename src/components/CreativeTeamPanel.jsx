import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import CreativeTeamHeader from '@/components/creative-team/CreativeTeamHeader';
import CreativeTeamSidebar from '@/components/creative-team/CreativeTeamSidebar';
import CreativeTeamDashboard from '@/components/creative-team/CreativeTeamDashboard';
import MyProfile from '@/components/creative-team/MyProfile';
import { tasksService } from '@/lib/supabaseHelpers';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const PlaceholderView = ({ title }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="p-8 text-center bg-white rounded-xl border"
  >
    <h1 className="text-2xl font-bold mb-4 text-gray-800">{title}</h1>
    <p className="text-gray-600">Esta sección estará disponible próximamente para el equipo creativo.</p>
    <Button className="mt-6" onClick={() => toast({
      title: "🚧 ¡En construcción!",
      description: "Esta función aún no está implementada. ¡Vuelve pronto!",
    })}>
      Saber más
    </Button>
  </motion.div>
);

export default function CreativeTeamPanel({ onBackToAdmin }) {
  const [activeView, setActiveView] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    const loadTasks = async () => {
      if (!profile) return;
      setLoading(true);
      try {
        const allTasks = await tasksService.getAll();
        const userTasks = allTasks.filter(task => 
          task.assigned_to === profile.id || 
          task.assigned_collaborator?.id === profile.id
        );
        setTasks(userTasks);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar las tareas asignadas.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    if (activeView === 'dashboard') {
      loadTasks();
    }
  }, [profile, activeView]);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <CreativeTeamDashboard tasks={tasks} loading={loading} />;
      case 'my-profile':
        return <MyProfile />;
      case 'production-engine':
        return <PlaceholderView title="Motor de Producción" />;
      case 'delivery-calendar':
        return <PlaceholderView title="Calendario de Entregas" />;
      case 'brand-hub':
        return <PlaceholderView title="Brand Hub" />;
      default:
        return <CreativeTeamDashboard tasks={tasks} loading={loading} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <CreativeTeamSidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CreativeTeamHeader currentUser={profile} onBackToAdmin={onBackToAdmin} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}