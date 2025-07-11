import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Link, 
  File, 
  Check, 
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function ResourceUploadSimplified({ 
  task,
  onResourceSubmit, 
  onClose
}) {
  const [deliveryMethod, setDeliveryMethod] = useState('file');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [urlDeliveries, setUrlDeliveries] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [urlDescription, setUrlDescription] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      uploadedAt: new Date().toISOString()
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    toast({
      title: "Archivos agregados",
      description: `${files.length} archivo(s) agregado(s) correctamente`
    });
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const addUrlDelivery = () => {
    if (!newUrl.trim()) {
      toast({
        title: "URL requerida",
        description: "Por favor ingresa una URL válida",
        variant: "destructive"
      });
      return;
    }

    try {
      new URL(newUrl);
    } catch {
      toast({
        title: "URL inválida",
        description: "Por favor ingresa una URL válida",
        variant: "destructive"
      });
      return;
    }

    const urlDelivery = {
      id: Date.now() + Math.random(),
      url: newUrl,
      description: urlDescription || 'Entregable',
      addedAt: new Date().toISOString(),
      platform: detectPlatform(newUrl)
    };

    setUrlDeliveries(prev => [...prev, urlDelivery]);
    setNewUrl('');
    setUrlDescription('');
    
    toast({
      title: "URL agregada",
      description: "La URL de descarga ha sido agregada correctamente"
    });
  };

  const removeUrl = (urlId) => {
    setUrlDeliveries(prev => prev.filter(url => url.id !== urlId));
  };

  const detectPlatform = (url) => {
    if (url.includes('drive.google.com')) return 'Google Drive';
    if (url.includes('dropbox.com')) return 'Dropbox';
    if (url.includes('wetransfer.com')) return 'WeTransfer';
    if (url.includes('onedrive.live.com')) return 'OneDrive';
    if (url.includes('mega.nz')) return 'MEGA';
    return 'Enlace personalizado';
  };

  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'ai', 'psd'].includes(extension)) return 'image';
    if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) return 'video';
    if (['mp3', 'wav', 'aac', 'flac'].includes(extension)) return 'audio';
    if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) return 'document';
    return 'archive';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmitResource = () => {
    if (uploadedFiles.length === 0 && urlDeliveries.length === 0) {
      toast({
        title: "Sin recursos",
        description: "Debes subir al menos un archivo o agregar una URL",
        variant: "destructive"
      });
      return;
    }

    const resourceData = {
      taskId: task.id,
      taskTitle: task.titulo,
      marca: task.marcaNombre || task.cliente,
      clientName: task.clienteNombre || task.cliente,
      files: uploadedFiles,
      urls: urlDeliveries,
      notes: deliveryNotes,
      submittedAt: new Date().toISOString(),
      submittedBy: task.responsable,
      status: 'pending-approval',
      deliveryMethod: deliveryMethod
    };

    onResourceSubmit(resourceData);
    
    toast({
      title: "¡Recursos enviados!",
      description: "Los entregables han sido enviados al Banco de Recursos para revisión"
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Subir Entregables</h2>
              <p className="text-gray-600">Tarea: {task.titulo}</p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">
              ✅ Entregables de Tarea Terminada
            </h3>
            <p className="text-green-700 text-sm">
              Los recursos se vincularán automáticamente a esta tarea y se enviarán 
              al Control de Revisión con estado "Pendiente de aprobación".
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Método de entrega</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDeliveryMethod('file')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  deliveryMethod === 'file' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Upload className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-medium text-gray-900">Subir Archivos</h4>
                <p className="text-sm text-gray-600">Sube archivos directamente</p>
              </button>

              <button
                onClick={() => setDeliveryMethod('url')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  deliveryMethod === 'url' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Link className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-medium text-gray-900">URL de Descarga</h4>
                <p className="text-sm text-gray-600">Enlaces de Drive, Dropbox, etc.</p>
              </button>
            </div>
          </div>

          {deliveryMethod === 'file' && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Subir Archivos</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-3">Arrastra archivos aquí o haz clic para seleccionar</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept="*/*"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  Seleccionar Archivos
                </Button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-3">Archivos seleccionados</h5>
                  <div className="space-y-2">
                    {uploadedFiles.map(file => (
                      <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <File className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {deliveryMethod === 'url' && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Agregar URL de Descarga</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de descarga *
                  </label>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (opcional)
                  </label>
                  <input
                    type="text"
                    value={urlDescription}
                    onChange={(e) => setUrlDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Diseño final, Video editado, etc."
                  />
                </div>

                <Button onClick={addUrlDelivery} className="w-full">
                  <Link className="w-4 h-4 mr-2" />
                  Agregar URL
                </Button>
              </div>

              {urlDeliveries.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-3">URLs agregadas</h5>
                  <div className="space-y-2">
                    {urlDeliveries.map(urlDelivery => (
                      <div key={urlDelivery.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Link className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-gray-900">{urlDelivery.description}</p>
                            <p className="text-sm text-gray-500">{urlDelivery.platform}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUrl(urlDelivery.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
            onClick={handleSubmitResource}
            disabled={uploadedFiles.length === 0 && urlDeliveries.length === 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Enviar al Banco de Recursos
          </Button>
        </div>
      </motion.div>
    </div>
  );
}