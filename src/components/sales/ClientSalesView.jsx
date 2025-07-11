import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Edit, DollarSign, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import ClientPricingModal from '@/components/sales/ClientPricingModal';

export default function ClientSalesView({ 
  clients, 
  sales, 
  services,
  onEditSale, 
  getContractStatus, 
  frequencyConfig
}) {
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const getClientSales = (clientId) => {
    return sales.filter(sale => sale.clienteId === clientId);
  };

  const getClientTotalRevenue = (clientId) => {
    const clientSales = getClientSales(clientId);
    return clientSales.reduce((total, sale) => {
      if (sale.frecuencia === 'mensual') {
        return total + (sale.precioFinal * 12);
      }
      return total + sale.precioFinal;
    }, 0);
  };

  const handleManageClientPricing = (client) => {
    setSelectedClient(client);
    setShowPricingModal(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Ventas por Cliente</h2>
      
      <div className="space-y-6">
        {clients.map((client, index) => {
          const clientSales = getClientSales(client.id);
          const totalRevenue = getClientTotalRevenue(client.id);
          
          return (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border shadow-sm"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{client.nombre}</h3>
                      <p className="text-sm text-gray-600">
                        {clientSales.length} contrato{clientSales.length !== 1 ? 's' : ''} registrado{clientSales.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
                      <div className="text-sm text-gray-600">Ingresos totales</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManageClientPricing(client)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Precios Personalizados
                    </Button>
                  </div>
                </div>
              </div>

              {clientSales.length > 0 ? (
                <div className="p-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {clientSales.map((sale, saleIndex) => {
                      const status = getContractStatus(sale);
                      const frequency = frequencyConfig[sale.frecuencia];
                      const FrequencyIcon = frequency.icon;
                      
                      return (
                        <motion.div
                          key={sale.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: saleIndex * 0.1 }}
                          className="bg-gray-50 rounded-lg p-4 border"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{sale.servicioNombre}</h4>
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${status.bgColor} ${status.color}`}>
                                {status.label}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onEditSale(sale)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Precio:</span>
                              <span className="font-semibold text-green-600">
                                {formatCurrency(sale.precioFinal)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-600">Frecuencia:</span>
                              <div className="flex items-center space-x-1">
                                <FrequencyIcon className={`w-3 h-3 ${frequency.color}`} />
                                <span className="font-medium">{frequency.label}</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-600">Inicio:</span>
                              <span className="font-medium">
                                {new Date(sale.fechaInicio).toLocaleDateString('es-MX')}
                              </span>
                            </div>
                            
                            {sale.fechaFin && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Fin:</span>
                                <span className="font-medium">
                                  {new Date(sale.fechaFin).toLocaleDateString('es-MX')}
                                </span>
                              </div>
                            )}
                          </div>

                          {sale.notas && (
                            <div className="mt-3 text-xs text-gray-500 bg-white p-2 rounded border">
                              {sale.notas}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p>No hay contratos registrados para este cliente</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes registrados</h3>
          <p className="text-gray-600">Agrega clientes para poder registrar ventas</p>
        </div>
      )}

      <ClientPricingModal
        show={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        client={selectedClient}
        services={services}
      />
    </div>
  );
}