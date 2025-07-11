import React from 'react';

const tiposContenido = [
  { value: 'reel', label: 'Reel / Video' },
  { value: 'diseño', label: 'Diseño Gráfico' },
  { value: 'fotografia', label: 'Fotografía' },
  { value: 'copywriting', label: 'Copywriting' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'branding', label: 'Branding' }
];

const responsables = [
  'Ana García',
  'Carlos López',
  'María Rodríguez',
  'David Martín',
  'Laura Sánchez',
  'Freelancer Externo'
];

export default function TaskFormFields({ formData, handleInputChange }) {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título del Proyecto *
          </label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Campaña verano 2025"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cliente *
          </label>
          <input
            type="text"
            name="cliente"
            value={formData.cliente}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre del cliente"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Contenido *
          </label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Seleccionar tipo</option>
            {tiposContenido.map(tipo => (
              <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
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
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción del Proyecto
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe los objetivos y características del proyecto..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brief Creativo
        </label>
        <textarea
          name="brief"
          value={formData.brief}
          onChange={handleInputChange}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Incluye referencias, estilo, colores, mensaje clave, público objetivo..."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Límite
          </label>
          <input
            type="date"
            name="fechaLimite"
            value={formData.fechaLimite}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responsable Asignado
          </label>
          <select
            name="responsable"
            value={formData.responsable}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Asignar después</option>
            {responsables.map(responsable => (
              <option key={responsable} value={responsable}>{responsable}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}