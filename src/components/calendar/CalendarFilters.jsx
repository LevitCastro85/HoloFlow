import React from 'react';
import { Filter, Palette, User, Tag } from 'lucide-react';

export default function CalendarFilters({
  filters,
  setFilters,
  brands,
  responsibles,
  types,
  viewMode,
  selectedBrand,
  onBrandSelect
}) {
  return (
    <div className="flex items-center space-x-2">
      {viewMode === 'general' && (
        <select
          value={filters.marca}
          onChange={(e) => setFilters(prev => ({ ...prev, marca: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">Todas las marcas</option>
          {brands.map(brand => (
            <option key={brand.id} value={brand.id}>{brand.nombre}</option>
          ))}
        </select>
      )}

      <select
        value={filters.responsable}
        onChange={(e) => setFilters(prev => ({ ...prev, responsable: e.target.value }))}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
      >
        <option value="">Todos los responsables</option>
        {responsibles.map(resp => (
          <option key={resp} value={resp}>{resp}</option>
        ))}
      </select>

      <select
        value={filters.tipoContenido}
        onChange={(e) => setFilters(prev => ({ ...prev, tipoContenido: e.target.value }))}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
      >
        <option value="">Todos los tipos</option>
        {types.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <select
        value={filters.estado}
        onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
      >
        <option value="">Todos los estados</option>
        <option value="en-fila">En fila</option>
        <option value="en-proceso">En proceso</option>
        <option value="revision">En revisión</option>
        <option value="entregado">Entregado</option>
        <option value="requiere-atencion">Requiere atención</option>
      </select>

      {viewMode === 'general' && (
        <select
          value={selectedBrand?.id || ''}
          onChange={(e) => {
            if (e.target.value) {
              const brand = brands.find(b => b.id === parseInt(e.target.value));
              onBrandSelect(brand);
            }
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">Ver por marca...</option>
          {brands.map(brand => (
            <option key={brand.id} value={brand.id}>{brand.nombre}</option>
          ))}
        </select>
      )}
    </div>
  );
}