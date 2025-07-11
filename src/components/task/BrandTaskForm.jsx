import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import TaskHeader from '@/components/task/TaskHeader';
import TaskBasicFields from '@/components/task/TaskBasicFields';
import TaskContentFields from '@/components/task/TaskContentFields';
import TaskFileManager from '@/components/task/TaskFileManager';
import { useTaskValidation } from '@/hooks/useTaskValidation';
import { useTaskData } from '@/hooks/useTaskData';

export default function BrandTaskForm({ brand, client, editingTask, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    client_id: '',
    service_id: '',
    description: '',
    brief: '',
    request_date: new Date().toISOString().split('T')[0],
    due_date: '',
    assigned_to: '',
    status: 'en-fila',
    priority: 'media',
    notes: '',
    origen: 'individual',
    calendar_event_id: null,
    calendar_event_title: '',
    social_network: 'instagram',
    campaign_theme: '',
    header_text: '',
    descriptive_text: '',
    call_to_action: ''
  });
  const [archivos, setArchivos] = useState([]);

  const {
    collaborators,
    services,
    clients,
    taskLimitInfo,
    loadData,
    checkTaskLimits
  } = useTaskData(brand, client);

  const { errors, validateForm } = useTaskValidation(formData, taskLimitInfo, editingTask);

  useEffect(() => {
    loadData();
    checkTaskLimits();
    
    if (editingTask) {
      setFormData({
        ...editingTask,
        client_id: editingTask.client_id || client?.id || '',
        request_date: editingTask.request_date || new Date().toISOString().split('T')[0],
        due_date: editingTask.due_date || '',
        origen: editingTask.origen || 'individual',
      });
    } else if (client) {
      setFormData(prev => ({
        ...prev,
        client_id: client.id
      }));
    }
  }, [editingTask, brand.id, client]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setArchivos(prev => [...prev, ...newFiles]);
    
    toast({
      title: "Archivos agregados",
      description: `${newFiles.length} archivo(s) agregado(s) correctamente`
    });
  };

  const removeFile = (index) => {
    setArchivos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Error en el formulario",
        description: "Por favor corrige los errores antes de continuar",
        variant: "destructive"
      });
      return;
    }

    const taskData = {
      ...formData,
      brand_id: brand.id,
      assigned_to: formData.assigned_to || null,
    };
    
    onSave(taskData, editingTask?.id);
  };

  const openBrandingControl = () => {
    toast({
      title: "🎨 Branding Control",
      description: "Accede al Branding Control desde el panel de Brand Control para consultar elementos de marca"
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <TaskHeader 
        brand={brand}
        client={client}
        taskLimitInfo={taskLimitInfo}
        onOpenBranding={openBrandingControl}
      />

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border p-8 space-y-6"
      >
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{errors.general}</p>
          </div>
        )}

        {formData.origen === 'calendario' && formData.calendar_event_title && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">📅 Tarea creada desde Calendario Editorial</h4>
            <p className="text-purple-700 text-sm">
              Esta tarea se originó del evento: <strong>"{formData.calendar_event_title}"</strong>
            </p>
          </div>
        )}

        <TaskBasicFields 
          formData={formData}
          errors={errors}
          collaborators={collaborators}
          services={services}
          clients={clients}
          onInputChange={handleInputChange}
        />

        <TaskContentFields 
          formData={formData}
          onInputChange={handleInputChange}
        />

        <TaskFileManager 
          formData={{ ...formData, archivos: archivos.map(f => f.name) }}
          onFileUpload={handleFileUpload}
          onRemoveFile={removeFile}
        />

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!taskLimitInfo.canCreate && !editingTask}
          >
            <Save className="w-4 h-4 mr-2" />
            {editingTask ? 'Actualizar' : 'Crear'} Tarea
          </Button>
        </div>
      </motion.form>
    </div>
  );
}