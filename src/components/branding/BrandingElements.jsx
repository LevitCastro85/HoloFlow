import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Upload, File, X, Eye, Image, Palette, Zap, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function BrandingElements({ brandingData, handleInputChange, isEditing }) {
  const [uploadingSection, setUploadingSection] = useState(null);

  const handleFileUpload = async (event, section) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploadingSection(section);

    try {
      const currentFiles = brandingData.elementosGraficos?.[`${section}_files`] || [];
      const newFiles = [];

      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "Archivo muy grande",
            description: `${file.name} excede el límite de 10MB`,
            variant: "destructive"
          });
          continue;
        }

        const allowedTypes = [
          'image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml',
          'application/postscript', 'application/illustrator'
        ];

        if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.ai') && !file.name.toLowerCase().endsWith('.eps')) {
          toast({
            title: "Formato no válido",
            description: `${file.name} no es un formato permitido (PNG, JPG, SVG, AI, EPS)`,
            variant: "destructive"
          });
          continue;
        }

        const fileData = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString(),
          url: URL.createObjectURL(file),
          file: file
        };

        newFiles.push(fileData);
      }

      if (newFiles.length > 0) {
        const updatedFiles = [...currentFiles, ...newFiles];
        handleInputChange('elementosGraficos', `${section}_files`, updatedFiles);
        
        toast({
          title: "Archivos subidos",
          description: `${newFiles.length} archivo(s) agregado(s) a ${section}`
        });
      }
    } catch (error) {
      toast({
        title: "Error al subir archivos",
        description: "Hubo un problema al procesar los archivos",
        variant: "destructive"
      });
    } finally {
      setUploadingSection(null);
      event.target.value = '';
    }
  };

  const removeFile = (section, fileId) => {
    if (!isEditing) return;

    const currentFiles = brandingData.elementosGraficos?.[`${section}_files`] || [];
    const updatedFiles = currentFiles.filter(file => file.id !== fileId);
    
    handleInputChange('elementosGraficos', `${section}_files`, updatedFiles);
    
    toast({
      title: "Archivo eliminado",
      description: "El archivo ha sido removido de la sección"
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName, fileType) => {
    const extension = fileName.toLowerCase().split('.').pop();
    
    if (['png', 'jpg', 'jpeg'].includes(extension) || fileType.startsWith('image/')) {
      return <Image className="w-6 h-6 text-blue-500" />;
    } else if (extension === 'svg' || fileType === 'image/svg+xml') {
      return <Palette className="w-6 h-6 text-purple-500" />;
    } else if (extension === 'ai') {
      return <Zap className="w-6 h-6 text-orange-500" />;
    } else if (extension === 'eps') {
      return <Target className="w-6 h-6 text-green-500" />;
    }
    return <FileText className="w-6 h-6 text-gray-500" />;
  };

  const FileUploadSection = ({ section, title, placeholder }) => {
    const files = brandingData.elementosGraficos?.[`${section}_files`] || [];
    const isUploading = uploadingSection === section;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {title}
          </label>
          <textarea
            value={brandingData.elementosGraficos?.[section] || ''}
            onChange={(e) => handleInputChange('elementosGraficos', section, e.target.value)}
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            placeholder={placeholder}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Archivos de {title.toLowerCase()}
          </label>
          
          {isEditing && (
            <div className="mb-3">
              <input
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.svg,.ai,.eps,image/*"
                onChange={(e) => handleFileUpload(e, section)}
                disabled={isUploading}
                className="hidden"
                id={`file-upload-${section}`}
              />
              <label
                htmlFor={`file-upload-${section}`}
                className={`inline-flex items-center px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {isUploading ? 'Subiendo...' : 'Subir archivos (PNG, JPG, SVG, AI, EPS)'}
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Máximo 10MB por archivo. Puedes seleccionar múltiples archivos.
              </p>
            </div>
          )}

          {files.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(file.name, file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {file.url && (
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-colors"
                        title="Ver archivo"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {isEditing && (
                      <button
                        onClick={() => removeFile(section, file.id)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar archivo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
              <File className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay archivos subidos para {title.toLowerCase()}</p>
              {isEditing && (
                <p className="text-xs mt-1">Usa el botón "Subir archivos" para agregar elementos gráficos</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Target className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Elementos Gráficos</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Upload className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Gestión de Archivos Gráficos</h4>
            <div className="text-blue-800 text-sm mt-1 space-y-1">
              <p>• <strong>Formatos soportados:</strong> PNG, JPG, SVG, AI, EPS</p>
              <p>• <strong>Tamaño máximo:</strong> 10MB por archivo</p>
              <p>• <strong>Múltiples archivos:</strong> Puedes subir varios archivos a la vez</p>
              <p>• <strong>Organización:</strong> Cada sección mantiene sus archivos por separado</p>
            </div>
          </div>
        </div>
      </div>

      <FileUploadSection
        section="iconos"
        title="Íconos de la marca"
        placeholder="Describe los íconos utilizados por la marca, su estilo, aplicaciones..."
      />

      <FileUploadSection
        section="patrones"
        title="Patrones gráficos"
        placeholder="Patrones, texturas o elementos gráficos recurrentes, su uso y aplicaciones..."
      />

      <FileUploadSection
        section="ilustraciones"
        title="Ilustraciones"
        placeholder="Estilo de ilustraciones, elementos decorativos, aplicaciones específicas..."
      />
    </motion.div>
  );
}