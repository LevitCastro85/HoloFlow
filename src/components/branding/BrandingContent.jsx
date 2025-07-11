import React from 'react';
import BrandingContentSections from '@/components/branding/BrandingContentSections';

export default function BrandingContent({ 
  activeSection, 
  brandingData, 
  isEditing, 
  handleInputChange, 
  handleSimpleInputChange,
  addColor,
  removeColor 
}) {
  return (
    <BrandingContentSections
      activeSection={activeSection}
      brandingData={brandingData}
      isEditing={isEditing}
      handleInputChange={handleInputChange}
      handleSimpleInputChange={handleSimpleInputChange}
      addColor={addColor}
      removeColor={removeColor}
    />
  );
}