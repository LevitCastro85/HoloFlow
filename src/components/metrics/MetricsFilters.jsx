import React from 'react';
import { Filter, Search, Building2, User, Briefcase } from 'lucide-react';

export default function MetricsFilters({ 
  filters, 
  onFiltersChange, 
  brands, 
  clients, 
  collaborators 
}) {
  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Filter className="w-5 h-5 mr-2 text-blue-600" />
        Filtros Dinámicos
      </h3>
      
      <div className="grid md:grid-cols-4 gap-4">
        {/* Filtro por Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building2 className="w-4 h-4 inline mr-1" />
            Cliente
          </label>
          <select
            value={filters.clientId}
            onChange={(e) => handleFilterChange('clientId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los clientes</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="w-4 h-4 inline mr-1" />
            Marca
          </label>
          <select
            value={filters.brandId}
            onChange={(e) => handleFilterChange('brandId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las marcas</option>
            {brands
              .filter(brand => !filters.clientId || brand.clienteId.toString() === filters.clientId)
              .map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.nombre}
                </option>
              ))}
          </select>
        </div>

        {/* Filtro por Colaborador */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Colaborador
          </label>
          <select
            value={filters.collaborator}
            onChange={(e) => handleFilterChange('collaborator', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los colaboradores</option>
            {collaborators.map(collaborator => (
              <option key={collaborator.id} value={collaborator.nombre}>
                {collaborator.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Período */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Período
          </label>
          <select
            value={filters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
            <option value="365">Último año</option>
          </select>
        </div>
      </div>

      {/* Filtros adicionales */}
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado de Tarea
          </label>
          <select
            value={filters.taskStatus}
            onChange={(e) => handleFilterChange('taskStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="en-fila">En Fila</option>
            <option value="en-proceso">En Proceso</option>
            <option value="revision">En Revisión</option>
            <option value="entregado">Entregado</option>
            <option value="requiere-atencion">Requiere Atención</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prioridad
          </label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las prioridades</option>
            <option value="normal">Normal</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Contenido
          </label>
          <select
            value={filters.contentType}
            onChange={(e) => handleFilterChange('contentType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los tipos</option>
            <option value="diseño">Diseño Gráfico</option>
            <option value="reel">Reel / Video</option>
            <option value="fotografia">Fotografía</option>
            <option value="copywriting">Copywriting</option>
            <option value="social-media">Social Media</option>
            <option value="branding">Branding</option>
            <option value="web">Desarrollo Web</option>
            <option value="marketing">Marketing Digital</option>
          </select>
        </div>
      </div>

      {/* Indicador de filtros activos */}
      {Object.values(filters).some(value => value && value !== '7') && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 text-sm font-medium">
              Filtros activos aplicados
            </span>
            <button
              onClick={() => onFiltersChange({ period: '30', clientId: '', brandId: '', collaborator: '', taskStatus: '', priority: '', contentType: '' })}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}