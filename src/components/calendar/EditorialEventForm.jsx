import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Calendar, Repeat, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const eventTypes = [
  { value: 'publicacion', label: 'Publicación' },
  { value: 'campana', label: 'Campaña' },
  { value: 'contenido', label: 'Contenido' },
  { value: 'promocion', label: 'Promoción' },
  { value: 'evento', label: 'Evento' }
];

const contentTypes = [
  { value: 'diseño', label: 'Diseño' },
  { value: 'reel', label: 'Reel' },
  { value: 'video', label: 'Video' },
  { value: 'fotografia', label: 'Fotografía' },
  { value: 'copy', label: 'Copy' },
  { value: 'historia', label: 'Historia' },
  { value: 'carrusel', label: 'Carrusel' }
];

const recurrenceOptions = [
  { value: '', label: 'Sin recurrencia' },
  { value: 'diaria', label: 'Diaria' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensual', label: 'Mensual' }
];

export default function EditorialEventForm({ brand, client, editingEvent, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'publicacion',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    recurrencia: '',
    tipoContenido: 'diseño',
    responsable: '',
    notas: '',
    activo: true
  });

  const [collaborators, setCollaborators] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCollaborators();
    
    if (editingEvent) {
      setFormData({
        ...editingEvent,
        fechaInicio: editingEvent.fechaInicio || '',
        fechaFin: editingEvent.fechaFin || editingEvent.fechaInicio || ''
      });
    }
  }, [editingEvent]);

  const loadCollaborators = () => {
    const savedFreelancers = localStorage.getItem('creativeFreelancers');
    if (savedFreelancers) {
      const freelancers = JSON.parse(savedFreelancers);
      const activeCollaborators = freelancers.filter(f => f.disponibilidad !== 'No disponible');
      setCollaborators(activeCollaborators);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: newValue };
      
      // Si no hay recurrencia, la fecha fin es igual a la fecha inicio
      if (name === 'fechaInicio' && !prev.recurrencia) {
        newData.fechaFin = value;
      }
      
      // Si se selecciona recurrencia, mantener fecha fin
      if (name === 'recurrencia' && !value) {
        newData.fechaFin = newData.fechaInicio;
      }
      
      return newData;
    });
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }

    if (!formData.tipo) {
      newErrors.tipo = 'El tipo de evento es obligatorio';
    }

    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es obligatoria';
    }

    if (!formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es obligatoria';
    } else if (formData.fechaInicio && new Date(formData.fechaFin) < new Date(formData.fechaInicio)) {
      newErrors.fechaFin = 'La fecha de fin debe ser posterior o igual a la fecha de inicio';
    }

    if (!formData.tipoContenido) {
      newErrors.tipoContenido = 'El tipo de contenido es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

    const eventData = {
      id: editingEvent?.id || Date.now(),
      ...formData
    };

    onSave(eventData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {editingEvent ? 'Editar Evento' : 'Nuevo Evento Editorial'}
        </h1>
        <p className="text-gray-600">Marca: {brand.nombre} • Cliente: {client.nombre}</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border p-8 space-y-6"
      >
        {/* Información básica */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Información del Evento
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del evento *
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.titulo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Post semanal motivacional"
              />
              {errors.titulo && (
                <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de evento *
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.tipo ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.tipo && (
                <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe el evento y su propósito..."
            />
          </div>
        </div>

        {/* Fechas y recurrencia */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Repeat className="w-5 h-5 mr-2 text-blue-600" />
            Programación
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de inicio *
              </label>
              <input
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.fechaInicio ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fechaInicio && (
                <p className="text-red-500 text-xs mt-1">{errors.fechaInicio}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de fin *
              </label>
              <input
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.fechaFin ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fechaFin && (
                <p className="text-red-500 text-xs mt-1">{errors.fechaFin}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recurrencia
              </label>
              <select
                name="recurrencia"
                value={formData.recurrencia}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {recurrenceOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contenido y responsable */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Contenido y Asignación
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de contenido *
              </label>
              <select
                name="tipoContenido"
                value={formData.tipoContenido}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.tipoContenido ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {contentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.tipoContenido && (
                <p className="text-red-500 text-xs mt-1">{errors.tipoContenido}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsable sugerido
              </label>
              <select
                name="responsable"
                value={formData.responsable}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar responsable</option>
                {collaborators.map(collaborator => (
                  <option key={collaborator.id} value={collaborator.nombre}>
                    {collaborator.nombre} - {collaborator.especialidad}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas adicionales
            </label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Instrucciones específicas, referencias, etc..."
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label className="text-sm font-medium text-gray-700">
              Evento activo (aparecerá en el calendario)
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            {editingEvent ? 'Actualizar' : 'Crear'} Evento
          </Button>
        </div>
      </motion.form>
    </div>
  );
}