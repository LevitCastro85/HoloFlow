import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeliveryMethodSelector from '@/components/delivery/DeliveryMethodSelector';
import FileUploadSection from '@/components/delivery/FileUploadSection';
import UrlUploadSection from '@/components/delivery/UrlUploadSection';

export default function ResourceUploadCore({
  title,
  subtitle,
  deliveryMethod,
  setDeliveryMethod,
  uploadedFiles,
  onFileUpload,
  onRemoveFile,
  urlDeliveries,
  newUrl,
  setNewUrl,
  urlDescription,
  setUrlDescription,
  onAddUrl,
  onRemoveUrl,
  deliveryNotes,
  setDeliveryNotes,
  onSubmit,
  onClose,
  submitLabel = "Subir Recursos",
  submitDisabled = false,
  children,
  formatFileSize,
  getFileIcon
}) {
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
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              {subtitle && <p className="text-gray-600">{subtitle}</p>}
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {children}

          <DeliveryMethodSelector 
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
          />

          {deliveryMethod === 'file' && (
            <FileUploadSection
              uploadedFiles={uploadedFiles}
              onFileUpload={onFileUpload}
              onRemoveFile={onRemoveFile}
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
              onAddUrl={onAddUrl}
              onRemoveUrl={onRemoveUrl}
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
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={submitDisabled}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Check className="w-4 h-4 mr-2" />
            {submitLabel}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}