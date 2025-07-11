import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Clock, User, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useTaskData } from '@/hooks/useTaskData';
import { useTaskValidation } from '@/hooks/useTaskValidation';

const tiposContenido = [
  { value: 'diseño', label: 'Diseño Gráfico' },
  { value: 'reel', label: 'Reel / Video' },
  { value: 'fotografia', label: 'Fotografía' },
  { value: 'copywriting', label: 'Copywriting' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'branding', label: 'Branding' }
];

const prioridades = [
  { value: 'media', label: 'Media', color: 'text-gray-600' },
  { value: 'alta', label: 'Alta', color: 'text-orange-600' },
  { value: 'urgente', label: 'Urgente', color: 'text-red-600' }
];

export default function QuickTaskForm({ brand, client, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: '',
    tipoContenido: '',
    descripcion: '',
    fechaEntrega: '',
    responsable: '',
    prioridad: 'media',
    precioTarea: 0
  });

  const {
    collaborators,
    taskLimitInfo,
    loadData,
    checkTaskLimits,
    getServicePrice
  } = useTaskData(brand, client);

  const { errors, validateForm } = useTaskValidation(formData, taskLimitInfo, null);

  useEffect(() => {
    loadData();
    checkTaskLimits();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === 'tipoContenido') {
        newData.precioTarea = getServicePrice(value);
      }
      
      return newData;
    });
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

    const { archivos, ...restOfFormData } = formData;

    const taskData = {
      ...restOfFormData,
      id: Date.now(),
      brandId: brand.id,
      clienteId: client.id,
      marcaNombre: brand.nombre,
      clienteNombre: client.nombre,
      fechaSolicitud: new Date().toISOString().split('T')[0],
      estado: 'en-fila',
      fechaCreacion: new Date().toISOString(),
      origen: 'individual',
      brief: formData.descripcion,
      notas: ''
    };

    onSave(taskData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Crear Tarea Rápida</h3>
          <p className="text-gray-600">Marca: {brand.nombre} • Cliente: {client.nombre}</p>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${taskLimitInfo.canCreate ? 'text-green-600' : 'text-red-600'}`}>
            {taskLimitInfo.current} / {taskLimitInfo.limit} tareas activas
          </div>
        </div>
      </div>

      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{errors.general}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título de la tarea *
          </label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.titulo ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Post promocional verano 2025"
          />
          {errors.titulo && (
            <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de contenido *
          </label>
          <select
            name="tipoContenido"
            value={formData.tipoContenido}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.tipoContenido ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar tipo</option>
            {tiposContenido.map(tipo => (
              <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
            ))}
          </select>
          {errors.tipoContenido && (
            <p className="text-red-500 text-xs mt-1">{errors.tipoContenido}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción del proyecto
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe brevemente el proyecto y sus objetivos..."
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Fecha de entrega *
          </label>
          <input
            type="date"
            name="fechaEntrega"
            value={formData.fechaEntrega}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.fechaEntrega ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fechaEntrega && (
            <p className="text-red-500 text-xs mt-1">{errors.fechaEntrega}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Responsable
          </label>
          <select
            name="responsable"
            value={formData.responsable}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sin asignar</option>
            {collaborators.map(collaborator => (
              <option key={collaborator.id} value={collaborator.nombre}>
                {collaborator.nombre} - {collaborator.especialidad}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Flag className="w-4 h-4 inline mr-1" />
            Prioridad
          </label>
          <select
            name="prioridad"
            value={formData.prioridad}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {prioridades.map(prioridad => (
              <option key={prioridad.value} value={prioridad.value}>{prioridad.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-900">Precio de la Tarea</h4>
            <p className="text-blue-700 text-sm">
              {formData.tipoContenido 
                ? `Precio sugerido: €${getServicePrice(formData.tipoContenido)}`
                : 'Selecciona un tipo de contenido para ver el precio'
              }
            </p>
          </div>
          <div className="text-right">
            <input
              type="number"
              name="precioTarea"
              min="0"
              step="0.01"
              value={formData.precioTarea}
              onChange={handleInputChange}
              className="w-24 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
            <div className="text-xs text-blue-600 mt-1">€ EUR</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={!taskLimitInfo.canCreate}
        >
          <Save className="w-4 h-4 mr-2" />
          Crear Tarea
        </Button>
      </div>
    </motion.form>
  );
}