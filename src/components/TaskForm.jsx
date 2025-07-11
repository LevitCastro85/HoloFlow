import React from 'react';
import { useTaskCreation } from '@/hooks/useTaskCreation';
import TaskTypeSelector from '@/components/task/TaskTypeSelector';
import BulkTaskForm from '@/components/task/BulkTaskForm';
import DigitalContentForm from '@/components/task/forms/DigitalContentForm';
import FieldProductionForm from '@/components/task/forms/FieldProductionForm';
import StrategyDocumentsForm from '@/components/task/forms/StrategyDocumentsForm';
import WebDevelopmentForm from '@/components/task/forms/WebDevelopmentForm';
import ResourceTaskForm from '@/components/task/forms/ResourceTaskForm';
import { Button } from '@/components/ui/button';
import { Plus, Palette } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function TaskForm() {
  const {
    brands,
    selectedBrand,
    selectedTaskType,
    currentStep,
    isLoading,
    handleBrandSelect,
    handleTypeSelect,
    handleTaskSave,
    handleBulkTasksSave,
    resetForm,
    getClientForBrand,
  } = useTaskCreation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (currentStep === 'form' && selectedBrand && selectedTaskType) {
    const client = getClientForBrand(selectedBrand.id);

    switch (selectedTaskType) {
      case 'bulk':
        return (
          <BulkTaskForm
            brand={selectedBrand}
            client={client}
            onSave={handleBulkTasksSave}
            onCancel={resetForm}
          />
        );
      case 'digital-content':
        return (
          <DigitalContentForm
            brand={selectedBrand}
            client={client}
            onSave={handleTaskSave}
            onCancel={resetForm}
          />
        );
      case 'field-production':
        return (
          <FieldProductionForm
            brand={selectedBrand}
            client={client}
            onSave={handleTaskSave}
            onCancel={resetForm}
          />
        );
      case 'strategy-documents':
        return (
          <StrategyDocumentsForm
            brand={selectedBrand}
            client={client}
            onSave={handleTaskSave}
            onCancel={resetForm}
          />
        );
      case 'web-development':
        return (
          <WebDevelopmentForm
            brand={selectedBrand}
            client={client}
            onSave={handleTaskSave}
            onCancel={resetForm}
          />
        );
      case 'resource':
        return (
          <ResourceTaskForm
            brand={selectedBrand}
            client={client}
            onSave={handleTaskSave}
            onCancel={resetForm}
          />
        );
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">Tipo de tarea no reconocido</p>
            <Button onClick={resetForm} className="mt-4">Volver al inicio</Button>
          </div>
        );
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Tarea Creativa</h1>
          <p className="text-gray-600 mt-1">
            Selecciona la marca y el tipo de tarea que mejor se adapte a tu trabajo
          </p>
        </div>
      </div>

      {brands.length > 0 ? (
        <TaskTypeSelector
          brands={brands}
          selectedBrand={selectedBrand}
          onBrandSelect={handleBrandSelect}
          onTypeSelect={handleTypeSelect}
        />
      ) : (
        <div className="bg-white rounded-lg p-6 border shadow-sm">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay marcas registradas</h3>
            <p className="text-gray-600 mb-6">
              Primero debes registrar marcas en el Brand Hub para poder crear tareas
            </p>
            <Button onClick={() => toast({
              title: "🚧 Navegación a Brand Hub",
              description: "Esta función te llevará al Brand Hub para registrar marcas."
            })}>
              <Plus className="w-4 h-4 mr-2" />
              Ir a Brand Hub
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}