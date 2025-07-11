import React, { useState, useEffect } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Toaster } from '@/components/ui/toaster';
    import { AuthProvider, useAuth } from '@/contexts/AuthContext';
    import Sidebar from '@/components/Sidebar';
    import Dashboard from '@/components/Dashboard';
    import TaskForm from '@/components/TaskForm';
    import ProductionEngine from '@/components/production/ProductionEngine';
    import ClientsPanel from '@/components/ClientsPanel';
    import BrandHub from '@/components/BrandHub';
    import CollaboratorsPanel from '@/components/CollaboratorsPanel';
    import MetricsPanel from '@/components/MetricsPanel';
    import CreativeTeamPanel from '@/components/CreativeTeamPanel';
    import OperationalCalendar from '@/components/calendar/OperationalCalendar';
    import ResourceBank from '@/components/ResourceBank';
    import ProfitabilityPanel from '@/components/ProfitabilityPanel';
    import ProposalGenerator from '@/components/ProposalGenerator';
    import ServicesPanel from '@/components/ServicesPanel';
    import SalesPanel from '@/components/SalesPanel';
    import UserRoleManager from '@/components/auth/UserRoleManager';
    import Login from '@/components/auth/Login';
    import UpdatePassword from '@/components/auth/UpdatePassword';
    import ConfirmAccount from '@/components/auth/ConfirmAccount';
    import { authService } from '@/lib/services/authService';
    import { Button } from '@/components/ui/button';

    function AppContent() {
      const { session, loading, loadingProfile, profile, signOut } = useAuth();
      const [activeView, setActiveView] = useState('dashboard');
      const [isCreativeTeamMode, setIsCreativeTeamMode] = useState(false);
      const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

      useEffect(() => {
        const hash = window.location.hash;
        if (hash.includes('type=recovery')) {
          setIsPasswordRecovery(true);
        }
      }, []);

      const handleCleanDatabase = async () => {
        const confirmed = window.confirm(
          '¿ESTÁS ABSOLUTAMENTE SEGURO?\n\nEsta acción es irreversible. Se borrarán TODOS los clientes, marcas, tareas, recursos y colaboradores, excepto tu propia cuenta de super administrador.'
        );

        if (confirmed) {
          const confirmedAgain = window.confirm(
            'CONFIRMACIÓN FINAL:\n\n¿De verdad quieres borrar toda la información de la base de datos y los datos locales?'
          );

          if (confirmedAgain) {
            alert('Iniciando limpieza de la base de datos. Esta operación puede tardar un momento.');
            const { error } = await authService.cleanDatabase();
            if (error) {
              alert(`Error: No se pudo limpiar la base de datos: ${error.message}`);
            } else {
              alert('Éxito: La base de datos ha sido limpiada. Se recargará la aplicación para aplicar los cambios.');
              localStorage.clear();
              window.location.reload();
            }
          }
        }
      };

      const renderContent = () => {
        if (isCreativeTeamMode) {
          return <CreativeTeamPanel onBackToAdmin={() => setIsCreativeTeamMode(false)} />;
        }

        switch (activeView) {
          case 'dashboard':
            return <Dashboard />;
          case 'nueva-tarea':
            return <TaskForm />;
          case 'produccion':
            return <ProductionEngine />;
          case 'calendario':
            return <OperationalCalendar />;
          case 'brand-hub':
            return <BrandHub />;
          case 'clientes':
            return <ClientsPanel />;
          case 'colaboradores':
            return <CollaboratorsPanel />;
          case 'metricas':
            return <MetricsPanel />;
          case 'recursos':
            return <ResourceBank />;
          case 'rentabilidad':
            return <ProfitabilityPanel />;
          case 'propuestas':
            return <ProposalGenerator />;
          case 'servicios':
            return <ServicesPanel />;
          case 'ventas':
            return <SalesPanel />;
          case 'roles':
            return <UserRoleManager />;
          default:
            return <Dashboard />;
        }
      };
      
      if (window.location.pathname.startsWith('/confirmacion')) {
        return <ConfirmAccount />;
      }

      if (loading || loadingProfile) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-600">Cargando...</div>;
      }

      if (isPasswordRecovery) {
        return <UpdatePassword onFinished={() => {
          window.location.hash = '';
          setIsPasswordRecovery(false);
        }} />;
      }

      if (!session) {
        return <Login />;
      }
      
      if (session && profile && profile.status !== 'approved' && profile.status !== 'pending_profile_completion') {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Tu cuenta está casi lista</h1>
                {profile.status === 'pending_email_confirmation' && <p className="text-gray-600">Por favor, revisa tu correo electrónico y haz clic en el enlace de confirmación para continuar.</p>}
                {profile.status === 'pending_approval' && <p className="text-gray-600">Tu cuenta ha sido verificada y ahora está pendiente de aprobación por un administrador. Te notificaremos pronto.</p>}
                {profile.status === 'rejected' && <p className="text-red-600">Tu solicitud de registro ha sido rechazada. Contacta al administrador si crees que es un error.</p>}
                <Button onClick={signOut} className="mt-8">Cerrar Sesión</Button>
            </div>
        );
      }


      return (
        <div className="flex h-screen bg-gray-50">
          {!isCreativeTeamMode && (
            <Sidebar 
              activeView={activeView} 
              setActiveView={setActiveView}
              onCreativeTeamMode={() => setIsCreativeTeamMode(true)}
              profile={profile}
              onSignOut={signOut}
            />
          )}
          
          <main className={`flex-1 overflow-auto ${!isCreativeTeamMode ? 'ml-64' : ''}`}>
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {renderContent()}
            </motion.div>
          </main>

          {profile?.email === 'levit.delfin@gmail.com' && (
            <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 100 }}>
              <button 
                onClick={handleCleanDatabase}
                style={{ 
                    backgroundColor: '#dc2626', 
                    color: 'white', 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                Limpiar Base de Datos
              </button>
            </div>
          )}
        </div>
      );
    }

    function App() {
      return (
        <AuthProvider>
          <Helmet>
            <title>HoloFlow – Studio Resource Planner</title>
            <meta name="description" content="HoloFlow – Studio Resource Planner: la plataforma para la planificación de recursos de estudios creativos." />
          </Helmet>
          <AppContent />
          <Toaster />
        </AuthProvider>
      );
    }

    export default App;