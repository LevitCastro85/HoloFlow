import React, { useState, useEffect } from 'react';
import { AlertTriangle, UserCheck, UserX, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collaboratorsService } from '@/lib/services/collaboratorsService';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/lib/permissions';
import UserManagementModal from '@/components/auth/UserManagementModal';
import ApprovalModal from '@/components/auth/ApprovalModal';
import CollaboratorCard from '@/components/auth/CollaboratorCard';

export default function UserRoleManager() {
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [editingUser, setEditingUser] = useState(null);
  const [reviewingUser, setReviewingUser] = useState(null);
  const { profile: currentUserProfile, user } = useAuth();

  const loadCollaborators = async () => {
    setLoading(true);
    try {
      const data = await collaboratorsService.getAll(true);
      setCollaborators(data || []);
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los colaboradores.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollaborators();
  }, []);

  const canManage = hasPermission(currentUserProfile?.role, 'canManageUsers', user);

  const handleUpdateUser = async (id, data) => {
    await collaboratorsService.update(id, data);
    loadCollaborators();
  };

  const handleApprove = async (id, data) => {
    await collaboratorsService.update(id, data);
    loadCollaborators();
  };

  const handleReject = async (id) => {
    await collaboratorsService.reject(id);
    loadCollaborators();
  };

  const handleAccessChange = async (collaborator, hasAccess) => {
    if (!canManage) {
      toast({ title: "No tienes permisos", description: "Solo los directores pueden cambiar el acceso al sistema.", variant: "destructive" });
      return;
    }

    try {
      await collaboratorsService.update(collaborator.id, { has_system_access: hasAccess });
      toast({ title: `Acceso ${hasAccess ? 'Activado' : 'Desactivado'}`, description: `${collaborator.name} ${hasAccess ? 'ahora puede' : 'ya no puede'} acceder al sistema.` });
      loadCollaborators();
    } catch (error) {
      toast({ title: "Error al actualizar", description: error.message, variant: "destructive" });
    }
  };
  
  const pendingCollaborators = collaborators.filter(c => c.status === 'pending_approval' || c.status === 'pending_email_confirmation');
  const activeCollaborators = collaborators.filter(c => c.is_active && c.status === 'approved');
  const inactiveCollaborators = collaborators.filter(c => (!c.is_active && c.status === 'approved') || c.status === 'rejected');
  
  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Roles y Permisos</h1>
          <p className="text-gray-600 mt-1">Administra el acceso y los permisos de tus colaboradores en el sistema.</p>
        </div>
      </div>

      {!canManage && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0"><AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" /></div>
            <div className="ml-3"><p className="text-sm text-yellow-700">Tu rol actual no te permite gestionar los permisos de los usuarios. Solo los directores pueden realizar cambios.</p></div>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            <Clock className="w-4 h-4 mr-2" />
            Solicitudes Pendientes ({pendingCollaborators.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            <UserCheck className="w-4 h-4 mr-2" />
            Colaboradores Activos ({activeCollaborators.length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            <UserX className="w-4 h-4 mr-2" />
            Colaboradores Inactivos ({inactiveCollaborators.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingCollaborators.map(c => (
              <CollaboratorCard 
                key={c.id} 
                collaborator={c} 
                onReview={setReviewingUser} 
                onEdit={setEditingUser} 
                onAccessChange={handleAccessChange} 
                canManage={canManage} 
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeCollaborators.map(c => (
              <CollaboratorCard key={c.id} collaborator={c} onEdit={setEditingUser} onAccessChange={handleAccessChange} canManage={canManage} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="inactive" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {inactiveCollaborators.map(c => (
              <CollaboratorCard key={c.id} collaborator={c} onEdit={setEditingUser} onAccessChange={handleAccessChange} canManage={canManage} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <UserManagementModal user={editingUser} isOpen={!!editingUser} onClose={() => setEditingUser(null)} onSave={handleUpdateUser} />
      <ApprovalModal collaborator={reviewingUser} isOpen={!!reviewingUser} onClose={() => setReviewingUser(null)} onApprove={handleApprove} onReject={handleReject} />
    </div>
  );
}