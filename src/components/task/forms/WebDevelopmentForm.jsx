import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import TaskHeader from '@/components/task/TaskHeader';
import { useTaskData } from '@/hooks/useTaskData';

const taskTypes = [
  { value: 'creacion', label: 'Creación de Sitio' },
  { value: 'rediseno', label: 'Rediseño' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'posicionamiento', label: 'SEO/Posicionamiento' },
  { value: 'migracion', label: 'Migración' },
  { value: 'optimizacion', label: 'Optimización' },
  { value: 'seguridad', label: 'Seguridad' },
  { value: 'integracion', label: 'Integración' }
];

const cmsTools = [
  { value: 'wordpress', label: 'WordPress' },
  { value: 'joomla', label: 'Joomla' },
  { value: 'webflow', label: 'Webflow' },
  { value: 'shopify', label: 'Shopify' },
  { value: 'wix', label: 'Wix' },
  { value: 'squarespace', label: 'Squarespace' },
  { value: 'drupal', label: 'Drupal' },
  { value: 'custom', label: 'Desarrollo Personalizado' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' }
];

const siteTypes = [
  { value: 'landing', label: 'Landing Page' },
  { value: 'institucional', label: 'Sitio Institucional' },
  { value: 'catalogo', label: 'Catálogo de Productos' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'blog', label: 'Blog' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'corporativo', label: 'Sitio Corporativo' },
  { value: 'educativo', label: 'Plataforma Educativa' },
  { value: 'directorio', label: 'Directorio' },
  { value: 'reservas', label: 'Sistema de Reservas' }
];

const workFocus = [
  { value: 'estructura', label: 'Estructura/Arquitectura' },
  { value: 'contenido', label: 'Contenido' },
  { value: 'seo', label: 'SEO/Posicionamiento' },
  { value: 'seguridad', label: 'Seguridad' },
  { value: 'performance', label: 'Rendimiento' },
  { value: 'responsive', label: 'Diseño Responsive' },
  { value: 'ux-ui', label: 'UX/UI' },
  { value: 'integraciones', label: 'Integraciones' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'conversion', label: 'Optimización de Conversión' }
];

export default function WebDevelopmentForm({ brand, client, onSave, onCancel }) {
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
    origen: 'desarrollo-web',
    website_url: '',
    task_type: '',
    cms_tool: '',
    site_type: '',
    work_focus: [],
    specific_activities: '',
    base_structure: ''
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
    
    if (!formData.title.trim() || !formData.service_id || !formData.due_date || !formData.task_type) {
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
      description: formData.description || `Desarrollo web: ${formData.task_type} para ${formData.site_type}`,
      brief: formData.brief || `Tipo de trabajo: ${formData.task_type}. CMS/Herramienta: ${formData.cms_tool}. Enfoque: ${formData.work_focus.join(', ')}`,
      work_focus: formData.work_focus.join(', ')
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
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Desarrollo Web y Técnico</h3>
            <p className="text-sm text-gray-600">Creación, mantenimiento y optimización de sitios web</p>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Ej: Rediseño sitio web corporativo"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección del sitio web
          </label>
          <input
            type="url"
            name="website_url"
            value={formData.website_url}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            placeholder="https://ejemplo.com (si aplica)"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de tarea *
            </label>
            <select
              name="task_type"
              value={formData.task_type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar tipo</option>
              {taskTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Herramienta o CMS
            </label>
            <select
              name="cms_tool"
              value={formData.cms_tool}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="">Seleccionar herramienta</option>
              {cmsTools.map(tool => (
                <option key={tool.value} value={tool.value}>{tool.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de sitio
            </label>
            <select
              name="site_type"
              value={formData.site_type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="">Seleccionar tipo</option>
              {siteTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Enfoque del trabajo
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            {workFocus.map(focus => (
              <label key={focus.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.work_focus.includes(focus.value)}
                  onChange={() => handleMultiSelectChange('work_focus', focus.value)}
                  className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                />
                <span className="text-sm text-gray-700">{focus.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Actividades específicas a realizar
          </label>
          <textarea
            name="specific_activities"
            value={formData.specific_activities}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            placeholder="Detalla las tareas específicas que se deben realizar..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Material o estructura base
          </label>
          <textarea
            name="base_structure"
            value={formData.base_structure}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            placeholder="Archivos existentes, wireframes, diseños base para comenzar..."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de entrega *
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            placeholder="Consideraciones técnicas, restricciones, accesos necesarios..."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="bg-gray-600 hover:bg-gray-700"
            disabled={!taskLimitInfo.canCreate}
          >
            <Save className="w-4 h-4 mr-2" />
            Crear Proyecto Web
          </Button>
        </div>
      </motion.form>
    </div>
  );
}