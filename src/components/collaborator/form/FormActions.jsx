import React from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FormActions({ onClose, isSaving, isEditing }) {
  return (
    <div className="flex space-x-3 pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        className="flex-1"
        disabled={isSaving}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        className="flex-1"
        disabled={isSaving}
      >
        <Save className="w-4 h-4 mr-2" />
        {isSaving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Registrar') + ' Colaborador'}
      </Button>
    </div>
  );
}