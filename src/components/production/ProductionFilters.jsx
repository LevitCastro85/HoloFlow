import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { taskStatuses } from '@/lib/resourceConstants';

export default function ProductionFilters({
  filters,
  onFilterChange,
  searchTerm,
  setSearchTerm,
  brands,
  responsibles,
  types
}) {
  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filtros de Producción</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos los estados</option>
          {taskStatuses.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>

        <select
          value={filters.brand}
          onChange={(e) => onFilterChange('brand', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todas las marcas</option>
          {brands.map(brand => (
            <option key={brand.id} value={brand.id.toString()}>
              {brand.name}
            </option>
          ))}
        </select>

        <select
          value={filters.responsible}
          onChange={(e) => onFilterChange('responsible', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos los responsables</option>
          {responsibles.map(responsible => (
            <option key={responsible.id} value={responsible.id}>
              {responsible.name}
            </option>
          ))}
        </select>

        <select
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos los servicios</option>
          {types.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between pt-2 border-t">
        <div className="text-sm text-gray-600">
          Mostrando {Object.values(filters).filter(f => f !== 'all').length} filtros activos
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onFilterChange('status', 'all');
            onFilterChange('brand', 'all');
            onFilterChange('responsible', 'all');
            onFilterChange('type', 'all');
            setSearchTerm('');
          }}
        >
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
}