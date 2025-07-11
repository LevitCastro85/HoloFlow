import React from 'react';
import { motion } from 'framer-motion';
import { Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export default function ClientPricing({ 
  clients, 
  services, 
  clientPrices, 
  onEditClientPrices, 
  getClientPrice
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Precios Personalizados por Cliente</h2>
        <p className="text-gray-600">Configura precios específicos para cada cliente</p>
      </div>

      <div className="space-y-4">
        {clients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-lg p-6 border"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{client.nombre}</h3>
                <p className="text-sm text-gray-600">
                  {Object.keys(clientPrices[client.id] || {}).length} servicios personalizados
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => onEditClientPrices(client.id)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurar Precios
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {services.slice(0, 3).map(service => {
                const price = getClientPrice(client.id, service.id);
                const isCustom = clientPrices[client.id]?.[service.id] !== undefined;
                
                return (
                  <div key={service.id} className="bg-white p-3 rounded border">
                    <div className="text-sm font-medium text-gray-900">{service.nombre}</div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-semibold ${isCustom ? 'text-blue-600' : 'text-gray-600'}`}>
                        {formatCurrency(price)}
                      </span>
                      {isCustom && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded">
                          Personalizado
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes registrados</h3>
          <p className="text-gray-600">Agrega clientes para configurar precios personalizados</p>
        </div>
      )}
    </div>
  );
}