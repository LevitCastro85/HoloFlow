import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, X, Eye, Download, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function BrandingPhotoLibrary({ brandingData, handleInputChange, isEditing }) {
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const currentPhotos = brandingData.bibliotecaFotografica?.photos || [];
      const newPhotos = [];

      for (const file of files) {
        if (file.size > 15 * 1024 * 1024) {
          toast({
            title: "Archivo muy grande",
            description: `${file.name} excede el límite de 15MB`,
            variant: "destructive"
          });
          continue;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          toast({
            title: "Formato no válido",
            description: `${file.name} no es un formato permitido (JPG, PNG, WEBP)`,
            variant: "destructive"
          });
          continue;
        }

        const photoData = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString(),
          url: URL.createObjectURL(file),
          file: file,
          category: getPhotoCategory(file.name)
        };

        newPhotos.push(photoData);
      }

      if (newPhotos.length > 0) {
        const updatedPhotos = [...currentPhotos, ...newPhotos];
        handleInputChange('bibliotecaFotografica', 'photos', updatedPhotos);
        
        toast({
          title: "Fotografías subidas",
          description: `${newPhotos.length} fotografía(s) agregada(s) a la biblioteca`
        });
      }
    } catch (error) {
      toast({
        title: "Error al subir fotografías",
        description: "Hubo un problema al procesar las fotografías",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const getPhotoCategory = (fileName) => {
    const name = fileName.toLowerCase();
    if (name.includes('producto') || name.includes('product')) return 'producto';
    if (name.includes('institucional') || name.includes('corporate')) return 'institucional';
    if (name.includes('lifestyle') || name.includes('estilo')) return 'estilo-vida';
    return 'general';
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'producto': return 'Producto';
      case 'institucional': return 'Institucional';
      case 'estilo-vida': return 'Estilo de vida';
      default: return 'General';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'producto': return 'bg-blue-100 text-blue-800';
      case 'institucional': return 'bg-purple-100 text-purple-800';
      case 'estilo-vida': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const removePhoto = (photoId) => {
    if (!isEditing) return;

    const currentPhotos = brandingData.bibliotecaFotografica?.photos || [];
    const updatedPhotos = currentPhotos.filter(photo => photo.id !== photoId);
    
    handleInputChange('bibliotecaFotografica', 'photos', updatedPhotos);
    
    toast({
      title: "Fotografía eliminada",
      description: "La fotografía ha sido removida de la biblioteca"
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const photos = brandingData.bibliotecaFotografica?.photos || [];
  const photosByCategory = photos.reduce((acc, photo) => {
    const category = photo.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(photo);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Camera className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Biblioteca Fotográfica</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Camera className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Gestión de Fotografías de Marca</h4>
            <div className="text-blue-800 text-sm mt-1 space-y-1">
              <p>• <strong>Formatos soportados:</strong> JPG, PNG, WEBP</p>
              <p>• <strong>Tamaño máximo:</strong> 15MB por fotografía</p>
              <p>• <strong>Categorías automáticas:</strong> Producto, Institucional, Estilo de vida</p>
              <p>• <strong>Uso recomendado:</strong> Fotografías institucionales, de producto o lifestyle relacionadas con la marca</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas sobre el uso y estilo fotográfico
        </label>
        <textarea
          value={brandingData.bibliotecaFotografica?.notes || ''}
          onChange={(e) => handleInputChange('bibliotecaFotografica', 'notes', e.target.value)}
          disabled={!isEditing}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          placeholder="Describe el estilo fotográfico de la marca, paleta de colores preferida, tipos de composición, ambientación..."
        />
      </div>

      {isEditing && (
        <div>
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,image/*"
            onChange={handlePhotoUpload}
            disabled={uploading}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className={`inline-flex items-center px-6 py-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="w-5 h-5 mr-3 text-gray-500" />
            <div className="text-left">
              <span className="text-sm font-medium text-gray-700">
                {uploading ? 'Subiendo fotografías...' : 'Subir fotografías'}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG, WEBP hasta 15MB. Selecciona múltiples archivos.
              </p>
            </div>
          </label>
        </div>
      )}

      {photos.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(photosByCategory).map(([category, categoryPhotos]) => (
            <div key={category}>
              <div className="flex items-center space-x-2 mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                  {getCategoryLabel(category)}
                </span>
                <span className="text-sm text-gray-500">
                  {categoryPhotos.length} fotografía{categoryPhotos.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categoryPhotos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                          <button
                            onClick={() => window.open(photo.url, '_blank')}
                            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                            title="Ver fotografía"
                          >
                            <Eye className="w-4 h-4 text-gray-700" />
                          </button>
                          {isEditing && (
                            <button
                              onClick={() => removePhoto(photo.id)}
                              className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                              title="Eliminar fotografía"
                            >
                              <X className="w-4 h-4 text-red-600" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-900 truncate" title={photo.name}>
                        {photo.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatFileSize(photo.size)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay fotografías en la biblioteca</h3>
          <p className="text-gray-600 mb-4">
            {isEditing 
              ? 'Sube las primeras fotografías para crear la biblioteca de la marca' 
              : 'Esta marca no tiene fotografías registradas en su biblioteca'
            }
          </p>
          {isEditing && (
            <p className="text-sm text-gray-500">
              Usa el botón "Subir fotografías" para agregar imágenes institucionales, de producto o de estilo de vida
            </p>
          )}
        </div>
      )}

      {photos.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Resumen de la biblioteca</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total de fotografías:</span>
              <span className="font-medium ml-2">{photos.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Producto:</span>
              <span className="font-medium ml-2">{photosByCategory.producto?.length || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Institucional:</span>
              <span className="font-medium ml-2">{photosByCategory.institucional?.length || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Estilo de vida:</span>
              <span className="font-medium ml-2">{photosByCategory['estilo-vida']?.length || 0}</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}