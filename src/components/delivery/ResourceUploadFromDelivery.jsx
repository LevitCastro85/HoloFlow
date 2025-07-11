import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { resourcesService, tasksService, storageService } from '@/lib/supabaseHelpers';
import ResourceUploadCore from '@/components/delivery/ResourceUploadCore';
import TaskCreationForm from '@/components/delivery/TaskCreationForm';
import { useDeliveryUploader } from '@/hooks/useDeliveryUploader';

export default function ResourceUploadFromDelivery({ 
  onResourceSubmit, 
  onClose, 
  currentUser,
  prefilledData = {} 
}) {
  const {
    deliveryMethod,
    setDeliveryMethod,
    uploadedFiles,
    urlDeliveries,
    newUrl,
    setNewUrl,
    urlDescription,
    setUrlDescription,
    deliveryNotes,
    setDeliveryNotes,
    handleFileUpload,
    removeFile,
    addUrlDelivery,
    removeUrl,
    getFileType,
    formatFileSize,
    getFileIcon
  } = useDeliveryUploader();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [showTaskCreation, setShowTaskCreation] = useState(false);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [newTaskData, setNewTaskData] = useState({
    titulo: '',
    marca: '',
    cliente: '',
    tipoContenido: '',
    fechaEntrega: '',
    asignacion: currentUser?.nombre || 'Auto-asignado'
  });

  useEffect(() => {
    loadAvailableTasks();
    if (prefilledData.taskId) {
      setSelectedTaskId(prefilledData.taskId);
    }
  }, []);

  const loadAvailableTasks = async () => {
    try {
      const tasks = await tasksService.getAll();
      const activeTasks = tasks.filter(task => 
        ['en-proceso', 'revision', 'en-fila'].includes(task.status) &&
        (!currentUser || task.assigned_to === currentUser.id)
      );
      setAvailableTasks(activeTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleCreateNewTask = async () => {
    if (!newTaskData.titulo.trim() || !newTaskData.marca.trim() || !newTaskData.tipoContenido || !newTaskData.fechaEntrega) {
      toast({ title: "Campos requeridos", description: "Completa los campos para crear la tarea", variant: "destructive" });
      return;
    }
    
    setIsCreatingTask(true);
    try {
      const taskData = {
        title: newTaskData.titulo,
        description: `Tarea creada desde subida de recurso por ${currentUser?.nombre || 'colaborador'}`,
        brand_id: 1, // Placeholder, needs proper brand selection logic
        status: 'en-proceso',
        priority: 'media',
        due_date: newTaskData.fechaEntrega,
        assigned_to: currentUser?.id || 1,
        notes: `Tarea con recurso. Marca: ${newTaskData.marca}, Cliente: ${newTaskData.cliente}`
      };

      const createdTask = await tasksService.create(taskData);
      setSelectedTaskId(createdTask.id);
      setAvailableTasks(prev => [...prev, createdTask]);
      setShowTaskCreation(false);
      
      toast({ title: "¡Tarea creada!", description: `Nueva tarea "${createdTask.title}" creada y seleccionada.` });
    } catch (error) {
      toast({ title: "Error al crear tarea", description: error.message, variant: "destructive" });
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleSubmitResource = async () => {
    if (uploadedFiles.length === 0 && urlDeliveries.length === 0) {
      toast({ title: "Sin recursos", description: "Debes subir al menos un archivo o URL", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedTask = availableTasks.find(t => t.id == selectedTaskId);
      
      const baseResourceData = {
        status: 'pendiente-revision',
        task_id: selectedTaskId ? parseInt(selectedTaskId) : null,
        brand_id: selectedTask?.brand_id || null,
        client_id: selectedTask?.client_id || null,
        uploaded_by: currentUser?.id || null,
        submitted_by: currentUser?.nombre || 'Colaborador',
        delivery_method: deliveryMethod,
        delivery_notes: deliveryNotes,
        category: 'entregable',
        tags: ['colaborador', 'nuevo'],
        upload_date: new Date().toISOString()
      };

      let resourcesToCreate = [];

      if (deliveryMethod === 'file') {
        const uploadPromises = uploadedFiles.map(async (fileData) => {
          const fileUrl = await storageService.uploadFile(fileData.file, 'resources');
          if (!fileUrl || !fileUrl.startsWith('http')) {
            throw new Error(`Error al subir ${fileData.name}. No se pudo generar una URL válida.`);
          }
          return {
            ...baseResourceData,
            name: fileData.name,
            file_name: fileData.name,
            file_url: fileUrl,
            file_type: getFileType(fileData.name),
            size: fileData.size,
            description: deliveryNotes || `Recurso subido: ${fileData.name}`
          };
        });
        resourcesToCreate = await Promise.all(uploadPromises);
      } else {
        urlDeliveries.forEach(urlDelivery => resourcesToCreate.push({
          ...baseResourceData,
          name: urlDelivery.description || 'Enlace',
          file_name: urlDelivery.description || 'URL',
          file_url: urlDelivery.url,
          file_type: 'url',
          size: 0,
          description: urlDelivery.description || urlDelivery.url
        }));
      }

      const createdResources = await Promise.all(
        resourcesToCreate.map(resource => resourcesService.create(resource))
      );

      onResourceSubmit({ resources: createdResources, taskId: selectedTaskId });
      toast({ title: "¡Recursos enviados!", description: `${createdResources.length} recurso(s) enviado(s) para revisión.` });
    } catch (error) {
      toast({ title: "Error al subir recursos", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const taskSelectionSection = (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📋 Flujo Unificado de Entregables</h3>
        <p className="text-blue-700 text-sm">Este modal utiliza la misma lógica que los entregables de tareas, permitiendo trazabilidad completa y control de revisión.</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vinculación con Tarea</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tarea relacionada</label>
            <select value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Sin tarea asignada</option>
              {availableTasks.map(task => <option key={task.id} value={task.id}>{task.title} - {task.brand?.name || 'Sin marca'}</option>)}
            </select>
            <p className="text-xs text-gray-500 mt-1">Si no encuentras tu tarea, puedes crear una nueva abajo</p>
          </div>

          {!selectedTaskId && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-2">¿No encuentras tu tarea?</h4>
                <p className="text-gray-600 text-sm mb-4">Puedes crear una nueva tarea rápidamente con campos mínimos</p>
                <Button variant="outline" onClick={() => setShowTaskCreation(!showTaskCreation)} disabled={isCreatingTask}>
                  <Plus className="w-4 h-4 mr-2" />{showTaskCreation ? 'Cancelar' : 'Crear Nueva Tarea'}
                </Button>
              </div>
            </div>
          )}

          {showTaskCreation && (
            <TaskCreationForm newTaskData={newTaskData} setNewTaskData={setNewTaskData} onCreateTask={handleCreateNewTask} isCreating={isCreatingTask} />
          )}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">📋 Estado inicial: Pendiente de revisión</h4>
        <p className="text-yellow-700 text-sm">Todos los recursos subidos quedarán en "Pendiente de aprobación" hasta ser revisados.</p>
      </div>
    </>
  );

  return (
    <ResourceUploadCore
      title="Subir Recursos al Banco"
      subtitle="Flujo unificado de entregables con control de revisión"
      deliveryMethod={deliveryMethod}
      setDeliveryMethod={setDeliveryMethod}
      uploadedFiles={uploadedFiles}
      onFileUpload={handleFileUpload}
      onRemoveFile={removeFile}
      urlDeliveries={urlDeliveries}
      newUrl={newUrl}
      setNewUrl={setNewUrl}
      urlDescription={urlDescription}
      setUrlDescription={setUrlDescription}
      onAddUrl={addUrlDelivery}
      onRemoveUrl={removeUrl}
      deliveryNotes={deliveryNotes}
      setDeliveryNotes={setDeliveryNotes}
      onSubmit={handleSubmitResource}
      onClose={onClose}
      submitLabel={isSubmitting ? 'Subiendo...' : 'Subir al Banco de Recursos'}
      submitDisabled={isSubmitting || (uploadedFiles.length === 0 && urlDeliveries.length === 0)}
      formatFileSize={formatFileSize}
      getFileIcon={getFileIcon}
    >
      {taskSelectionSection}
    </ResourceUploadCore>
  );
}