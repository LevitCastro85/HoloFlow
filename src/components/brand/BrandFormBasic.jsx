import React, { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { clientsService } from '@/lib/services/clientsService';
import { toast } from '@/components/ui/use-toast';

const industries = [
  'Tecnología',
  'Salud y Bienestar',
  'Educación',
  'Retail y E-commerce',
  'Alimentación y Bebidas',
  'Moda y Belleza',
  'Deportes y Fitness',
  'Inmobiliaria',
  'Servicios Financieros',
  'Turismo y Hospitalidad',
  'Automotriz',
  'Entretenimiento',
  'Construcción',
  'Consultoría',
  'Otro'
];

export default function BrandFormBasic({ formData, errors, onInputChange }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientsService.getAll();
      setClients(data || []);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "No se pudieron cargar los clientes.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Palette className="w-5 h-5 mr-2 text-blue-600" />
        Brand Control - Datos Operativos
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cliente *
          </label>
          <select
            value={formData.client_id || ''}
            onChange={(e) => onInputChange('client_id', parseInt(e.target.value) || '')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.client_id ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="">
              {loading ? 'Cargando clientes...' : 'Seleccionar cliente'}
            </option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name} ({client.client_type})
              </option>
            ))}
          </select>
          {errors.client_id && (
            <p className="text-red-500 text-xs mt-1">{errors.client_id}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la marca *
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => onInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: SportXYZ"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industria o giro *
          </label>
          <select
            value={formData.industry || ''}
            onChange={(e) => onInputChange('industry', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.industry ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar industria</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          {errors.industry && (
            <p className="text-red-500 text-xs mt-1">{errors.industry}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sitio web
          </label>
          <input
            type="url"
            value={formData.website_url || ''}
            onChange={(e) => onInputChange('website_url', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.website_url ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://ejemplo.com"
          />
          {errors.website_url && (
            <p className="text-red-500 text-xs mt-1">{errors.website_url}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas internas
        </label>
        <textarea
          value={formData.internal_notes || ''}
          onChange={(e) => onInputChange('internal_notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Información adicional sobre la marca, estrategia, observaciones del equipo..."
        />
      </div>
    </div>
  );
}