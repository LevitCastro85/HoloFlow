import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Plus,
  Users,
  CreditCard,
  Banknote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ClientForm from '@/components/client/ClientForm';
import ClientCard from '@/components/client/ClientCard';
import BrandControlModule from '@/components/brand/BrandControlModule';
import BrandingControlPanel from '@/components/branding/BrandingControlPanel';
import { clientsService } from '@/lib/services/clientsService';

const clientStatuses = {
  activo: { label: 'Activo', color: 'text-green-600', bgColor: 'bg-green-100' },
  pausado: { label: 'En pausa', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  suspendido: { label: 'Suspendido', color: 'text-red-600', bgColor: 'bg-red-100' }
};

export default function ClientsPanel() {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [showClientForm, setShowClientForm] = useState(false);
  const [viewMode, setViewMode] = useState('clients');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientsService.getAll();
      setClients(data || []);
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los clientes.", variant: "destructive" });
    }
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setShowClientForm(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowClientForm(true);
  };

  const handleSaveClient = async (clientData) => {
    try {
      if (clientData.id) {
        await clientsService.update(clientData.id, clientData);
      } else {
        await clientsService.create(clientData);
      }
      loadClients();
      setShowClientForm(false);
      setEditingClient(null);
      toast({ title: "Éxito", description: `Cliente ${clientData.id ? 'actualizado' : 'creado'} correctamente.` });
    } catch (error) {
        console.error("Error completo:", error); // Para verlo en consola

        const { message, code, details } = error || {};
        const fullMessage =
          message ||
          [code, details]
            .filter(Boolean)
            .join(' ') ||
          "No se pudo guardar el cliente.";

        toast({
          title: "Error",
          description: fullMessage,
          variant: "destructive",
        });
    }
  };

  const handleViewBrands = (client) => {
    setSelectedClient(client);
    setViewMode('brands');
  };

  const handleViewBranding = (client, brand) => {
    setSelectedClient(client);
    setSelectedBrand(brand);
    setViewMode('branding');
  };

  const handleBackToClients = () => {
    setViewMode('clients');
    setSelectedClient(null);
    setSelectedBrand(null);
  };

  const handleBackToBrands = () => {
    setViewMode('brands');
    setSelectedBrand(null);
  };

  if (showClientForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => setShowClientForm(false)}>
            ← Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h1>
            <p className="text-gray-600">Gestiona los datos generales del cliente</p>
          </div>
        </div>

        <ClientForm
          editingClient={editingClient}
          onSave={handleSaveClient}
          onCancel={() => setShowClientForm(false)}
        />
      </div>
    );
  }

  if (viewMode === 'brands' && selectedClient) {
    return (
      <BrandControlModule
        client={selectedClient}
        onBack={handleBackToClients}
        onViewBranding={handleViewBranding}
      />
    );
  }

  if (viewMode === 'branding' && selectedClient && selectedBrand) {
    return (
      <BrandingControlPanel
        client={selectedClient}
        brand={selectedBrand}
        onBack={handleBackToBrands}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600 mt-1">Administra clientes, marcas y su identidad visual</p>
        </div>
        
        <Button onClick={handleAddClient}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 border shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-2xl font-bold text-blue-600">{clients.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 border shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Empresas</p>
              <p className="text-2xl font-bold text-green-600">
                {clients.filter(c => c.client_type === 'empresa').length}
              </p>
            </div>
            <Building2 className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 border shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Con Factura</p>
              <p className="text-2xl font-bold text-purple-600">
                {clients.filter(c => c.requires_invoice).length}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 border shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-orange-600">
                {clients.filter(c => c.status === 'activo').length}
              </p>
            </div>
            <Banknote className="w-8 h-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client, index) => (
          <ClientCard
            key={client.id}
            client={client}
            index={index}
            onEdit={handleEditClient}
            onView={handleViewBrands}
          />
        ))}
      </div>
      
      {clients.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes registrados</h3>
          <p className="text-gray-600 mb-6">Agrega tu primer cliente para comenzar</p>
          <Button onClick={handleAddClient}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Primer Cliente
          </Button>
        </div>
      )}
    </div>
  );
}