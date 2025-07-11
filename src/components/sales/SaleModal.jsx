import React, { useEffect, useState } from 'react';
import { Save, ShoppingCart, RefreshCw, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils';
import { clientsService, servicesService, clientPricesService } from '@/lib/supabaseHelpers';
import { toast } from '@/components/ui/use-toast';

export default function SaleModal({ 
  show, 
  onClose, 
  editingSale, 
  setEditingSale, 
  onSave, 
  clients: propClients, 
  services: propServices,
  frequencyConfig,
  periodTypeConfig
}) {
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [clientPrices, setClientPrices] = useState({});
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [showCustomPricing, setShowCustomPricing] = useState(false);

  const loadClients = async () => {
    setIsLoadingClients(true);
    try {
      const clientsData = await clientsService.getAll();
      const activeClients = (clientsData || []).filter(client => 
        client.status === 'activo' || client.status === 'active' || !client.status
      );
      setClients(activeClients);
    } catch (error) {
      toast({
        title: "Error al cargar clientes",
        description: "No se pudieron cargar los clientes desde la base de datos",
        variant: "destructive"
      });
      setClients(propClients || []);
    } finally {
      setIsLoadingClients(false);
    }
  };

  const loadServices = async () => {
    setIsLoadingServices(true);
    try {
      const servicesData = await servicesService.getAll();
      setServices(servicesData || []);
    } catch (error) {
      toast({
        title: "Error al cargar servicios",
        description: "No se pudieron cargar los servicios desde la base de datos",
        variant: "destructive"
      });
      setServices(propServices || []);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const loadClientPrices = async (clientId) => {
    try {
      const prices = await clientPricesService.getByClient(clientId);
      const pricesMap = {};
      prices.forEach(price => {
        pricesMap[price.service_id] = price.custom_price;
      });
      setClientPrices(pricesMap);
    } catch (error) {
      setClientPrices({});
    }
  };

  useEffect(() => {
    if (show) {
      loadClients();
      loadServices();
    }
  }, [show]);

  if (!editingSale) return null;

  const isEditing = editingSale.id && editingSale.clienteNombre;

  const handleClientChange = (clientId) => {
    const client = clients.find(c => c.id === parseInt(clientId));
    setEditingSale(prev => ({
      ...prev,
      clienteId: parseInt(clientId),
      clienteNombre: client ? client.name : ''
    }));
    
    if (clientId) {
      loadClientPrices(parseInt(clientId));
    }
  };

  const handleServiceChange = (serviceId) => {
    const service = services.find(s => s.id === parseInt(serviceId));
    const customPrice = clientPrices[parseInt(serviceId)];
    const finalPrice = customPrice || (service ? service.base_price : 0);
    
    setEditingSale(prev => ({
      ...prev,
      servicioId: parseInt(serviceId),
      servicioNombre: service ? service.name : '',
      precioFinal: finalPrice
    }));
  };

  const handleRefreshClients = () => {
    loadClients();
    toast({
      title: "Lista actualizada",
      description: "La lista de clientes se ha actualizada correctamente"
    });
  };

  const saveCustomPrice = async () => {
    if (!editingSale.clienteId || !editingSale.servicioId || !editingSale.precioFinal) return;
    
    try {
      await clientPricesService.upsert({
        client_id: editingSale.clienteId,
        service_id: editingSale.servicioId,
        custom_price: editingSale.precioFinal
      });
      
      setClientPrices(prev => ({
        ...prev,
        [editingSale.servicioId]: editingSale.precioFinal
      }));
      
      toast({
        title: "Precio personalizado guardado",
        description: "El precio se aplicará automáticamente en futuras ventas para este cliente"
      });
      
      setShowCustomPricing(false);
    } catch (error) {
      toast({
        title: "Error al guardar precio",
        description: "No se pudo guardar el precio personalizado",
        variant: "destructive"
      });
    }
  };

  const selectedService = services.find(s => s.id === editingSale.servicioId);
  const hasCustomPrice = clientPrices[editingSale.servicioId] !== undefined;
  const basePrice = selectedService?.base_price || 0;
  const customPrice = clientPrices[editingSale.servicioId];

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <span>{isEditing ? 'Editar Venta' : 'Nueva Venta'}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cliente *
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshClients}
                  disabled={isLoadingClients}
                  className="h-6 px-2 text-xs"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingClients ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <select
                value={editingSale.clienteId || ''}
                onChange={(e) => handleClientChange(e.target.value)}
                disabled={isLoadingClients}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">
                  {isLoadingClients ? 'Cargando clientes...' : 'Seleccionar cliente'}
                </option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} {client.client_type === 'empresa' ? '(Empresa)' : '(Persona)'}
                  </option>
                ))}
              </select>
              {clients.length === 0 && !isLoadingClients && (
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ No hay clientes activos. Registra clientes en el panel de Clientes.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servicio *
              </label>
              <select
                value={editingSale.servicioId || ''}
                onChange={(e) => handleServiceChange(e.target.value)}
                disabled={isLoadingServices}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">
                  {isLoadingServices ? 'Cargando servicios...' : 'Seleccionar servicio'}
                </option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {formatCurrency(service.base_price)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedService && editingSale.clienteId && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-3">Configuración de Precio</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Precio base del servicio:</span>
                  <span className="font-medium">{formatCurrency(basePrice)}</span>
                </div>
                
                {hasCustomPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Precio personalizado guardado:</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(customPrice)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-gray-600">Precio aplicado en esta venta:</span>
                  <span className="font-bold text-green-600">{formatCurrency(editingSale.precioFinal || 0)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Final *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editingSale.precioFinal || ''}
                  onChange={(e) => setEditingSale(prev => ({ ...prev, precioFinal: parseFloat(e.target.value) || 0 }))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  Precio editable por venta (descuentos, promociones, etc.)
                </p>
                {editingSale.clienteId && editingSale.servicioId && editingSale.precioFinal !== basePrice && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCustomPricing(true)}
                    className="text-xs"
                  >
                    <DollarSign className="w-3 h-3 mr-1" />
                    Guardar como precio personalizado
                  </Button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frecuencia *
              </label>
              <select
                value={editingSale.frecuencia || 'unica'}
                onChange={(e) => setEditingSale(prev => ({ ...prev, frecuencia: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(frequencyConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>

          {showCustomPricing && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">Guardar Precio Personalizado</h4>
              <p className="text-sm text-yellow-800 mb-3">
                ¿Deseas guardar ${editingSale.precioFinal} como precio personalizado para "{selectedService?.name}" 
                con el cliente "{editingSale.clienteNombre}"? Este precio se aplicará automáticamente en futuras ventas.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" onClick={saveCustomPrice}>
                  Sí, guardar precio personalizado
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowCustomPricing(false)}>
                  No, solo para esta venta
                </Button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                value={editingSale.fechaInicio || ''}
                onChange={(e) => setEditingSale(prev => ({ ...prev, fechaInicio: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Fin
              </label>
              <input
                type="date"
                value={editingSale.fechaFin || ''}
                onChange={(e) => setEditingSale(prev => ({ ...prev, fechaFin: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Opcional - Dejar vacío para contratos indeterminados
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Período *
            </label>
            <div className="grid md:grid-cols-3 gap-3">
              {Object.entries(periodTypeConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <label
                    key={key}
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      editingSale.tipoPeriodo === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoPeriodo"
                      value={key}
                      checked={editingSale.tipoPeriodo === key}
                      onChange={(e) => setEditingSale(prev => ({ ...prev, tipoPeriodo: e.target.value }))}
                      className="sr-only"
                    />
                    <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{config.label}</div>
                      <div className="text-xs text-gray-500">
                        {key === 'fijo' && 'Duración específica'}
                        {key === 'renovable' && 'Se puede renovar'}
                        {key === 'indeterminado' && 'Sin fecha límite'}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas u Observaciones
            </label>
            <textarea
              value={editingSale.notas || ''}
              onChange={(e) => setEditingSale(prev => ({ ...prev, notas: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detalles adicionales del contrato, condiciones especiales, etc."
            />
          </div>

          {editingSale.clienteNombre && editingSale.servicioNombre && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-3">Vista Previa del Contrato</h4>
              <div className="bg-white p-4 rounded border space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium">{editingSale.clienteNombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Servicio:</span>
                  <span className="font-medium">{editingSale.servicioNombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(editingSale.precioFinal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frecuencia:</span>
                  <span className="font-medium">{frequencyConfig[editingSale.frecuencia]?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Período:</span>
                  <span className="font-medium">{periodTypeConfig[editingSale.tipoPeriodo]?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duración:</span>
                  <span className="font-medium">
                    {editingSale.fechaInicio} {editingSale.fechaFin ? `- ${editingSale.fechaFin}` : '(Indeterminado)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
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
              disabled={!editingSale.clienteId || !editingSale.servicioId || !editingSale.precioFinal}
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Actualizar' : 'Registrar'} Venta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}