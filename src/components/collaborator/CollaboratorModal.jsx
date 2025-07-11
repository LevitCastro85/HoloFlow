import React, { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import CollaboratorTypeSelector from '@/components/collaborator/form/CollaboratorTypeSelector';
import CollaboratorFormFields from '@/components/collaborator/form/CollaboratorFormFields';
import InternalCollaboratorFields from '@/components/collaborator/form/InternalCollaboratorFields';
import FreelancerFields from '@/components/collaborator/form/FreelancerFields';
import FormActions from '@/components/collaborator/form/FormActions';
import { ROLES } from '@/lib/permissions';

const getInitialFormData = (collaborator) => ({
  name: collaborator?.name || '',
  email: collaborator?.email || '',
  phone: collaborator?.phone || '',
  specialties: collaborator?.specialties || [],
  city: collaborator?.city || '',
  state: collaborator?.state || '',
  profile_photo_url: collaborator?.profile_photo_url || '',
  collaborator_type: collaborator?.collaborator_type || 'freelancer',
  availability: collaborator?.availability || 'disponible',
  base_activity_rate: collaborator?.base_activity_rate || 0,
  weekly_salary: collaborator?.weekly_salary || 0,
  rating: collaborator?.rating || 5.0,
  notes: collaborator?.notes || '',
  is_active: collaborator?.is_active ?? true,
  role: collaborator?.role || ROLES.FREELANCE,
});

export default function CollaboratorModal({ show, onClose, collaborator, onSave }) {
  const [formData, setFormData] = useState(getInitialFormData(null));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (show) {
      setFormData(getInitialFormData(collaborator));
      setErrors({});
    }
  }, [collaborator, show]);

  const validateField = (name, value, currentFormData) => {
    switch (name) {
      case 'name': return !value.trim() ? 'El nombre completo es obligatorio' : '';
      case 'email':
        if (!value.trim()) return 'El correo electrónico es obligatorio';
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Formato de correo electrónico inválido' : '';
      case 'weekly_salary': return currentFormData.collaborator_type === 'interno' && Number(value) <= 0 ? 'El salario semanal debe ser mayor a 0' : '';
      case 'base_activity_rate': return currentFormData.collaborator_type === 'freelancer' && Number(value) <= 0 ? 'La tarifa base por actividad debe ser mayor a 0' : '';
      default: return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value, formData);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    const fields = ['name', 'email', 'weekly_salary', 'base_activity_rate'];
    fields.forEach(field => {
      const value = formData[field];
      const error = validateField(field, value, formData);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Campos incompletos o inválidos",
        description: "Por favor, revisa los campos marcados para continuar.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
       toast({
        title: "Error al guardar",
        description: error.message || "No se pudo guardar la información.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>{collaborator ? 'Editar Colaborador' : 'Nuevo Colaborador'}</span>
          </DialogTitle>
        </DialogHeader>
        
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 p-1">
          <CollaboratorTypeSelector collaboratorType={formData.collaborator_type} onInputChange={handleInputChange} />
          <CollaboratorFormFields formData={formData} errors={errors} onInputChange={handleInputChange} onBlur={handleBlur} />

          {formData.collaborator_type === 'interno' ? (
            <InternalCollaboratorFields formData={formData} errors={errors} onInputChange={handleInputChange} onBlur={handleBlur} />
          ) : (
            <FreelancerFields formData={formData} errors={errors} onInputChange={handleInputChange} onBlur={handleBlur} />
          )}

          <FormActions onClose={onClose} isSaving={saving} isEditing={!!collaborator} />
        </form>
      </DialogContent>
    </Dialog>
  );
}