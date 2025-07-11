import React from 'react';
import { Archive, Table } from 'lucide-react';
import { useResourceBank } from '@/hooks/useResourceBank';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResourceBankHeader from '@/components/resource/ResourceBankHeader';
import ResourceBankFilters from '@/components/resource/ResourceBankFilters';
import ResourceGrid from '@/components/resource/ResourceGrid';
import ResourceLegend from '@/components/resource/ResourceLegend';
import ResourceReviewControl from '@/components/resource/ResourceReviewControl';
import ResourceUploadModal from '@/components/resource/ResourceUploadModal';
import ResourceStatusChangeModal from '@/components/resource/ResourceStatusChangeModal';
import ResourcePreviewModal from '@/components/resource/ResourcePreviewModal';
import TaskLinkModal from '@/components/resource/TaskLinkModal';
import TaskWithResourceForm from '@/components/task/TaskWithResourceForm';
import { resourceStatusLabels } from '@/lib/resourceConstants';

export default function ResourceBank() {
  const {
    resources,
    filteredResources,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    uniqueMarcas,
    uniqueTipos,
    uniqueCategorias,
    uniqueStatuses,
    activeTab,
    setActiveTab,
    modalState,
    handleCloseModals,
    handleResourceUpload,
    handleStatusChange,
    handleUseAsInput,
    handleTaskWithResourceSave,
    handleResourceAction,
    handleOpenUploadModal,
    handleTaskLink,
  } = useResourceBank();

  if (modalState.view === 'taskForm' && modalState.resource) {
    return (
      <TaskWithResourceForm
        resource={modalState.resource}
        onSave={handleTaskWithResourceSave}
        onCancel={handleCloseModals}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ResourceBankHeader onFileUpload={handleOpenUploadModal} />

      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">
          🎯 Centro Operativo de Recursos Creativos
        </h3>
        <p className="text-green-700 text-sm">
          Gestión completa del flujo: <strong>Subida → Revisión → Aprobación → Uso Operativo</strong>. 
          Todos los recursos pasan por Control de Revisión para asegurar calidad y trazabilidad.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grid" className="flex items-center space-x-2">
            <Archive className="w-4 h-4" />
            <span>Vista de Tarjetas</span>
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center space-x-2">
            <Table className="w-4 h-4" />
            <span>Control de Revisión</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          <ResourceBankFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
            uniqueMarcas={uniqueMarcas}
            uniqueTipos={uniqueTipos}
            uniqueCategorias={uniqueCategorias}
            uniqueStatuses={uniqueStatuses}
          />

          <ResourceGrid
            filteredResources={filteredResources}
            searchTerm={searchTerm}
            filters={filters}
            onResourceAction={handleResourceAction}
            onUseAsInput={handleUseAsInput}
          />

          <ResourceLegend />
        </TabsContent>

        <TabsContent value="table" className="space-y-6">
          <ResourceReviewControl
            resources={resources}
            onResourceAction={handleResourceAction}
          />
        </TabsContent>
      </Tabs>

      <ResourceUploadModal
        isOpen={modalState.view === 'upload'}
        onClose={handleCloseModals}
        onSave={handleResourceUpload}
      />
      
      <ResourceStatusChangeModal
        isOpen={modalState.view === 'statusChange'}
        onClose={handleCloseModals}
        onSubmit={handleStatusChange}
        resource={modalState.resource}
      />

      <ResourcePreviewModal
        isOpen={modalState.view === 'preview'}
        onClose={handleCloseModals}
        resource={modalState.resource}
      />

      <TaskLinkModal
        isOpen={modalState.view === 'linkTask'}
        onClose={handleCloseModals}
        onSubmit={handleTaskLink}
        resource={modalState.resource}
      />
    </div>
  );
}