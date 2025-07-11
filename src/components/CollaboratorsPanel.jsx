import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { 
      UserCheck, 
      MapPin, 
      Star, 
      Plus,
      MessageCircle,
      Eye,
      DollarSign,
      Users,
      Calendar,
      Mail,
      Phone,
      UserX
    } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { toast } from '@/components/ui/use-toast';
    import { collaboratorsService } from '@/lib/services/collaboratorsService';
    import { formatCurrency } from '@/lib/utils';
    import CollaboratorModal from '@/components/collaborator/CollaboratorModal';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { Switch } from "@/components/ui/switch";
    import { useAuth } from '@/contexts/AuthContext';

    export default function CollaboratorsPanel() {
      const [collaborators, setCollaborators] = useState([]);
      const [showModal, setShowModal] = useState(false);
      const [editingCollaborator, setEditingCollaborator] = useState(null);
      const [loading, setLoading] = useState(true);
      const [activeTab, setActiveTab] = useState('active');
      const { profile } = useAuth();

      useEffect(() => {
        loadCollaborators();
      }, []);
      
      const loadCollaborators = async () => {
        setLoading(true);
        try {
          const data = await collaboratorsService.getAll(true);
          setCollaborators(data || []);
        } catch (error) {
          toast({ 
            title: "Error", 
            description: "No se pudieron cargar los colaboradores.", 
            variant: "destructive" 
          });
        } finally {
          setLoading(false);
        }
      };

      const handleStatusChange = async (collaborator, isActive) => {
        try {
          await collaboratorsService.update(collaborator.id, { is_active: isActive });
          toast({
            title: `Estado actualizado`,
            description: `${collaborator.name} ahora está ${isActive ? 'activo' : 'inactivo'}.`
          });
          loadCollaborators();
        } catch (error) {
          toast({
            title: "Error al cambiar estado",
            description: "No se pudo actualizar el estado del colaborador.",
            variant: "destructive"
          });
        }
      };

      const getAvailabilityColor = (availability) => {
        switch (availability) {
          case 'disponible': return 'bg-green-100 text-green-800';
          case 'ocupado': return 'bg-red-100 text-red-800';
          case 'no disponible': return 'bg-yellow-100 text-yellow-800';
          default: return 'bg-gray-100 text-gray-800';
        }
      };

      const getCollaboratorTypeInfo = (type) => {
        return type === 'interno' ? {
          label: 'Colaborador Interno',
          icon: Users,
          color: 'text-blue-600 bg-blue-100',
        } : {
          label: 'Freelancer',
          icon: UserCheck,
          color: 'text-purple-600 bg-purple-100',
        };
      };

      const formatLocation = (city, state) => {
        if (city && state) return `${city}, ${state}`;
        if (city) return city;
        if (state) return state;
        return 'Ubicación no especificada';
      };

      const formatOnboardingDate = (date) => {
        if (!date) return 'Fecha no disponible';
        return new Date(date).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
      };

      const getProfilePhoto = (collaborator) => {
        return collaborator.profile_photo_url || `https://avatar.vercel.sh/${collaborator.email}.png`;
      };

      const handleAddCollaborator = () => {
        setEditingCollaborator(null);
        setShowModal(true);
      };

      const handleEditCollaborator = (collaborator) => {
        setEditingCollaborator(collaborator);
        setShowModal(true);
      };

      const handleSaveCollaborator = async (collaboratorData) => {
        try {
          if (editingCollaborator) {
            if (profile && editingCollaborator.user_id === profile.user_id) {
              await collaboratorsService.updateCurrentUserProfile(collaboratorData);
              toast({ title: "Perfil actualizado", description: "Tus datos se han actualizado correctamente" });
            } else {
              await collaboratorsService.update(editingCollaborator.id, collaboratorData);
              toast({ title: "Colaborador actualizado", description: "Los datos se han actualizado correctamente" });
            }
          } else {
            await collaboratorsService.create(collaboratorData);
            toast({ title: "Invitación Enviada", description: "Se ha enviado una invitación por correo al nuevo colaborador." });
          }
          setShowModal(false);
          loadCollaborators();
        } catch (error) {
          toast({
            title: "Error al guardar",
            description: error.message || "No se pudo guardar la información.",
            variant: "destructive"
          });
        }
      };

      const handleCollaboratorAction = (action, collaboratorId) => {
        toast({
          title: "🚧 Esta funcionalidad aún no está implementada",
          description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt 🚀"
        });
      };

      const renderCollaboratorCard = (collaborator, index) => {
        const typeInfo = getCollaboratorTypeInfo(collaborator.collaborator_type);
        const TypeIcon = typeInfo.icon;
        
        return (
          <motion.div
            key={collaborator.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img  
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  alt={`Foto de perfil de ${collaborator.name}`}
                  src={getProfilePhoto(collaborator)}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{collaborator.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{(collaborator.specialties || []).join(', ')}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(collaborator.availability)}`}>
                {collaborator.availability || 'disponible'}
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                <TypeIcon className="w-3 h-3 mr-1" />
                {typeInfo.label}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id={`status-${collaborator.id}`}
                  checked={collaborator.is_active}
                  onCheckedChange={(checked) => handleStatusChange(collaborator, checked)}
                />
                <label htmlFor={`status-${collaborator.id}`} className="text-sm font-medium">
                  {collaborator.is_active ? 'Activo' : 'Inactivo'}
                </label>
              </div>
            </div>
            
            <div className="space-y-2 mb-4 flex-grow">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{formatLocation(collaborator.city, collaborator.state)}</span>
              </div>
              {collaborator.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{collaborator.email}</span>
                </div>
              )}
              {collaborator.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{collaborator.phone}</span>
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600">
                <Star className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" />
                <span>{collaborator.rating || 5.0} estrellas</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Desde {formatOnboardingDate(collaborator.onboarding_date)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {collaborator.collaborator_type === 'interno' 
                    ? `${formatCurrency(collaborator.weekly_salary || 0)}/semana`
                    : `Desde ${formatCurrency(collaborator.base_activity_rate || 0)}/actividad`
                  }
                </span>
              </div>
            </div>
            
            {collaborator.notes && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Notas</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{collaborator.notes}</p>
              </div>
            )}
            
            <div className="flex space-x-2 mt-auto">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => handleEditCollaborator(collaborator)}
              >
                <Eye className="w-3 h-3 mr-1" />
                Editar
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => handleCollaboratorAction('contact', collaborator.id)}
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Contactar
              </Button>
            </div>
          </motion.div>
        );
      };

      if (loading) {
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando colaboradores...</p>
            </div>
          </div>
        );
      }

      const activeCollaborators = collaborators.filter(c => c.is_active);
      const inactiveCollaborators = collaborators.filter(c => !c.is_active);

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Colaboradores</h1>
              <p className="text-gray-600 mt-1">Gestiona tu equipo interno y red de freelancers</p>
            </div>
            
            <Button onClick={handleAddCollaborator}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Colaborador
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Activos ({activeCollaborators.length})</TabsTrigger>
              <TabsTrigger value="inactive">Inactivos ({inactiveCollaborators.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeCollaborators.map(renderCollaboratorCard)}
              </div>
              {activeCollaborators.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay colaboradores activos</h3>
                  <p className="text-gray-600 mb-4">Agrega nuevos colaboradores o reactiva a los existentes</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="inactive" className="mt-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {inactiveCollaborators.map(renderCollaboratorCard)}
              </div>
              {inactiveCollaborators.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserX className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay colaboradores inactivos</h3>
                  <p className="text-gray-600">Aquí aparecerán los colaboradores que desactives.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <CollaboratorModal
            show={showModal}
            onClose={() => setShowModal(false)}
            collaborator={editingCollaborator}
            onSave={handleSaveCollaborator}
          />
        </div>
      );
    }