import React, { useState } from 'react';
import { Plus, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useServicesData } from '@/hooks/useServicesData';
import ServiceTabs from '@/components/services/ServiceTabs';
import ServicesDashboard from '@/components/services/ServicesDashboard';
import ServiceCatalog from '@/components/services/ServiceCatalog';
import ServiceModal from '@/components/services/ServiceModal';
import CategoryModal from '@/components/services/CategoryModal';

export default function ServicesPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const {
    loading,
    services,
    categories,
    modalState,
    editingService,
    setEditingService,
    editingCategory,
    setEditingCategory,
    openModal,
    closeModal,
    handleSaveService,
    handleSaveCategory,
  } = useServicesData();

  const handleAddService = () => {
    openModal('service', {
      name: '',
      description: '',
      category_id: categories[0]?.id || null,
      estimated_days: 1,
      base_price: 0,
      notes: ''
    });
  };

  const handleAddCategory = () => {
    openModal('category', {
      name: '',
      description: '',
      display_order: categories.length + 1
    });
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center p-12">Cargando datos de servicios...</div>;
    }
    
    switch (activeTab) {
      case 'dashboard':
        return (
          <ServicesDashboard 
            services={services}
            categories={categories}
            onEditService={(service) => openModal('service', service)}
            onAddService={handleAddService}
            onAddCategory={handleAddCategory}
          />
        );
      case 'catalog':
        return (
          <ServiceCatalog 
            services={services}
            categories={categories}
            onEditService={(service) => openModal('service', service)}
            onAddService={handleAddService}
            onAddCategory={handleAddCategory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Servicios y Precios</h1>
          <p className="text-gray-600 mt-1">Panel de control del portafolio de servicios</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleAddCategory}>
            <FolderPlus className="w-4 h-4 mr-2" />
            Nueva Categoría
          </Button>
          <Button onClick={handleAddService}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Servicio
          </Button>
        </div>
      </div>

      <ServiceTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="p-6 bg-white rounded-xl shadow-sm border">
        {renderContent()}
      </div>

      <ServiceModal 
        show={modalState.service}
        onClose={() => closeModal('service')}
        editingService={editingService}
        setEditingService={setEditingService}
        onSave={handleSaveService}
        categories={categories}
      />

      <CategoryModal 
        show={modalState.category}
        onClose={() => closeModal('category')}
        editingCategory={editingCategory}
        setEditingCategory={setEditingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
}