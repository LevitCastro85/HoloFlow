import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import TaskHeader from '@/components/task/TaskHeader';
import { useTaskData } from '@/hooks/useTaskData';

const contentFormats = [
  { value: 'imagen', label: 'Imagen' },
  { value: 'video-corto', label: 'Video Corto' },
  { value: 'banner', label: 'Banner' },
  { value: 'plantilla', label: 'Plantilla' },
  { value: 'carrusel', label: 'Carrusel' },
  { value: 'historia', label: 'Historia/Story' },
  { value: 'reel', label: 'Reel' },
  { value: 'gif-animado', label: 'GIF Animado' }
];

const platforms = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'web', label: 'Sitio Web' },
  { value: 'email', label: 'Email Marketing' }
];

const dimensions = [
  { value: '1080x1080', label: '1080x1080 (Cuadrado)' },
  { value: '1080x1350', label: '1080x1350 (Vertical)' },
  { value: '1920x1080', label: '1920x1080 (Horizontal)' },
  { value: '1080x1920', label: '1080x1920 (Stories)' },
  { value: '1200x628', label: '1200x628 (Facebook)' },
  { value: '1024x512', label: '1024x512 (LinkedIn)' },
  { value: 'personalizado', label: 'Personalizado' }
];

const messageTones = [
  { value: 'profesional', label: 'Profesional' },
  { value: 'casual', label: 'Casual' },
  { value: 'divertido', label: 'Divertido' },
  { value: 'elegante', label: 'Elegante' },
  { value: 'moderno', label: 'Moderno' },
  { value: 'minimalista', label: 'Minimalista' },
  { value: 'vibrante', label: 'Vibrante' },
  { value: 'corporativo', label: 'Corporativo' }
];

export default function DigitalContentForm({ brand, client, onSave, onCancel }) {
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
    origen: 'contenido-digital',
    content_format: '',
    platform: 'instagram',
    dimensions: '1080x1080',
    custom_dimensions: '',
    message_tone: 'profesional',
    key_message: '',
    call_to_action: '',
    visual_style: '',
    visual_references: ''
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
    
    if (!formData.title.trim() || !formData.service_id || !formData.due_date || !formData.content_format) {
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
      description: formData.description || `Contenido digital: ${formData.content_format} para ${formData.platform}`,
      brief: formData.brief || `Crear ${formData.content_format} con tono ${formData.message_tone}. Mensaje clave: ${formData.key_message}. CTA: ${formData.call_to_action}`,
      social_network: formData.platform,
      header_text: formData.key_message,
      descriptive_text: formData.visual_style,
      campaign_theme: formData.visual_references
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
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Contenido Digital</h3>
            <p className="text-sm text-gray-600">Piezas visuales o audiovisuales para medios digitales</p>
          </div>
        </div>

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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ej: Post promocional Black Friday"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato del contenido *
            </label>
            <select
              name="content_format"
              value={formData.content_format}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar formato</option>
              {contentFormats.map(format => (
                <option key={format.value} value={format.value}>{format.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plataforma de publicación *
            </label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {platforms.map(platform => (
                <option key={platform.value} value={platform.value}>{platform.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dimensiones o proporción
            </label>
            <select
              name="dimensions"
              value={formData.dimensions}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {dimensions.map(dimension => (
                <option key={dimension.value} value={dimension.value}>{dimension.label}</option>
              ))}
            </select>
          </div>
        </div>

        {formData.dimensions === 'personalizado' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dimensiones personalizadas
            </label>
            <input
              type="text"
              name="custom_dimensions"
              value={formData.custom_dimensions}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ej: 1200x800 píxeles"
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tono del mensaje o estilo
            </label>
            <select
              name="message_tone"
              value={formData.message_tone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {messageTones.map(tone => (
                <option key={tone.value} value={tone.value}>{tone.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsable asignado
            </label>
            <select
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Sin asignar</option>
              {collaborators.map(collaborator => (
                <option key={collaborator.id} value={collaborator.id}>
                  {collaborator.name} - {collaborator.specialty}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensaje clave o idea principal
          </label>
          <input
            type="text"
            name="key_message"
            value={formData.key_message}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ej: Descuentos únicos por tiempo limitado"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Call to Action (CTA)
          </label>
          <input
            type="text"
            name="call_to_action"
            value={formData.call_to_action}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ej: Compra ahora, Visita nuestro sitio, Contáctanos"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estilo visual o referencias
          </label>
          <textarea
            name="visual_style"
            value={formData.visual_style}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Describe el estilo visual deseado, colores, tipografías, referencias..."
          />
        </div>

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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Información adicional, consideraciones especiales..."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700"
            disabled={!taskLimitInfo.canCreate}
          >
            <Save className="w-4 h-4 mr-2" />
            Crear Tarea de Contenido Digital
          </Button>
        </div>
      </motion.form>
    </div>
  );
}