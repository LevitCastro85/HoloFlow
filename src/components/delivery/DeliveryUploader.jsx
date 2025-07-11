import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { resourcesService, tasksService, storageService } from '@/lib/supabaseHelpers';
import DeliveryMethodSelector from '@/components/delivery/DeliveryMethodSelector';
import FileUploadSection from '@/components/delivery/FileUploadSection';
import UrlUploadSection from '@/components/delivery/UrlUploadSection';
import { useDeliveryUploader } from '@/hooks/useDeliveryUploader';

export default function DeliveryUploader({ task, onDeliverySubmit, onClose }) {
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

  const handleSubmitDelivery = async () => {
    if (uploadedFiles.length === 0 && urlDeliveries.length === 0) {
      toast({
        title: "Sin entregables",
        description: "Debes subir al menos un archivo o agregar una URL",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const existingTask = await tasksService.getById(task.id);
      if (!existingTask) {
        toast({
          title: "Tarea no encontrada",
          description: "La tarea asociada a esta entrega ya no existe. Refresca la página.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      const baseResourceData = {
        task_id: task.id,
        status: 'pendiente-revision',
        brand_id: existingTask.brand_id,
        client_id: existingTask.client_id,
        service_id: existingTask.service_id,
        submitted_by: task.responsable || 'Colaborador',
        delivery_method: deliveryMethod,
        delivery_notes: deliveryNotes,
        category: 'entregable',
        tags: ['entregable', 'freelancer'],
        upload_date: new Date().toISOString()
      };

      let resourcesToCreate = [];

      if (deliveryMethod === 'file') {
        const uploadPromises = uploadedFiles.map(async (fileData) => {
          const fileUrl = await storageService.uploadFile(fileData.file, 'resources');
          if (!fileUrl || !fileUrl.startsWith('http')) {
            throw new Error(`Error al generar URL para ${fileData.name}.`);
          }
          return {
            ...baseResourceData,
            name: fileData.name,
            file_name: fileData.name,
            file_url: fileUrl,
            file_type: getFileType(fileData.name),
            size: fileData.size,
            description: deliveryNotes || `Entregable de tarea: ${existingTask.title}`
          };
        });
        resourcesToCreate = await Promise.all(uploadPromises);
      } else {
        urlDeliveries.forEach(urlDelivery => {
          resourcesToCreate.push({
            ...baseResourceData,
            name: urlDelivery.description || 'Entregable por URL',
            file_name: urlDelivery.description || 'Entregable por URL',
            file_url: urlDelivery.url,
            file_type: 'url',
            size: 0,
            description: urlDelivery.description || `Entregable de tarea: ${existingTask.title}`,
            platform: urlDelivery.platform
          });
        });
      }

      const createdResources = await Promise.all(
        resourcesToCreate.map(resource => resourcesService.create(resource))
      );
      
      await tasksService.update(task.id, { 
        status: 'revision'
      });

      const delivery = {
        taskId: task.id,
        resourcesCreated: createdResources,
      };

      onDeliverySubmit(delivery);
      
      toast({
        title: "¡Entregables enviados!",
        description: `${createdResources.length} recurso(s) enviado(s) para revisión.`
      });

    } catch (error) {
      console.error('Error submitting delivery:', error);
      toast({
        title: "Error al enviar entregables",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Subir Entregables</h2>
              <p className="text-gray-600">{task.title || task.titulo}</p>
            </div>
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">
              ✅ Tarea Terminada - Entregables Habilitados
            </h3>
            <p className="text-green-700 text-sm">
              Los recursos se enviarán automáticamente al Banco de Recursos para revisión y se vincularán a esta tarea.
            </p>
          </div>

          <DeliveryMethodSelector 
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
          />

          {deliveryMethod === 'file' && (
            <FileUploadSection
              uploadedFiles={uploadedFiles}
              onFileUpload={handleFileUpload}
              onRemoveFile={removeFile}
              formatFileSize={formatFileSize}
              getFileIcon={getFileIcon}
            />
          )}

          {deliveryMethod === 'url' && (
            <UrlUploadSection
              newUrl={newUrl}
              setNewUrl={setNewUrl}
              urlDescription={urlDescription}
              setUrlDescription={setUrlDescription}
              urlDeliveries={urlDeliveries}
              onAddUrl={addUrlDelivery}
              onRemoveUrl={removeUrl}
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas de entrega (opcional)
            </label>
            <textarea
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Agrega cualquier información adicional sobre la entrega..."
            />
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmitDelivery}
            disabled={isSubmitting || (uploadedFiles.length === 0 && urlDeliveries.length === 0)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
            {isSubmitting ? 'Enviando...' : 'Enviar al Banco de Recursos'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}