import React, { useState, useEffect } from 'react';
import { Save, X, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils';
import { clientPricesService } from '@/lib/supabaseHelpers';
import { toast } from '@/components/ui/use-toast';

export default function ClientPricingModal({ 
  show, 
  onClose, 
  client,
  services
}) {
  const [clientPrices, setClientPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (show && client) {
      loadClientPrices();
    }
  }, [show, client]);

  const loadClientPrices = async () => {
    if (!client) return;
    
    setLoading(true);
    try {
      const prices = await clientPricesService.getByClient(client.id);
      const pricesMap = {};
      prices.forEach(price => {
        pricesMap[price.service_id] = price.custom_price;
      });
      setClientPrices(pricesMap);
    } catch (error) {
      toast({
        title: "Error al cargar precios",
        description: "No se pudieron cargar los precios personalizados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (serviceId, price) => {
    setClientPrices(prev => ({
      ...prev,
      [serviceId]: price ? parseFloat(price) : undefined
    }));
  };

  const removeCustomPrice = async (serviceId) => {
    try {
      await clientPricesService.delete(client.id, serviceId);
      setClientPrices(prev => {
        const newPrices = { ...prev };
        delete newPrices[serviceId];
        return newPrices;
      });
      
      toast({
        title: "Precio eliminado",
        description: "Se eliminó el precio personalizado. Se usará el precio base."
      });
    } catch (error) {
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el precio personalizado",
        variant: "destructive"
      });
    }
  };

  const saveAllPrices = async () => {
    setSaving(true);
    try {
      const promises = Object.entries(clientPrices).map(([serviceId, price]) => {
        if (price !== undefined) {
          return clientPricesService.upsert({
            client_id: client.id,
            service_id: parseInt(serviceId),
            custom_price: price
          });
        }
      }).filter(Boolean);

      await Promise.all(promises);
      
      toast({
        title: "Precios guardados",
        description: "Los precios personalizados se han actualizado correctamente"
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar los precios personalizados",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (!client) return null;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span>Precios Personalizados - {client.nombre || client.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Gestión de Precios Comerciales</h4>
            <p className="text-sm text-blue-800">
              Configura precios específicos acordados durante las negociaciones comerciales con este cliente. 
              Estos precios se aplicarán automáticamente en futuras ventas y contratos.
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando precios personalizados...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map(service => {
                const customPrice = clientPrices[service.id];
                const hasCustomPrice = customPrice !== undefined;
                
                return (
                  <div key={service.id} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{service.name || service.nombre}</h4>
                        <p className="text-sm text-gray-600">{service.description || service.descripcion}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Precio base del catálogo: {formatCurrency(service.base_price || service.precioBase)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Precio acordado con cliente
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={customPrice || ''}
                              onChange={(e) => handlePriceChange(service.id, e.target.value)}
                              className="w-32 pl-8 pr-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder={(service.base_price || service.precioBase)?.toString()}
                            />
                          </div>
                        </div>
                        {hasCustomPrice && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeCustomPrice(service.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {hasCustomPrice && (
                      <div className="bg-white p-3 rounded border">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Precio final acordado:</span>
                          <span className="font-semibold text-blue-600">
                            {formatCurrency(customPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Diferencia vs precio base:</span>
                          <span className={customPrice > (service.base_price || service.precioBase) ? 'text-green-600' : 'text-red-600'}>
                            {customPrice > (service.base_price || service.precioBase) ? '+' : ''}
                            {formatCurrency(customPrice - (service.base_price || service.precioBase))}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-900 mb-2">Importante</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Los precios personalizados se aplicarán automáticamente en nuevas ventas</li>
              <li>• Si no se define un precio personalizado, se usará el precio base del catálogo</li>
              <li>• Estos precios son específicos para este cliente y no afectan otros clientes</li>
              <li>• Los cambios se guardan inmediatamente al hacer clic en "Guardar Cambios"</li>
            </ul>
          </div>

          <div className="flex space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={saveAllPrices}
              className="flex-1"
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}