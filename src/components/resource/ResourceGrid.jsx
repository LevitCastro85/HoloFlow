import React from 'react';
import { Archive } from 'lucide-react';
import ResourceCard from '@/components/resource/ResourceCard';

export default function ResourceGrid({ 
  filteredResources, 
  searchTerm, 
  filters, 
  onUseAsInput, 
  onResourceAction 
}) {
  if (filteredResources.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Archive className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {searchTerm || Object.values(filters).some(f => f) ? 'No se encontraron recursos' : 'No hay recursos guardados'}
        </h3>
        <p className="text-gray-600">
          {searchTerm || Object.values(filters).some(f => f) ? 'Intenta con otros términos de búsqueda' : 'Los recursos aparecerán aquí automáticamente'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredResources.map((resource, index) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          index={index}
          onUseAsInput={onUseAsInput}
          onResourceAction={onResourceAction}
        />
      ))}
    </div>
  );
}