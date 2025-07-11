import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Type, MessageSquare, Image, Target, Eye } from 'lucide-react';
import BrandingIdentity from '@/components/branding/BrandingIdentity';
import BrandingColors from '@/components/branding/BrandingColors';
import BrandingTypography from '@/components/branding/BrandingTypography';
import BrandingLogo from '@/components/branding/BrandingLogo';
import BrandingElements from '@/components/branding/BrandingElements';
import BrandingPhotoLibrary from '@/components/branding/BrandingPhotoLibrary';
import BrandingVisualStyle from '@/components/branding/BrandingVisualStyle';
import BrandingCommunication from '@/components/branding/BrandingCommunication';

export default function BrandingContentSections({ 
  activeSection, 
  brandingData, 
  isEditing, 
  handleInputChange, 
  handleSimpleInputChange,
  addColor,
  removeColor 
}) {
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'brief':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Brief General</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brief general de la marca
              </label>
              <textarea
                value={brandingData.briefGeneral}
                onChange={(e) => handleSimpleInputChange('briefGeneral', e.target.value)}
                disabled={!isEditing}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Describe la marca, su propósito, público objetivo, posicionamiento en el mercado..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slogan o Tagline
              </label>
              <input
                type="text"
                value={brandingData.slogan}
                onChange={(e) => handleSimpleInputChange('slogan', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Frase representativa de la marca"
              />
            </div>
          </motion.div>
        );

      case 'identidad':
        return (
          <BrandingIdentity
            brandingData={brandingData}
            handleSimpleInputChange={handleSimpleInputChange}
            isEditing={isEditing}
          />
        );

      case 'colores':
        return (
          <BrandingColors
            brandingData={brandingData}
            handleInputChange={handleInputChange}
            addColor={addColor}
            removeColor={removeColor}
            isEditing={isEditing}
          />
        );

      case 'tipografia':
        return (
          <BrandingTypography
            brandingData={brandingData}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
          />
        );

      case 'logotipo':
        return (
          <BrandingLogo
            brandingData={brandingData}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
          />
        );

      case 'elementos':
        return (
          <BrandingElements
            brandingData={brandingData}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
          />
        );

      case 'biblioteca':
        return (
          <BrandingPhotoLibrary
            brandingData={brandingData}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
          />
        );

      case 'estilo':
        return (
          <BrandingVisualStyle
            brandingData={brandingData}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
          />
        );

      case 'comunicacion':
        return (
          <BrandingCommunication
            brandingData={brandingData}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
          />
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sección en desarrollo</h3>
            <p className="text-gray-600">Esta sección estará disponible próximamente</p>
          </motion.div>
        );
    }
  };

  return renderSectionContent();
}