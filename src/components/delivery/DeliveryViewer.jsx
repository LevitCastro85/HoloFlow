import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  ExternalLink, 
  FileText, 
  Image, 
  Video, 
  Archive,
  Clock,
  User,
  MessageSquare,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function DeliveryViewer({ task, onClose, onApprove, onReject }) {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    loadDeliveries();
  }, [task.id]);

  const loadDeliveries = () => {
    const savedDeliveries = localStorage.getItem('taskDeliveries');
    if (savedDeliveries) {
      const allDeliveries = JSON.parse(savedDeliveries);
      const taskDeliveries = allDeliveries.filter(d => d.taskId === task.id);
      setDeliveries(taskDeliveries);
      if (taskDeliveries.length > 0) {
        setSelectedDelivery(taskDeliveries[taskDeliveries.length - 1]); // Mostrar la más reciente
      }
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return Image;
    if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) return Video;
    if (['zip', 'rar', '7z'].includes(extension)) return Archive;
    return FileText;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownloadFile = (file) => {
    // Simular descarga
    toast({
      title: "Descarga iniciada",
      description: `Descargando ${file.name}...`
    });
  };

  const handleOpenUrl = (url) => {
    window.open(url, '_blank');
  };

  const handleApproveDelivery = () => {
    if (selectedDelivery) {
      onApprove(selectedDelivery);
      toast({
        title: "Entrega aprobada",
        description: "La entrega ha sido marcada como aprobada"
      });
    }
  };

  const handleRejectDelivery = () => {
    if (selectedDelivery) {
      onReject(selectedDelivery);
      toast({
        title: "Entrega rechazada",
        description: "Se ha solicitado una nueva versión"
      });
    }
  };

  if (deliveries.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
        >
          <div className="p-6 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sin entregables</h3>
            <p className="text-gray-600 mb-6">Esta tarea aún no tiene entregables subidos.</p>
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </motion.div>
      </div>
    );
  }

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
              <h2 className="text-2xl font-bold text-gray-900">Entregables</h2>
              <p className="text-gray-600">{task.titulo}</p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {selectedDelivery && (
          <div className="p-6 space-y-6">
            {/* Información de la entrega */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Información de entrega</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedDelivery.status === 'approved' ? 'bg-green-100 text-green-800' :
                  selectedDelivery.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedDelivery.status === 'approved' ? 'Aprobado' :
                   selectedDelivery.status === 'rejected' ? 'Rechazado' :
                   'En revisión'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  Entregado por: {selectedDelivery.submittedBy}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {new Date(selectedDelivery.submittedAt).toLocaleString('es-ES')}
                </div>
              </div>
              {selectedDelivery.notes && (
                <div className="mt-3 p-3 bg-white rounded border">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Notas del freelancer:</p>
                      <p className="text-sm text-gray-600">{selectedDelivery.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Archivos subidos */}
            {selectedDelivery.files && selectedDelivery.files.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Archivos subidos</h4>
                <div className="grid gap-3">
                  {selectedDelivery.files.map(file => {
                    const FileIcon = getFileIcon(file.name);
                    return (
                      <div key={file.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileIcon className="w-6 h-6 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadFile(file)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* URLs de descarga */}
            {selectedDelivery.urls && selectedDelivery.urls.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Enlaces de descarga</h4>
                <div className="grid gap-3">
                  {selectedDelivery.urls.map(urlDelivery => (
                    <div key={urlDelivery.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ExternalLink className="w-6 h-6 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900">{urlDelivery.description}</p>
                          <p className="text-sm text-gray-500">{urlDelivery.platform}</p>
                          <p className="text-xs text-gray-400 break-all">
                            {urlDelivery.url.length > 60 ? urlDelivery.url.substring(0, 60) + '...' : urlDelivery.url}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenUrl(urlDelivery.url)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Abrir
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Historial de entregas */}
            {deliveries.length > 1 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Historial de entregas</h4>
                <div className="space-y-2">
                  {deliveries.map((delivery, index) => (
                    <button
                      key={delivery.id}
                      onClick={() => setSelectedDelivery(delivery)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedDelivery.id === delivery.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          Entrega #{deliveries.length - index}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(delivery.submittedAt).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {delivery.files?.length || 0} archivo(s) • {delivery.urls?.length || 0} URL(s)
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Acciones */}
        {selectedDelivery && selectedDelivery.status === 'submitted' && (
          <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={handleRejectDelivery}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-2" />
              Rechazar
            </Button>
            <Button onClick={handleApproveDelivery}>
              <Check className="w-4 h-4 mr-2" />
              Aprobar
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}