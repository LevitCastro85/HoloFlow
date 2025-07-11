import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export default function SalesTable({ 
  sales, 
  onEditSale, 
  getContractStatus, 
  isContractActive,
  frequencyConfig,
  periodTypeConfig
}) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('fechaCreacion');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredSales = sales.filter(sale => {
    if (filter === 'active') return isContractActive(sale);
    if (filter === 'inactive') return !isContractActive(sale);
    return true;
  });

  const sortedSales = [...filteredSales].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'precioFinal') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  return (
    <div className="space-y-4">
      {/* Filtros y ordenación */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los contratos</option>
            <option value="active">Solo activos</option>
            <option value="inactive">Solo finalizados</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="fechaCreacion">Fecha de creación</option>
            <option value="clienteNombre">Cliente</option>
            <option value="precioFinal">Precio</option>
            <option value="fechaInicio">Fecha de inicio</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          {filteredSales.length} contrato{filteredSales.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente / Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frecuencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fechas
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedSales.map((sale, index) => {
                const status = getContractStatus(sale);
                const frequency = frequencyConfig[sale.frecuencia];
                const periodType = periodTypeConfig[sale.tipoPeriodo];
                
                return (
                  <motion.tr
                    key={sale.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{sale.clienteNombre}</div>
                        <div className="text-sm text-gray-500">{sale.servicioNombre}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">
                        {formatCurrency(sale.precioFinal)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <frequency.icon className={`w-3 h-3 ${frequency.color}`} />
                        <span className="text-sm text-gray-900">{frequency.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <periodType.icon className={`w-3 h-3 ${periodType.color}`} />
                        <span className="text-sm text-gray-900">{periodType.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.bgColor} ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>Inicio: {new Date(sale.fechaInicio).toLocaleDateString('es-MX')}</div>
                        {sale.fechaFin && (
                          <div>Fin: {new Date(sale.fechaFin).toLocaleDateString('es-MX')}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditSale(sale)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {sortedSales.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ventas registradas</h3>
          <p className="text-gray-600">Los contratos aparecerán aquí una vez que registres ventas</p>
        </div>
      )}
    </div>
  );
}