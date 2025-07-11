import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { hasPermission } from '@/lib/permissions';
import { useAuth } from '@/contexts/AuthContext';
import BrandForm from '@/components/brand/BrandForm';
import BrandControlHeader from '@/components/brand/BrandControlHeader';
import BrandControlStats from '@/components/brand/BrandControlStats';
import BrandControlGrid from '@/components/brand/BrandControlGrid';
import BrandControlInfo from '@/components/brand/BrandControlInfo';
import { useBrandData } from '@/hooks/useBrandData';
import { brandsService } from '@/lib/services/brandsService';

export default function BrandControlModule({ client, onBack, onViewBranding }) {
  const [editingBrand, setEditingBrand] = useState(null);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const { profile: currentUserProfile } = useAuth();
  const [canEdit, setCanEdit] = useState(false);

  const { brands, loadBrands } = useBrandData(client.id);

  useEffect(() => {
    loadBrands();
  }, [client.id]);
  
  useEffect(() => {
    if (currentUserProfile) {
      const canEditBrands = hasPermission(currentUserProfile.role, 'editAll') || hasPermission(currentUserProfile.role, 'createTasks');
      setCanEdit(canEditBrands);
    }
  }, [currentUserProfile]);

  const handleAddBrand = () => {
    if (!canEdit) {
      toast({
        title: "Sin permisos",
        description: "Solo Supervisores y Directores pueden crear marcas",
        variant: "destructive"
      });
      return;
    }
    
    setEditingBrand(null);
    setShowBrandForm(true);
  };

  const handleEditBrand = (brand) => {
    if (!canEdit) {
      toast({
        title: "Sin permisos",
        description: "Solo Supervisores y Directores pueden editar marcas",
        variant: "destructive"
      });
      return;
    }
    
    setEditingBrand(brand);
    setShowBrandForm(true);
  };

  const handleSaveBrand = async (brandData) => {
    try {
      const dataToSave = { ...brandData, client_id: client.id };
      if (brandData.id) {
        await brandsService.update(brandData.id, dataToSave);
        toast({ title: "Marca actualizada", description: `La marca ${brandData.name} ha sido actualizada.` });
      } else {
        await brandsService.create(dataToSave);
        toast({ title: "Marca creada", description: `La marca ${brandData.name} ha sido creada.` });
      }
      loadBrands();
      setShowBrandForm(false);
      setEditingBrand(null);
    } catch (error) {
      toast({ title: "Error", description: "No se pudo guardar la marca.", variant: "destructive" });
    }
  };

  const handleViewBranding = (brand) => {
    onViewBranding(client, brand);
  };

  if (showBrandForm) {
    return (
      <div className="space-y-6">
        <BrandControlHeader
          client={client}
          canEdit={canEdit}
          currentUser={currentUserProfile}
          onBack={() => setShowBrandForm(false)}
          onAddBrand={handleAddBrand}
        />

        <BrandForm
          editingBrand={editingBrand}
          onSave={handleSaveBrand}
          onCancel={() => setShowBrandForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BrandControlHeader
        client={client}
        canEdit={canEdit}
        currentUser={currentUserProfile}
        onBack={onBack}
        onAddBrand={handleAddBrand}
      />

      <BrandControlInfo client={client} />

      <BrandControlStats brands={brands} />

      <BrandControlGrid
        brands={brands}
        canEdit={canEdit}
        onEditBrand={handleEditBrand}
        onViewBranding={handleViewBranding}
        onAddBrand={handleAddBrand}
      />

      <BrandControlInfo client={client} currentUser={currentUserProfile} canEdit={canEdit} showPermissions />
    </div>
  );
}