import React from 'react';
import { motion } from 'framer-motion';
import { 
  Palette,
  Globe,
  Settings,
  Edit,
  Eye,
  Facebook,
  Instagram,
  Hash,
  Youtube,
  Linkedin,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building2,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BrandHubCard({ brand, client, index, canEdit, onEdit, onViewBranding }) {
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

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getUrlStatus = (url) => {
    if (!url) return { icon: XCircle, color: 'text-gray-400', label: 'No configurado' };
    if (validateUrl(url)) return { icon: CheckCircle, color: 'text-green-600', label: 'URL válida' };
    return { icon: AlertTriangle, color: 'text-yellow-600', label: 'Formato inválido' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  return (
    <motion.div
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
              <h3 className="text-lg font-semibold text-gray-900">{brand.name || 'Sin nombre'}</h3>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {brand.industry || 'Sin industria'}
                </span>
              </div>
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

        {client && (
          <div className="mb-4 p-3 bg-gray-50 rounded border">
            <div className="flex items-center space-x-2 text-sm">
              {client.client_type === 'empresa' ? (
                <Building2 className="w-4 h-4 text-gray-600" />
              ) : (
                <User className="w-4 h-4 text-gray-600" />
              )}
              <span className="font-medium text-gray-700">Cliente:</span>
              <span className="text-gray-600">{client.name}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {client.client_type === 'empresa' ? 'Empresa' : 'Persona física'} • 
              {client.status === 'activo' ? ' Activo' : ` ${client.status}`}
            </div>
          </div>
        )}
        
        {brand.website_url && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <Globe className="w-4 h-4 mr-2" />
                <span>Sitio web:</span>
              </div>
              {(() => {
                const status = getUrlStatus(brand.website_url);
                const StatusIcon = status.icon;
                return (
                  <div className={`flex items-center ${status.color}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    <span className="text-xs">{status.label}</span>
                  </div>
                );
              })()}
            </div>
            {validateUrl(brand.website_url) ? (
              <a 
                href={brand.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm truncate block"
              >
                {brand.website_url}
              </a>
            ) : (
              <span className="text-gray-500 text-sm">{brand.website_url}</span>
            )}
          </div>
        )}

        {brand.manages_socials && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Settings className="w-4 h-4 mr-1" />
              Redes administradas
            </h4>
            <div className="space-y-2">
              {brand.social_media_links && Object.entries(brand.social_media_links).filter(([_, value]) => value).map(([platform, value]) => {
                const Icon = getSocialIcon(platform);
                const status = getUrlStatus(value.startsWith('http') ? value : '');
                const StatusIcon = status.icon;
                
                return (
                  <div key={platform} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-3 h-3" />
                      <span className="capitalize font-medium">{platform}:</span>
                      <span className="text-gray-600 truncate max-w-24">{value}</span>
                    </div>
                    {value.startsWith('http') && (
                      <StatusIcon className={`w-3 h-3 ${status.color}`} />
                    )}
                  </div>
                );
              })}
              {!brand.social_media_links || !Object.values(brand.social_media_links).some(value => value) && (
                <p className="text-gray-500 text-xs">No hay redes configuradas</p>
              )}
            </div>
          </div>
        )}

        {brand.internal_notes && (
          <div className="mb-4 p-3 bg-gray-50 rounded border">
            <h5 className="text-xs font-medium text-gray-700 mb-1">Notas internas</h5>
            <p className="text-sm text-gray-600 line-clamp-2">{brand.internal_notes}</p>
          </div>
        )}
        
        <div className="space-y-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full"
            onClick={() => onViewBranding(brand)}
          >
            <Eye className="w-3 h-3 mr-1" />
            Branding Control
          </Button>
          
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => onEdit(brand)}
            disabled={!canEdit}
          >
            <Edit className="w-3 h-3 mr-1" />
            {canEdit ? 'Editar Brand Control' : 'Sin permisos para editar'}
          </Button>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Creada: {formatDate(brand.created_at)}</span>
            <span>ID: {brand.id}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}