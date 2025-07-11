import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BrandingColors({ brandingData, handleInputChange, addColor, removeColor, isEditing }) {
  const [newColorValue, setNewColorValue] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleAddColor = () => {
    if (!isEditing) return;
    
    if (showColorPicker) {
      const currentColors = brandingData.paletaColores.adicionales || [];
      const updatedColors = [...currentColors, newColorValue];
      
      handleInputChange('paletaColores', 'adicionales', updatedColors);
      setNewColorValue('#000000');
      setShowColorPicker(false);
    } else {
      setShowColorPicker(true);
    }
  };

  const handleCancelAdd = () => {
    setShowColorPicker(false);
    setNewColorValue('#000000');
  };

  const handleRemoveColor = (index) => {
    if (!isEditing) return;
    
    const currentColors = brandingData.paletaColores.adicionales || [];
    const updatedColors = currentColors.filter((_, i) => i !== index);
    handleInputChange('paletaColores', 'adicionales', updatedColors);
  };

  const handleColorChange = (index, newColor) => {
    if (!isEditing) return;
    
    const currentColors = brandingData.paletaColores.adicionales || [];
    const updatedColors = [...currentColors];
    updatedColors[index] = newColor;
    handleInputChange('paletaColores', 'adicionales', updatedColors);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Palette className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Paleta de Colores</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color Primario
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={brandingData.paletaColores.primario}
              onChange={(e) => handleInputChange('paletaColores', 'primario', e.target.value)}
              disabled={!isEditing}
              className="w-12 h-12 rounded border border-gray-300 disabled:opacity-50 cursor-pointer"
            />
            <input
              type="text"
              value={brandingData.paletaColores.primario}
              onChange={(e) => handleInputChange('paletaColores', 'primario', e.target.value)}
              disabled={!isEditing}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color Secundario
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={brandingData.paletaColores.secundario}
              onChange={(e) => handleInputChange('paletaColores', 'secundario', e.target.value)}
              disabled={!isEditing}
              className="w-12 h-12 rounded border border-gray-300 disabled:opacity-50 cursor-pointer"
            />
            <input
              type="text"
              value={brandingData.paletaColores.secundario}
              onChange={(e) => handleInputChange('paletaColores', 'secundario', e.target.value)}
              disabled={!isEditing}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color de Acento
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={brandingData.paletaColores.acento}
              onChange={(e) => handleInputChange('paletaColores', 'acento', e.target.value)}
              disabled={!isEditing}
              className="w-12 h-12 rounded border border-gray-300 disabled:opacity-50 cursor-pointer"
            />
            <input
              type="text"
              value={brandingData.paletaColores.acento}
              onChange={(e) => handleInputChange('paletaColores', 'acento', e.target.value)}
              disabled={!isEditing}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Colores Adicionales
          </label>
          {isEditing && !showColorPicker && (
            <Button size="sm" onClick={handleAddColor}>
              <Plus className="w-3 h-3 mr-1" />
              Agregar Color
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {showColorPicker && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <input
                type="color"
                value={newColorValue}
                onChange={(e) => setNewColorValue(e.target.value)}
                className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={newColorValue}
                onChange={(e) => setNewColorValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Código de color (ej: #FF5733)"
              />
              <Button size="sm" onClick={handleAddColor}>
                <Plus className="w-3 h-3 mr-1" />
                Añadir
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelAdd}>
                <X className="w-3 h-3" />
              </Button>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(brandingData.paletaColores.adicionales || []).map((color, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  disabled={!isEditing}
                  className="w-10 h-10 rounded border border-gray-300 disabled:opacity-50 cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 text-sm"
                />
                {isEditing && (
                  <button
                    onClick={() => handleRemoveColor(index)}
                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar color"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {(!brandingData.paletaColores.adicionales || brandingData.paletaColores.adicionales.length === 0) && !showColorPicker && (
            <div className="text-center py-8 text-gray-500">
              <Palette className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay colores adicionales configurados</p>
              {isEditing && (
                <p className="text-xs mt-1">Haz clic en "Agregar Color" para añadir colores a la paleta</p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}