import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import TaskHeader from '@/components/task/TaskHeader';
import { useTaskData } from '@/hooks/useTaskData';
import FieldProductionDetails from './field-production/FieldProductionDetails';
import FieldProductionType from './field-production/FieldProductionType';
import FieldProductionRequirements from './field-production/FieldProductionRequirements';
import FieldProductionLogistics from './field-production/FieldProductionLogistics';

export default function FieldProductionForm({ brand, client, onSave, onCancel }) {
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
    notes: '',
    origen: 'produccion-campo',
    location: '',
    exact_address: '',
    session_date: '',
    session_time: '',
    production_type: '',
    production_objective: '',
    technical_requirements: [],
    equipment_needed: [],
    involved_personnel: '',
    reference_material: ''
  });

  const {
    collaborators,
    services,
    taskLimitInfo,
    loadData,
    checkTaskLimits
  } = useTaskData(brand, client);

  useEffect(() => {
    loadData();
    checkTaskLimits();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.service_id || !formData.due_date || !formData.production_type) {
      toast({
        title: "Error en el formulario",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const taskData = {
      ...formData,
      brand_id: brand.id,
      client_id: client?.id,
      assigned_to: formData.assigned_to || null,
      description: formData.description || `Producción de campo: ${formData.production_type} en ${formData.location}`,
      brief: formData.brief || `Sesión de ${formData.production_type} para ${formData.production_objective}. Ubicación: ${formData.location}. Fecha: ${formData.session_date} ${formData.session_time}`,
      technical_requirements: formData.technical_requirements.join(', '),
      equipment_needed: formData.equipment_needed.join(', ')
    };
    
    onSave(taskData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <TaskHeader 
        brand={brand}
        client={client}
        taskLimitInfo={taskLimitInfo}
        onOpenBranding={() => toast({
          title: "🎨 Branding Control",
          description: "Accede al Branding Control desde el Brand Hub"
        })}
      />

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border p-8 space-y-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Camera className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Producción de Campo</h3>
            <p className="text-sm text-gray-600">Sesión fotográfica o de video con desplazamiento y logística</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título de la producción *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ej: Sesión fotográfica productos verano"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servicio Requerido *
            </label>
            <select
              name="service_id"
              value={formData.service_id}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar servicio</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - {service.category?.name || 'Sin categoría'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <FieldProductionDetails
          formData={formData}
          handleInputChange={handleInputChange}
          collaborators={collaborators}
        />

        <FieldProductionType
          formData={formData}
          handleInputChange={handleInputChange}
        />

        <FieldProductionRequirements
          formData={formData}
          handleMultiSelectChange={handleMultiSelectChange}
        />

        <FieldProductionLogistics
          formData={formData}
          handleInputChange={handleInputChange}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha límite de entrega *
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="baja">Baja</option>
              <option value="normal">Normal</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas adicionales
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Consideraciones especiales, permisos necesarios, restricciones..."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="bg-orange-600 hover:bg-orange-700"
            disabled={!taskLimitInfo.canCreate}
          >
            <Save className="w-4 h-4 mr-2" />
            Crear Producción de Campo
          </Button>
        </div>
      </motion.form>
    </div>
  );
}