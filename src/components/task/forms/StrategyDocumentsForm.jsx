import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import TaskHeader from '@/components/task/TaskHeader';
import { useTaskData } from '@/hooks/useTaskData';

const taskObjectives = [
  { value: 'diagnosticar', label: 'Diagnosticar' },
  { value: 'nombrar', label: 'Nombrar/Naming' },
  { value: 'posicionar', label: 'Posicionar' },
  { value: 'analizar', label: 'Analizar' },
  { value: 'estrategia', label: 'Desarrollar Estrategia' },
  { value: 'investigar', label: 'Investigar' },
  { value: 'planificar', label: 'Planificar' },
  { value: 'evaluar', label: 'Evaluar' }
];

const deliverableTypes = [
  { value: 'presentacion', label: 'Presentación' },
  { value: 'documento-editable', label: 'Documento Editable' },
  { value: 'manual', label: 'Manual' },
  { value: 'reporte', label: 'Reporte' },
  { value: 'infografia', label: 'Infografía' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'guia', label: 'Guía' },
  { value: 'plan-estrategico', label: 'Plan Estratégico' }
];

const finalFormats = [
  { value: 'pdf', label: 'PDF' },
  { value: 'word', label: 'Microsoft Word' },
  { value: 'powerpoint', label: 'PowerPoint' },
  { value: 'keynote', label: 'Keynote' },
  { value: 'google-docs', label: 'Google Docs' },
  { value: 'excel', label: 'Excel' },
  { value: 'canva', label: 'Canva' },
  { value: 'figma', label: 'Figma' }
];

const centralThemes = [
  { value: 'marca', label: 'Marca' },
  { value: 'mercado', label: 'Mercado' },
  { value: 'competencia', label: 'Competencia' },
  { value: 'medios', label: 'Medios' },
  { value: 'audiencia', label: 'Audiencia' },
  { value: 'producto', label: 'Producto/Servicio' },
  { value: 'comunicacion', label: 'Comunicación' },
  { value: 'digital', label: 'Estrategia Digital' },
  { value: 'ventas', label: 'Ventas' },
  { value: 'marketing', label: 'Marketing' }
];

export default function StrategyDocumentsForm({ brand, client, onSave, onCancel }) {
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
    origen: 'estrategia-documentos',
    task_objective: '',
    deliverable_type: '',
    final_format: '',
    central_theme: '',
    reference_information: '',
    previous_documents: ''
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.service_id || !formData.due_date || !formData.task_objective) {
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
      description: formData.description || `Estrategia y documentos: ${formData.task_objective} sobre ${formData.central_theme}`,
      brief: formData.brief || `Objetivo: ${formData.task_objective}. Entregable: ${formData.deliverable_type} en formato ${formData.final_format}. Tema central: ${formData.central_theme}`
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
          <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Estrategia y Documentos</h3>
            <p className="text-sm text-gray-600">Entregables conceptuales, análisis y propuestas estratégicas</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título del proyecto *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="Ej: Análisis de competencia Q1 2025"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objetivo de la tarea *
            </label>
            <select
              name="task_objective"
              value={formData.task_objective}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar objetivo</option>
              {taskObjectives.map(objective => (
                <option key={objective.value} value={objective.value}>{objective.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema central
            </label>
            <select
              name="central_theme"
              value={formData.central_theme}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">Seleccionar tema</option>
              {centralThemes.map(theme => (
                <option key={theme.value} value={theme.value}>{theme.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de entregable
            </label>
            <select
              name="deliverable_type"
              value={formData.deliverable_type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">Seleccionar tipo</option>
              {deliverableTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato final esperado
            </label>
            <select
              name="final_format"
              value={formData.final_format}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">Seleccionar formato</option>
              {finalFormats.map(format => (
                <option key={format.value} value={format.value}>{format.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción del proyecto
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            placeholder="Describe el alcance y objetivos específicos del proyecto estratégico..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Información de referencia
          </label>
          <textarea
            name="reference_information"
            value={formData.reference_information}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            placeholder="Fuentes de información, datos existentes, estudios previos..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Documentos previos
          </label>
          <textarea
            name="previous_documents"
            value={formData.previous_documents}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            placeholder="Enlaces o referencias a documentos relacionados existentes..."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de entrega acordada *
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsable asignado
            </label>
            <select
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">Sin asignar</option>
              {collaborators.map(collaborator => (
                <option key={collaborator.id} value={collaborator.id}>
                  {collaborator.name} - {collaborator.specialty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            placeholder="Consideraciones especiales, metodología preferida, restricciones..."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="bg-violet-600 hover:bg-violet-700"
            disabled={!taskLimitInfo.canCreate}
          >
            <Save className="w-4 h-4 mr-2" />
            Crear Proyecto Estratégico
          </Button>
        </div>
      </motion.form>
    </div>
  );
}