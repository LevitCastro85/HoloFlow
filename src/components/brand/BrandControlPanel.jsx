import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Plus,
  Edit,
  Eye,
  Globe,
  Facebook,
  Instagram,
  Hash,
  Youtube,
  Linkedin,
  ExternalLink,
  Settings,
  Palette,
  ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import BrandForm from '@/components/brand/BrandForm';
import BrandTasksPanel from '@/components/task/BrandTasksPanel';
import { brandsService } from '@/lib/supabaseHelpers';

export default function BrandControlPanel({ client, onBack, onViewBranding }) {
  const [brands, setBrands] = useState([]);
  const [editingBrand, setEditingBrand] = useState(null);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [viewMode, setViewMode] = useState('brands'); // 'brands', 'tasks'
  const [selectedBrand, setSelectedBrand] = useState(null);

  const loadBrands = async () => {
    try {
      const data = await brandsService.getByClient(client.id);
      setBrands(data || []);
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar las marcas.", variant: "destructive" });
    }
  };

  useEffect(() => {
    loadBrands();
  }, [client.id]);

  const handleAddBrand = () => {
    setEditingBrand(null);
    setShowBrandForm(true);
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setShowBrandForm(true);
  };

  const handleSaveBrand = async (brandData) => {
    try {
      const dataToSave = { ...brandData, client_id: client.id };
      if (brandData.id) {
        await brandsService.update(brandData.id, dataToSave);
      } else {
        await brandsService.create(dataToSave);
      }
      loadBrands();
      setShowBrandForm(false);
      setEditingBrand(null);
      toast({ title: "Éxito", description: `Marca ${brandData.id ? 'actualizada' : 'creada'}.` });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo guardar la marca.", variant: "destructive" });
    }
  };

  const handleViewBranding = (brand) => {
    onViewBranding(client, brand);
  };

  const handleViewTasks = (brand) => {
    setSelectedBrand(brand);
    setViewMode('tasks');
  };

  const handleBackToBrands = () => {
    setViewMode('brands');
    setSelectedBrand(null);
  };

  if (showBrandForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => setShowBrandForm(false)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {editingBrand ? 'Editar Marca' : 'Nueva Marca'}
            </h1>
            <p className="text-gray-600">Cliente: {client.name}</p>
          </div>
        </div>

        <BrandForm
          editingBrand={editingBrand}
          onSave={handleSaveBrand}
          onCancel={() => setShowBrandForm(false)}
        />
      </div>
    );
  }

  if (viewMode === 'tasks' && selectedBrand) {
    return (
      <BrandTasksPanel
        brand={selectedBrand}
        client={client}
        onBack={handleBackToBrands}
        onViewBranding={() => handleViewBranding(selectedBrand)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Clientes
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brand Control</h1>
            <p className="text-gray-600">Cliente: {client.name}</p>
          </div>
        </div>
        
        <Button onClick={handleAddBrand}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Marca
        </Button>
      </div>

      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Tipo:</span>
            <span className="font-medium ml-2 capitalize">{client.client_type}</span>
          </div>
          <div>
            <span className="text-gray-600">Facturación:</span>
            <span className={`font-medium ml-2 ${client.requires_invoice ? 'text-green-600' : 'text-gray-600'}`}>
              {client.requires_invoice ? 'Con factura' : 'Sin factura'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Método de pago:</span>
            <span className="font-medium ml-2 capitalize">{client.payment_method}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand, index) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border overflow-hidden card-hover"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Palette className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {brand.industry}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {brand.manages_socials && (
                    <Settings className="w-4 h-4 text-green-600" title="Administra redes sociales" />
                  )}
                  {brand.website_url && (
                    <Globe className="w-4 h-4 text-blue-600" title="Tiene sitio web" />
                  )}
                </div>
              </div>
              
              {brand.website_url && (
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="w-4 h-4 mr-2" />
                    <a 
                      href={brand.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {brand.website_url}
                    </a>
                  </div>
                </div>
              )}

              {brand.manages_socials && Object.values(brand.social_media_links || {}).some(value => value) && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Redes sociales administradas</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(brand.social_media_links || {}).filter(([_, value]) => value).map(([platform, value]) => {
                      const getSocialIcon = (platform) => {
                        switch (platform) {
                          case 'facebook': return Facebook;
                          case 'instagram': return Instagram;
                          case 'youtube': return Youtube;
                          case 'tiktok': return Hash;
                          case 'linkedin': return Linkedin;
                          default: return ExternalLink;
                        }
                      };
                      const Icon = getSocialIcon(platform);
                      return (
                        <div key={platform} className="flex items-center space-x-1 text-xs bg-gray-100 px-2 py-1 rounded">
                          <Icon className="w-3 h-3" />
                          <span className="capitalize">{platform}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {brand.internal_notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded border">
                  <p className="text-sm text-gray-600 line-clamp-2">{brand.internal_notes}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleViewTasks(brand)}
                >
                  <ClipboardList className="w-3 h-3 mr-1" />
                  Tareas
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleViewBranding(brand)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Branding
                </Button>
                <Button 
                  size="sm" 
                  className="w-full col-span-2"
                  onClick={() => handleEditBrand(brand)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Editar Marca
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {brands.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Palette className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay marcas registradas</h3>
          <p className="text-gray-600 mb-6">Agrega la primera marca para este cliente</p>
          <Button onClick={handleAddBrand}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Primera Marca
          </Button>
        </div>
      )}
    </div>
  );
}