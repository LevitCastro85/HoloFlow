import React from 'react';
import { Search } from 'lucide-react';
import { resourceStatusLabels } from '@/lib/resourceConstants';

export default function ResourceBankFilters({ 
  searchTerm, 
  setSearchTerm, 
  filters, 
  setFilters, 
  uniqueMarcas, 
  uniqueTipos, 
  uniqueCategorias, 
  uniqueStatuses
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="grid md:grid-cols-5 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nombre, descripción, etiquetas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={filters.marca}
          onChange={(e) => setFilters(prev => ({ ...prev, marca: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todas las marcas</option>
          {uniqueMarcas.map(marca => (
            <option key={marca} value={marca}>{marca}</option>
          ))}
        </select>
        
        <select
          value={filters.tipo}
          onChange={(e) => setFilters(prev => ({ ...prev, tipo: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos los tipos</option>
          {uniqueTipos.map(tipo => (
            <option key={tipo} value={tipo} className="capitalize">{tipo}</option>
          ))}
        </select>
        
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos los estados</option>
          {uniqueStatuses.map(status => (
            <option key={status} value={status}>{resourceStatusLabels[status] || status}</option>
          ))}
        </select>
      </div>
    </div>
  );
}