import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Plus, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { hasPermission } from '@/lib/permissions';
import { useAuth } from '@/contexts/AuthContext';
import BrandHubHeader from '@/components/brand/BrandHubHeader';
import BrandHubStats from '@/components/brand/BrandHubStats';
import BrandHubGrid from '@/components/brand/BrandHubGrid';
import BrandHubInfo from '@/components/brand/BrandHubInfo';
import BrandForm from '@/components/brand/BrandForm';
import BrandingControlPanel from '@/components/branding/BrandingControlPanel';
import { useBrandHubData } from '@/hooks/useBrandHubData';

export default function BrandHub() {
  const [editingBrand, setEditingBrand] = useState(null);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [viewMode, setViewMode] = useState('hub');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const { profile: currentUserProfile } = useAuth();
  const [canEdit, setCanEdit] = useState(false);

  const { brands, clients, loadData, saveBrand } = useBrandHubData();

  useEffect(() => {
    loadData();
  }, []);

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

  const handleSaveBrand = (brandData) => {
    const isEditing = brands.find(b => b.id === brandData.id);
    
    if (isEditing) {
      toast({
        title: "Marca actualizada",
        description: `La marca ${brandData.name} ha sido actualizada correctamente`
      });
    } else {
      toast({
        title: "Marca creada",
        description: `La marca ${brandData.name} ha sido creada correctamente`
      });
    }

    saveBrand(brandData);
    setShowBrandForm(false);
    setEditingBrand(null);
  };

  const handleViewBranding = (brand) => {
    const client = clients.find(c => c.id === brand.client_id);
    setSelectedBrand({ ...brand, client });
    setViewMode('branding');
  };

  const handleBackToHub = () => {
    setViewMode('hub');
    setSelectedBrand(null);
    setEditingBrand(null);
    setShowBrandForm(false);
  };

  if (showBrandForm) {
    return (
      <div className="space-y-6">
        <BrandHubHeader
          title={editingBrand ? 'Editar Marca' : 'Nueva Marca'}
          subtitle="Gestiona los datos operativos de la marca"
          canEdit={canEdit}
          currentUser={currentUserProfile}
          onBack={handleBackToHub}
          showAddButton={false}
        />

        <BrandForm
          editingBrand={editingBrand}
          clients={clients}
          onSave={handleSaveBrand}
          onCancel={handleBackToHub}
        />
      </div>
    );
  }

  if (viewMode === 'branding' && selectedBrand) {
    return (
      <BrandingControlPanel
        client={selectedBrand.client}
        brand={selectedBrand}
        onBack={handleBackToHub}
      />
    );
  }

  return (
    <div className="space-y-6">
      <BrandHubHeader
        title="Brand Hub"
        subtitle="Centro de gestión de marcas e identidad visual"
        canEdit={canEdit}
        currentUser={currentUserProfile}
        onBack={null}
        onAddBrand={handleAddBrand}
        showAddButton={true}
      />

      <BrandHubInfo currentUser={currentUserProfile} canEdit={canEdit} />

      <BrandHubStats brands={brands} clients={clients} />

      <BrandHubGrid
        brands={brands}
        clients={clients}
        canEdit={canEdit}
        onEditBrand={handleEditBrand}
        onViewBranding={handleViewBranding}
        onAddBrand={handleAddBrand}
      />
    </div>
  );
}