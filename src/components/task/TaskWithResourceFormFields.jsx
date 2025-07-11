import React from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TaskWithResourceFormFields({ 
  formData, 
  brands, 
  clients, 
  selectedBrand, 
  collaborators,
  onInputChange, 
  onBrandChange, 
  onSubmit, 
  onCancel,
  isSubmitting
}) {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-sm border p-8 space-y-6">
      {/* Selección de marca */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marca de destino *
          </label>
          <select
            value={selectedBrand?.id || ''}
            onChange={onBrandChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Seleccionar marca...</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>
                {brand.name} - {brand.industry}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Puede ser diferente a la marca del recurso original
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cliente asociado
          </label>
          <input
            type="text"
            value={selectedBrand ? clients.find(c => c.id === selectedBrand.client_id)?.name || 'No encontrado' : 'Selecciona una marca'}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>
      </div>

      {/* Información básica de la tarea */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título de la tarea *
          </label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Adaptación de diseño para redes sociales"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de contenido *
          </label>
          <select
            name="tipoContenido"
            value={formData.tipoContenido}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Seleccionar tipo...</option>
            <option value="Post Instagram">Post Instagram</option>
            <option value="Story Instagram">Story Instagram</option>
            <option value="Reel Instagram">Reel Instagram</option>
            <option value="Post Facebook">Post Facebook</option>
            <option value="Video TikTok">Video TikTok</option>
            <option value="Banner Web">Banner Web</option>
            <option value="Flyer Digital">Flyer Digital</option>
            <option value="Logo">Logo</option>
            <option value="Branding">Branding</option>
            <option value="Fotografía">Fotografía</option>
            <option value="Video Promocional">Video Promocional</option>
            <option value="Copywriting">Copywriting</option>
          </select>
        </div>
      </div>

      {/* Descripción y brief */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción de la tarea
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={onInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe qué se debe hacer con el recurso..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brief detallado
        </label>
        <textarea
          name="brief"
          value={formData.brief}
          onChange={onInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Instrucciones específicas sobre cómo usar el recurso..."
        />
      </div>

      {/* Fechas y responsable */}
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de entrega *
          </label>
          <input
            type="date"
            name="fechaEntrega"
            value={formData.fechaEntrega}
            onChange={onInputChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responsable
          </label>
          <select
            name="responsable"
            value={formData.responsable}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            name="prioridad"
            value={formData.prioridad}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="media">Media</option>
            <option value="normal">Normal</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>
      </div>

      {/* Precio */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio de la tarea
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
            <input
              type="number"
              name="precioTarea"
              value={formData.precioTarea}
              onChange={onInputChange}
              min="0"
              step="0.01"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-8">
          <input
            type="checkbox"
            name="precioPersonalizado"
            checked={formData.precioPersonalizado}
            onChange={onInputChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label className="text-sm text-gray-700">
            Precio personalizado (no usar catálogo)
          </label>
        </div>
      </div>

      {/* Notas adicionales */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas y observaciones
        </label>
        <textarea
          name="notasObservaciones"
          value={formData.notasObservaciones}
          onChange={onInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Notas adicionales sobre el uso del recurso..."
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-purple-600 hover:bg-purple-700"
          disabled={!selectedBrand || isSubmitting}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Creando...' : 'Crear Tarea con Recurso'}
        </Button>
      </div>
    </form>
  );
}