import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { useTaskData } from '@/hooks/useTaskData';
import TaskWithResourceHeader from '@/components/task/TaskWithResourceHeader';
import TaskWithResourceInfo from '@/components/task/TaskWithResourceInfo';
import TaskWithResourceFormFields from '@/components/task/TaskWithResourceFormFields';
import { brandsService, clientsService } from '@/lib/supabaseHelpers';

export default function TaskWithResourceForm({ resource, onSave, onCancel }) {
  const [brands, setBrands] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    service_id: '',
    description: '',
    brief: '',
    request_date: new Date().toISOString().split('T')[0],
    due_date: '',
    assigned_to: '',
    status: 'en-fila',
    priority: 'media',
    price: 0,
    custom_price: false,
    notes: '',
    origen: 'recurso',
    related_resource_id: resource.id,
    recursoInputNombre: resource.name,
    social_network: 'instagram',
    campaign_theme: '',
    header_text: '',
    descriptive_text: '',
    call_to_action: ''
  });

  const {
    collaborators,
    services,
    loadData: loadTaskData,
    getServicePrice
  } = useTaskData(selectedBrand, selectedBrand ? clients.find(c => c.id === selectedBrand.client_id) : null);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const allClients = await clientsService.getAll();
        const allBrands = await brandsService.getAll();
        setClients(allClients || []);
        setBrands(allBrands || []);
        
        const resourceBrand = (allBrands || []).find(brand => brand.id === resource.brand_id);
        if (resourceBrand) {
          setSelectedBrand(resourceBrand);
          setFormData(prev => ({
            ...prev,
            title: `Nueva tarea basada en ${resource.name}`,
            description: `Tarea creada a partir del recurso: ${resource.description || ''}`,
            brief: `Usar como base el recurso "${resource.name}" para crear nuevo contenido relacionado.`
          }));
        }
      } catch (error) {
        toast({ title: "Error", description: "No se pudieron cargar marcas y clientes.", variant: "destructive" });
      }
    }
    fetchInitialData();
  }, [resource]);

  useEffect(() => {
    if (selectedBrand) {
      loadTaskData();
    }
  }, [selectedBrand, loadTaskData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: newValue };
      if (name === 'service_id' && !prev.custom_price) {
        newData.price = getServicePrice(value);
      }
      return newData;
    });
  };

  const handleBrandChange = (e) => {
    const brandId = parseInt(e.target.value);
    const brand = brands.find(b => b.id === brandId);
    setSelectedBrand(brand);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBrand) {
      toast({ title: "Error", description: "Debes seleccionar una marca", variant: "destructive" });
      return;
    }
    if (!formData.title.trim() || !formData.service_id || !formData.due_date) {
      toast({ title: "Error en el formulario", description: "Completa los campos obligatorios", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const taskData = {
        ...formData,
        brand_id: selectedBrand.id,
        assigned_to: formData.assigned_to || null,
        related_resource_id: resource.id,
      };

      await onSave(taskData);
    } catch (error) {
      toast({ title: "Error", description: "No se pudo guardar la tarea.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <TaskWithResourceHeader onCancel={onCancel} />
      <TaskWithResourceInfo resource={resource} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <TaskWithResourceFormFields
          formData={formData}
          brands={brands}
          clients={clients}
          selectedBrand={selectedBrand}
          collaborators={collaborators}
          services={services}
          onInputChange={handleInputChange}
          onBrandChange={handleBrandChange}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      </motion.div>
    </div>
  );
}