import React from 'react';
import { Filter, Search } from 'lucide-react';

const estadosTarea = {
  'en-fila': { label: 'En Fila', color: 'text-gray-600 bg-gray-100' },
  'en-proceso': { label: 'En Proceso', color: 'text-blue-600 bg-blue-100' },
  'revision': { label: 'En Revisión', color: 'text-yellow-600 bg-yellow-100' },
  'entregado': { label: 'Entregado', color: 'text-green-600 bg-green-100' },
  'requiere-atencion': { label: 'Requiere Atención', color: 'text-red-600 bg-red-100' }
};

export default function TaskFilters({ filterStatus, searchTerm, onFilterChange, onSearchChange }) {
  return (
    <div className="bg-white rounded-lg p-4 border shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Todos los estados</option>
              {Object.entries(estadosTarea).map(([key, estado]) => (
                <option key={key} value={key}>{estado.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64"
          />
        </div>
      </div>
    </div>
  );
}