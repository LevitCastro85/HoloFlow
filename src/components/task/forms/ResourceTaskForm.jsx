import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Link as LinkIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import TaskHeader from '@/components/task/TaskHeader';
import { useTaskData } from '@/hooks/useTaskData';
import { resourcesService } from '@/lib/supabaseHelpers';

const followUpTypes = [
  { value: 'correccion', label: 'Corrección' },
  { value: 'version-alternativa', label: 'Versión Alternativa' },
  { value: 'entrega-final', label: 'Entrega Final' },
  { value: 'adaptacion', label: 'Adaptación' },
  { value: 'optimizacion', label: 'Optimización' },
  { value: 'formato-adicional', label: 'Formato Adicional' },
  { value: 'revision-cliente', label: 'Revisión de Cliente' },
  { value: 'actualizacion', label: 'Actualización' }
];

export default function ResourceTaskForm({ brand, client, onSave, onCancel }) {
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
    origen: 'recurso',
    related_resource_id: '',
    follow_up_type: '',
    specific_changes: ''
  });

  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);

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
    loadResources();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResources(resources);
      return;
    }
    const filtered = resources.filter(resource =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResources(filtered);
  }, [searchTerm, resources]);

  const loadResources = async () => {
    try {
      const allResources = await resourcesService.getAll();
      const approvedResources = (allResources || []).filter(r => 
        r.status === 'approved' && r.brand_id === brand.id
      );
      setResources(approvedResources);
      setFilteredResources(approvedResources);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los recursos",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResourceSelect = (resource) => {
    setSelectedResource(resource);
    setFormData(prev => ({
      ...prev,
      related_resource_id: resource.id,
      title: `Seguimiento: ${resource.name}`,
      description: `Tarea de seguimiento para el recurso: ${resource.name}`,
      brief: `Dar seguimiento al recurso "${resource.name}" previamente aprobado.`
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.service_id || !formData.due_date || !formData.related_resource_id || !formData.follow_up_type) {
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
      brief: `${formData.brief} Tipo de seguimiento: ${formData.follow_up_type}. ${formData.specific_changes ? 'Cambios específicos: ' + formData.specific_changes : ''}`
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
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <LinkIcon className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Tarea con Recurso</h3>
            <p className="text-sm text-gray-600">Dar seguimiento a un entregable previamente aprobado</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">📎 Seleccionar Recurso Vinculado</h4>
          <p className="text-blue-700 text-sm mb-3">
            Elige el recurso aprobado que servirá como base para esta tarea de seguimiento.
          </p>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar recursos aprobados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredResources.length > 0 ? (
              <div className="space-y-1 p-2">
                {filteredResources.map(resource => (
                  <div
                    key={resource.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedResource?.id === resource.id 
                        ? 'bg-blue-100 border border-blue-300' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleResourceSelect(resource)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{resource.name}</h5>
                        <p className="text-sm text-gray-600 line-clamp-1">{resource.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Aprobado
                          </span>
                          <span>{resource.file_type}</span>
                          {resource.created_at && (
                            <span>Creado: {new Date(resource.created_at).toLocaleDateString('es-MX')}</span>
                          )}
                        </div>
                      </div>
                      {selectedResource?.id === resource.id && (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No se encontraron recursos aprobados</p>
                <p className="text-sm">Intenta con otros términos de búsqueda</p>
              </div>
            )}
          </div>
        </div>

        {selectedResource && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">✅ Recurso Seleccionado</h4>
            <p className="text-green-700 text-sm">
              <strong>{selectedResource.name}</strong> - {selectedResource.description}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título de la tarea *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ej: Corrección de diseño según feedback"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            Tipo de seguimiento *
          </label>
          <select
            name="follow_up_type"
            value={formData.follow_up_type}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Seleccionar tipo de seguimiento</option>
            {followUpTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detalles específicos del cambio
          </label>
          <textarea
            name="specific_changes"
            value={formData.specific_changes}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Describe específicamente qué cambios o ajustes se necesitan..."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva fecha de entrega *
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsable (si cambia)
            </label>
            <select
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Mantener responsable original</option>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Información adicional, contexto del cambio, instrucciones especiales..."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="bg-purple-600 hover:bg-purple-700"
            disabled={!taskLimitInfo.canCreate || !selectedResource}
          >
            <Save className="w-4 h-4 mr-2" />
            Crear Tarea con Recurso
          </Button>
        </div>
      </motion.form>
    </div>
  );
}