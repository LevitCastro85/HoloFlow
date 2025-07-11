import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Link as LinkIcon, FileText, Image, Video, Music, Archive, ExternalLink } from 'lucide-react';
import { fileTypeIcons } from '@/lib/resourceConstants';
import { useToast } from '@/components/ui/use-toast';

export default function ResourcePreviewModal({ isOpen, onClose, resource }) {
  const { toast } = useToast();

  if (!isOpen || !resource) return null;

  const FileIcon = fileTypeIcons[resource.tipo] || FileText;
  const isImage = resource.tipo === 'image' && resource.url;
  const isVideo = resource.tipo === 'video' && resource.url;
  const isUrl = resource.tipo === 'url';

  const handleDownload = () => {
    if (!resource.url || !resource.url.startsWith('http')) {
      toast({
        title: "URL no válida",
        description: "Este recurso no tiene un archivo descargable.",
        variant: "destructive",
      });
      return;
    }

    if (isUrl) {
      window.open(resource.url, '_blank');
      return;
    }

    fetch(resource.url, { mode: 'cors' })
      .then(response => {
        if (!response.ok) throw new Error('La respuesta de la red no fue correcta.');
        return response.blob();
      })
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = resource.nombre || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      })
      .catch(err => {
        console.error("Error de descarga:", err);
        toast({
          title: "Error de descarga",
          description: "No se pudo descargar el archivo. Intentando abrir en una nueva pestaña.",
          variant: "destructive",
        });
        window.open(resource.url, '_blank');
      });
  };

  const getPreviewContent = () => {
    if (isImage) {
      return (
        <div className="flex justify-center bg-gray-100 rounded-lg p-4">
          <img 
            src={resource.url}
            alt={`Vista previa de ${resource.nombre}`}
            className="max-h-96 max-w-full rounded-md object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden flex-col items-center justify-center text-gray-500">
            <Image className="w-12 h-12 mb-2" />
            <p>No se pudo cargar la imagen</p>
          </div>
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="flex justify-center bg-gray-100 rounded-lg p-4">
          <video 
            controls 
            className="max-h-96 max-w-full rounded-md"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          >
            <source src={resource.url} />
            Tu navegador no soporta el elemento de video.
          </video>
          <div className="hidden flex-col items-center justify-center text-gray-500">
            <Video className="w-12 h-12 mb-2" />
            <p>No se pudo cargar el video</p>
          </div>
        </div>
      );
    }

    if (isUrl) {
      return (
        <div className="bg-indigo-50 rounded-lg p-6 text-center">
          <LinkIcon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h4 className="font-medium text-indigo-900 mb-2">Recurso de tipo enlace</h4>
          <p className="text-indigo-700 mb-4">{resource.platform || 'Enlace externo'}</p>
          <div className="bg-white rounded border p-3 text-left">
            <p className="text-sm text-gray-600 break-all">{resource.url}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <FileIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h4 className="font-medium text-gray-700 mb-2">Vista previa no disponible</h4>
        <p className="text-gray-500 text-sm">
          Este tipo de archivo ({resource.tipo}) no admite vista previa en el navegador.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Usa el botón de descarga para acceder al archivo completo.
        </p>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileIcon className="w-5 h-5 text-blue-600" />
            <span>{resource.nombre}</span>
          </DialogTitle>
          <DialogDescription>
            {resource.descripcion}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {getPreviewContent()}

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Marca:</span>
                <span className="text-gray-600">{resource.marca || 'Sin asignar'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Tipo:</span>
                <span className="text-gray-600 capitalize">{resource.tipo}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Tamaño:</span>
                <span className="text-gray-600">{resource.tamaño || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Categoría:</span>
                <span className="text-gray-600">{resource.categoria || 'General'}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Subido por:</span>
                <span className="text-gray-600">{resource.submittedBy || 'Sistema'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Fecha:</span>
                <span className="text-gray-600">
                  {new Date(resource.fechaSubida).toLocaleDateString('es-ES')}
                </span>
              </div>
              {resource.taskTitle && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Tarea:</span>
                  <span className="text-gray-600">{resource.taskTitle}</span>
                </div>
              )}
              {resource.reviewed_by && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Revisado por:</span>
                  <span className="text-gray-600">{resource.reviewed_by}</span>
                </div>
              )}
            </div>
          </div>

          {resource.tags && resource.tags.length > 0 && (
            <div>
              <span className="font-medium text-gray-700 text-sm">Etiquetas:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {resource.tags.map(tag => (
                  <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {resource.review_notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Observaciones de revisión:</h4>
              <p className="text-yellow-700 text-sm">{resource.review_notes}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={handleDownload}>
            {isUrl ? (
              <>
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Enlace
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}