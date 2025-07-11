import React from 'react';
import { motion } from 'framer-motion';
import { 
  Palette,
  Globe,
  Settings,
  Edit,
  Eye,
  ClipboardList,
  Facebook,
  Instagram,
  Hash,
  Youtube,
  Linkedin,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function BrandControlCard({ brand, index, canEdit, onEdit, onViewBranding }) {
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

  const handleViewTasks = () => {
    toast({
      title: "🚧 Tareas por marca",
      description: "Esta funcionalidad se conectará con el motor de producción"
    });
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
              <h3 className="text-lg font-semibold text-gray-900">{brand.nombre}</h3>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                {brand.industria}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {brand.administraRedes && (
              <Settings className="w-4 h-4 text-green-600" title="Administra redes sociales" />
            )}
            {brand.sitioWeb && (
              <Globe className="w-4 h-4 text-blue-600" title="Tiene sitio web" />
            )}
          </div>
        </div>
        
        {/* Sitio web */}
        {brand.sitioWeb && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <Globe className="w-4 h-4 mr-2" />
                <span>Sitio web:</span>
              </div>
              {(() => {
                const status = getUrlStatus(brand.sitioWeb);
                const StatusIcon = status.icon;
                return (
                  <div className={`flex items-center ${status.color}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    <span className="text-xs">{status.label}</span>
                  </div>
                );
              })()}
            </div>
            {validateUrl(brand.sitioWeb) ? (
              <a 
                href={brand.sitioWeb} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm truncate block"
              >
                {brand.sitioWeb}
              </a>
            ) : (
              <span className="text-gray-500 text-sm">{brand.sitioWeb}</span>
            )}
          </div>
        )}

        {/* Redes sociales */}
        {brand.administraRedes && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Settings className="w-4 h-4 mr-1" />
              Redes administradas
            </h4>
            <div className="space-y-2">
              {Object.entries(brand.redesSociales || {}).filter(([_, value]) => value).map(([platform, value]) => {
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
              {!Object.values(brand.redesSociales || {}).some(value => value) && (
                <p className="text-gray-500 text-xs">No hay redes configuradas</p>
              )}
            </div>
          </div>
        )}

        {/* Notas internas */}
        {brand.notasInternas && (
          <div className="mb-4 p-3 bg-gray-50 rounded border">
            <h5 className="text-xs font-medium text-gray-700 mb-1">Notas internas</h5>
            <p className="text-sm text-gray-600 line-clamp-2">{brand.notasInternas}</p>
          </div>
        )}
        
        {/* Botones de acción */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
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
              variant="outline" 
              className="w-full"
              onClick={handleViewTasks}
            >
              <ClipboardList className="w-3 h-3 mr-1" />
              Tareas
            </Button>
          </div>
          
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => onEdit(brand)}
            disabled={!canEdit}
          >
            <Edit className="w-3 h-3 mr-1" />
            {canEdit ? 'Editar Marca' : 'Sin permisos para editar'}
          </Button>
        </div>

        {/* Información adicional */}
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Creada: {new Date(brand.fechaCreacion).toLocaleDateString('es-ES')}</span>
            <span>ID: {brand.id}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}