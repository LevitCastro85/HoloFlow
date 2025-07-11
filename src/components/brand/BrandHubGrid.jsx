import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandHubCard from '@/components/brand/BrandHubCard';

export default function BrandHubGrid({ 
  brands, 
  clients,
  canEdit, 
  onEditBrand, 
  onViewBranding, 
  onAddBrand 
}) {
  if (brands.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Palette className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay marcas registradas</h3>
        <p className="text-gray-600 mb-6">
          {canEdit 
            ? 'Agrega la primera marca para comenzar a gestionar su identidad' 
            : 'No hay marcas disponibles para consultar'
          }
        </p>
        {canEdit && (
          <Button onClick={onAddBrand}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Primera Marca
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {brands.map((brand, index) => {
        const client = clients.find(c => c.id === brand.client_id);
        return (
          <BrandHubCard
            key={brand.id}
            brand={brand}
            client={client}
            index={index}
            canEdit={canEdit}
            onEdit={onEditBrand}
            onViewBranding={onViewBranding}
          />
        );
      })}
    </div>
  );
}