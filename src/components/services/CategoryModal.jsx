import React from 'react';
import { Save, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function CategoryModal({ 
  show, 
  onClose, 
  editingCategory, 
  setEditingCategory, 
  onSave, 
  categories = []
}) {
  if (!editingCategory) return null;

  const isEditing = editingCategory.name && categories && categories.find(cat => cat.id === editingCategory.id);

  const handleSave = () => {
    if (!editingCategory.name || !editingCategory.description) {
      return;
    }
    onSave();
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FolderPlus className="w-5 h-5 text-blue-600" />
            <span>{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              value={editingCategory.name || ''}
              onChange={(e) => setEditingCategory(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Diseño Gráfico"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              value={editingCategory.description || ''}
              onChange={(e) => setEditingCategory(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe el tipo de servicios que incluye esta categoría..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orden de visualización
            </label>
            <input
              type="number"
              min="1"
              value={editingCategory.display_order || (categories ? categories.length + 1 : 1)}
              onChange={(e) => setEditingCategory(prev => ({ ...prev, display_order: parseInt(e.target.value) || 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Las categorías se ordenarán según este número (menor = primero)
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={!editingCategory.name || !editingCategory.description}
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Actualizar' : 'Crear'} Categoría
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}