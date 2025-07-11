import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Palette, Building2, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { brandsService, clientsService } from '@/lib/supabaseHelpers';
import { toast } from '@/components/ui/use-toast';

export default function BrandSelector({ onBrandSelect, searchPlaceholder = "Buscar marca..." }) {
  const [brands, setBrands] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBrands, setFilteredBrands] = useState([]);

  const loadData = async () => {
    try {
      const [clientsData, brandsData] = await Promise.all([
        clientsService.getAll(),
        brandsService.getAll()
      ]);
      setClients(clientsData || []);
      setBrands(brandsData || []);
      setFilteredBrands(brandsData || []);
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los datos.", variant: "destructive" });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredBrands(brands);
      return;
    }
    const searchLower = searchTerm.toLowerCase();
    const filtered = brands.filter(brand => {
      const client = clients.find(c => c.id === brand.client_id);
      return (
        brand.name.toLowerCase().includes(searchLower) ||
        (brand.industry && brand.industry.toLowerCase().includes(searchLower)) ||
        (client && client.name.toLowerCase().includes(searchLower))
      );
    });
    setFilteredBrands(filtered);
  }, [searchTerm, brands, clients]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="text-sm text-gray-600">
        {filteredBrands.length} marca{filteredBrands.length !== 1 ? 's' : ''} encontrada{filteredBrands.length !== 1 ? 's' : ''}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBrands.map((brand, index) => {
          const client = clients.find(c => c.id === brand.client_id);
          
          return (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border p-4 card-hover cursor-pointer"
              onClick={() => onBrandSelect(brand)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{brand.name}</h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {brand.industry}
                  </span>
                </div>
              </div>

              {client && (
                <div className="mb-3 p-2 bg-gray-50 rounded border">
                  <div className="flex items-center space-x-2 text-sm">
                    {client.client_type === 'empresa' ? (
                      <Building2 className="w-3 h-3 text-gray-600" />
                    ) : (
                      <User className="w-3 h-3 text-gray-600" />
                    )}
                    <span className="text-gray-600">{client.name}</span>
                  </div>
                </div>
              )}

              <div className="space-y-1 text-xs text-gray-600">
                {brand.website_url && (
                  <p>🌐 Sitio web configurado</p>
                )}
                {brand.manages_socials && (
                  <p>📱 Administramos redes sociales</p>
                )}
                {brand.internal_notes && (
                  <p className="line-clamp-1">📝 {brand.internal_notes}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredBrands.length === 0 && brands.length > 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron marcas</h3>
          <p className="text-gray-600 mb-6">Intenta ajustar tu búsqueda.</p>
          <Button variant="outline" onClick={() => setSearchTerm('')}>Limpiar búsqueda</Button>
        </div>
      )}

      {brands.length === 0 && (
        <div className="text-center py-12">
          <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay marcas registradas</h3>
          <p className="text-gray-600 mb-6">Registra marcas en el Brand Hub para crear tareas.</p>
          <Button><Plus className="w-4 h-4 mr-2" />Ir a Brand Hub</Button>
        </div>
      )}
    </div>
  );
}