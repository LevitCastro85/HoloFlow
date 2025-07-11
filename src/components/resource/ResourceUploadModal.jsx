import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Save, Loader2 } from 'lucide-react';
import useResourceUploadForm from '@/hooks/useResourceUploadForm';
import UploadMethodSelector from '@/components/resource/upload/UploadMethodSelector';
import FileUploadDetails from '@/components/resource/upload/FileUploadDetails';
import UrlUploadDetails from '@/components/resource/upload/UrlUploadDetails';
import ResourceMetadataForm from '@/components/resource/upload/ResourceMetadataForm';
import { Button } from '@/components/ui/button';

export default function ResourceUploadModal({ isOpen, onClose, onSave }) {
  const {
    deliveryMethod,
    setDeliveryMethod,
    files,
    handleFileChange,
    urlData,
    handleUrlChange,
    formData,
    handleFormChange,
    availableTasks,
    availableServices,
    availableClients,
    handleSubmit,
    isUploading,
  } = useResourceUploadForm(isOpen, onSave, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <span>Subir Recursos al Banco</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              📋 Flujo Unificado de Entregables
            </h3>
            <p className="text-blue-700 text-sm">
              Este modal utiliza la misma lógica que los entregables de tareas, 
              permitiendo trazabilidad completa y control de revisión.
            </p>
          </div>

          <UploadMethodSelector
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
          />

          {deliveryMethod === 'file' && (
            <FileUploadDetails
              files={files}
              onFileChange={handleFileChange}
            />
          )}

          {deliveryMethod === 'url' && (
            <UrlUploadDetails
              urlData={urlData}
              onUrlChange={handleUrlChange}
            />
          )}

          <ResourceMetadataForm
            formData={formData}
            onFormChange={handleFormChange}
            availableTasks={availableTasks}
            availableServices={availableServices}
            availableClients={availableClients}
          />

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">📋 Estado inicial: Pendiente de revisión</h4>
            <p className="text-yellow-700 text-sm">
              Todos los recursos subidos quedarán en estado "Pendiente de aprobación" 
              hasta que sean revisados y aprobados por un supervisor.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Subir Recursos
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}