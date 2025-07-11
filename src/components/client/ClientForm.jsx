import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ClientFormBasic from '@/components/client/ClientFormBasic';
import ClientFormAdmin from '@/components/client/ClientFormAdmin';

export default function ClientForm({ editingClient, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    region: '',
    onboarding_date: new Date().toISOString().split('T')[0],
    internal_notes: '',
    client_type: 'empresa',
    requires_invoice: true,
    tax_id: '',
    payment_method: 'transferencia',
    status: 'activo'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingClient) {
      setFormData({
        ...formData,
        ...editingClient
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        region: '',
        onboarding_date: new Date().toISOString().split('T')[0],
        internal_notes: '',
        client_type: 'empresa',
        requires_invoice: true,
        tax_id: '',
        payment_method: 'transferencia',
        status: 'activo'
      });
    }
    setErrors({});
  }, [editingClient]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    }

    if (formData.requires_invoice && !formData.tax_id.trim()) {
      newErrors.tax_id = 'El RFC/NIF es obligatorio para facturación';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Error en el formulario",
        description: "Por favor corrige los errores antes de continuar",
        variant: "destructive"
      });
      return;
    }

    const clientData = {
      ...formData,
      id: editingClient?.id || undefined
    };

    onSave(clientData);
    
    toast({
      title: editingClient ? "Cliente actualizado" : "Cliente creado",
      description: editingClient 
        ? "Los cambios han sido guardados correctamente" 
        : "El nuevo cliente ha sido registrado en el sistema"
    });
  };

  return (
    <div className="space-y-6">
      <ClientFormBasic 
        formData={formData}
        errors={errors}
        onInputChange={handleInputChange}
      />

      <ClientFormAdmin 
        formData={formData}
        errors={errors}
        onInputChange={handleInputChange}
      />

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1"
        >
          <Save className="w-4 h-4 mr-2" />
          {editingClient ? 'Actualizar' : 'Crear'} Cliente
        </Button>
      </div>
    </div>
  );
}