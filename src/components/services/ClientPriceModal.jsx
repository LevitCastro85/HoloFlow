import React from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils';

export default function ClientPriceModal({ 
  show, 
  onClose, 
  editingClientPrices, 
  setEditingClientPrices, 
  onSave, 
  services
}) {
  if (!editingClientPrices) return null;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Precios Personalizados - {editingClientPrices?.clientName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Configura precios específicos para este cliente. Si no se define un precio, se usará el precio base del catálogo.
          </p>
          
          <div className="space-y-4">
            {services.map(service => {
              const customPrice = editingClientPrices.prices[service.id];
              const hasCustomPrice = customPrice !== undefined;
              
              return (
                <div key={service.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{service.nombre}</h4>
                      <p className="text-sm text-gray-600">{service.descripcion}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Precio base: {formatCurrency(service.precioBase)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Precio personalizado
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={customPrice || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              setEditingClientPrices(prev => ({
                                ...prev,
                                prices: {
                                  ...prev.prices,
                                  [service.id]: value ? parseFloat(value) : undefined
                                }
                              }));
                            }}
                            className="w-32 pl-8 pr-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={service.precioBase.toString()}
                          />
                        </div>
                      </div>
                      {hasCustomPrice && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingClientPrices(prev => {
                              const newPrices = { ...prev.prices };
                              delete newPrices[service.id];
                              return { ...prev, prices: newPrices };
                            });
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {hasCustomPrice && (
                    <div className="text-sm">
                      <span className="text-gray-600">Precio final: </span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(customPrice)}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({customPrice > service.precioBase ? '+' : ''}{formatCurrency(customPrice - service.precioBase)} vs base)
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
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
              onClick={onSave}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Precios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}