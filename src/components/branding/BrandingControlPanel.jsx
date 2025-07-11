import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Save, Eye, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { hasPermission } from '@/lib/permissions';
import { useAuth } from '@/contexts/AuthContext';
import BrandingSections from '@/components/branding/BrandingSections';
import BrandingContent from '@/components/branding/BrandingContent';
import { brandingService } from '@/lib/services/brandingService.js';

export default function BrandingControlPanel({ client, brand, onBack }) {
  const [brandingData, setBrandingData] = useState(null);
  const [activeSection, setActiveSection] = useState('brief');
  const [isEditing, setIsEditing] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const { profile: currentUserProfile } = useAuth();
  
  useEffect(() => {
    loadBrandingData();
  }, [brand.id]);

  useEffect(() => {
    if (currentUserProfile) {
      const canEditBranding = hasPermission(currentUserProfile.role, 'editBranding');
      setCanEdit(canEditBranding);
    }
  }, [currentUserProfile]);
  
  const loadBrandingData = async () => {
    try {
      const data = await brandingService.getBrandingForBrand(brand.id);
      if (data) {
        setBrandingData(data);
      } else {
        const newData = brandingService.generateExampleBrandingData(brand, client.id);
        setBrandingData(newData);
        await brandingService.saveBrandingData(brand.id, newData, client.id);
      }
    } catch (error) {
      toast({ title: "Error", description: "No se pudo cargar el branding.", variant: "destructive" });
      const newData = brandingService.generateExampleBrandingData(brand, client.id);
      setBrandingData(newData);
    }
  };

  const saveBrandingData = async () => {
    if (!canEdit) {
      toast({
        title: "Sin permisos",
        description: "No tienes permisos para editar el Branding Control",
        variant: "destructive"
      });
      return;
    }

    try {
      await brandingService.saveBrandingData(brand.id, brandingData, client.id);
      setIsEditing(false);
      toast({
        title: "Branding actualizado",
        description: "Los cambios han sido guardados correctamente"
      });
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudo actualizar el branding.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (section, field, value) => {
    setBrandingData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSimpleInputChange = (field, value) => {
    setBrandingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditToggle = () => {
    if (!canEdit) {
      toast({
        title: "Sin permisos",
        description: "No tienes permisos para editar el Branding Control.",
        variant: "destructive"
      });
      return;
    }
    setIsEditing(!isEditing);
  };
  
  if (!brandingData) {
    return <div>Cargando Branding Control...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Brand Control
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Branding Control</h1>
            <p className="text-gray-600">
              Cliente: {client.name || client.nombre} • Marca: {brand.name || brand.nombre}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {!canEdit && (
            <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
              <Lock className="w-4 h-4 mr-2" />
              Solo lectura
            </div>
          )}
          
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => { setIsEditing(false); loadBrandingData(); }}>
                Cancelar
              </Button>
              <Button onClick={saveBrandingData}>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleEditToggle}
              disabled={!canEdit}
              className={!canEdit ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <Edit className="w-4 h-4 mr-2" />
              {canEdit ? 'Editar Branding' : 'Sin permisos para editar'}
            </Button>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Acceso al Branding Control</h4>
            <div className="text-blue-800 text-sm mt-1 space-y-1">
              <p>• <strong>Todos los perfiles</strong> pueden consultar la información del branding</p>
              <p>• <strong>Solo un rol de Director</strong> puede editar el contenido</p>
              <p>• <strong>Usuario actual:</strong> {currentUserProfile?.full_name} ({currentUserProfile?.role})</p>
              <p>• <strong>Permisos:</strong> {canEdit ? 'Lectura y escritura' : 'Solo lectura'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <BrandingSections 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <BrandingContent 
              activeSection={activeSection}
              brandingData={brandingData}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
              handleSimpleInputChange={handleSimpleInputChange}
              setBrandingData={setBrandingData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}