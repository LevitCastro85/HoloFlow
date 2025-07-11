import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export default function ServiceSelector({ propuesta, setPropuesta }) {
  const [services, setServices] = useState([]);
  const [clientPrices, setClientPrices] = useState({});

  useEffect(() => {
    // Cargar servicios y precios
    const savedServices = localStorage.getItem('servicesCatalog');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }

    const savedClientPrices = localStorage.getItem('clientCustomPrices');
    if (savedClientPrices) {
      setClientPrices(JSON.parse(savedClientPrices));
    }
  }, []);

  const getServicePrice = (serviceId, clientName) => {
    // Buscar cliente por nombre
    const savedClients = localStorage.getItem('creativeClients');
    if (savedClients) {
      const clients = JSON.parse(savedClients);
      const client = clients.find(c => c.nombre === clientName);
      
      if (client && clientPrices[client.id]?.[serviceId] !== undefined) {
        return clientPrices[client.id][serviceId];
      }
    }
    
    // Usar precio base si no hay precio personalizado
    const service = services.find(s => s.id === serviceId);
    return service?.precioBase || 0;
  };

  const agregarServicio = (service) => {
    const precio = getServicePrice(service.id, propuesta.cliente);
    
    const nuevoServicio = {
      ...service,
      cantidad: 1,
      precioUnitario: precio,
      tiempoEstimado: service.tiempoEstimado
    };
    
    setPropuesta(prev => ({
      ...prev,
      servicios: [...prev.servicios, nuevoServicio]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-xl shadow-sm border p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Servicios Disponibles</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        {services.map(service => {
          const precio = propuesta.cliente ? getServicePrice(service.id, propuesta.cliente) : service.precioBase;
          const isCustomPrice = propuesta.cliente && precio !== service.precioBase;
          
          return (
            <div key={service.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{service.nombre}</h3>
                <Button
                  size="sm"
                  onClick={() => agregarServicio(service)}
                  disabled={propuesta.servicios.some(s => s.id === service.id)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-3">{service.descripcion}</p>
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-gray-500">
                    {isCustomPrice ? 'Precio personalizado: ' : 'Desde '}{formatCurrency(precio)}
                  </span>
                  {isCustomPrice && (
                    <div className="text-xs text-blue-600">
                      (Base: {formatCurrency(service.precioBase)})
                    </div>
                  )}
                </div>
                <span className="text-gray-500">{service.tiempoEstimado} días</span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}