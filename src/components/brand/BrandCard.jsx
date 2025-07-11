import React from 'react';
import { motion } from 'framer-motion';
import { 
  Palette,
  Globe,
  Facebook,
  Instagram,
  Hash,
  Youtube,
  Linkedin,
  Edit,
  Eye,
  Settings,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BrandCard({ brand, index, onEdit, onViewBranding }) {
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

  const activeSocials = Object.entries(brand.redesSociales || {}).filter(([_, value]) => value);

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
        
        {brand.sitioWeb && (
          <div className="mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Globe className="w-4 h-4 mr-2" />
              <a 
                href={brand.sitioWeb} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {brand.sitioWeb}
              </a>
            </div>
          </div>
        )}

        {brand.administraRedes && activeSocials.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Redes sociales administradas</h4>
            <div className="flex flex-wrap gap-2">
              {activeSocials.map(([platform, value]) => {
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

        {brand.notasInternas && (
          <div className="mb-4 p-3 bg-gray-50 rounded border">
            <p className="text-sm text-gray-600 line-clamp-2">{brand.notasInternas}</p>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewBranding(brand)}
          >
            <Eye className="w-3 h-3 mr-1" />
            Branding Control
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit(brand)}
          >
            <Edit className="w-3 h-3 mr-1" />
            Editar
          </Button>
        </div>
      </div>
    </motion.div>
  );
}