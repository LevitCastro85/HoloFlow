import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import BrandFormBasic from '@/components/brand/BrandFormBasic';
import BrandFormSocial from '@/components/brand/BrandFormSocial';

export default function BrandForm({ editingBrand, clients = [], onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    industry: '',
    website_url: '',
    manages_socials: false,
    social_media_links: {
      facebook: '',
      instagram: '',
      tiktok: '',
      youtube: '',
      linkedin: ''
    },
    internal_notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingBrand) {
      setFormData({
        name: editingBrand.name || '',
        client_id: editingBrand.client_id || '',
        industry: editingBrand.industry || '',
        website_url: editingBrand.website_url || '',
        manages_socials: editingBrand.manages_socials || false,
        social_media_links: editingBrand.social_media_links || formData.social_media_links,
        internal_notes: editingBrand.internal_notes || ''
      });
    } else {
      setFormData({
        name: '',
        client_id: '',
        industry: '',
        website_url: '',
        manages_socials: false,
        social_media_links: {
          facebook: '',
          instagram: '',
          tiktok: '',
          youtube: '',
          linkedin: ''
        },
        internal_notes: ''
      });
    }
    setErrors({});
  }, [editingBrand]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la marca es obligatorio';
    }

    if (!formData.client_id) {
      newErrors.client_id = 'Debe seleccionar un cliente';
    }

    if (!formData.industry) {
      newErrors.industry = 'La industria es obligatoria';
    }

    if (formData.website_url && !isValidUrl(formData.website_url)) {
      newErrors.website_url = 'URL del sitio web inválida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
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

  const handleSocialChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      social_media_links: {
        ...prev.social_media_links,
        [platform]: value
      }
    }));
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

    const dataToSave = { ...formData };
    if (editingBrand?.id) {
      dataToSave.id = editingBrand.id;
    }

    onSave(dataToSave);
  };

  return (
    <div className="space-y-6">
      <BrandFormBasic 
        formData={formData}
        errors={errors}
        clients={clients}
        onInputChange={handleInputChange}
      />

      <BrandFormSocial 
        formData={formData}
        errors={errors}
        onInputChange={handleInputChange}
        onSocialChange={handleSocialChange}
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
          {editingBrand ? 'Actualizar' : 'Crear'} Marca
        </Button>
      </div>
    </div>
  );
}