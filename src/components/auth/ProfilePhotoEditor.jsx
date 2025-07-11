import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, Camera } from 'lucide-react';

export default function ProfilePhotoEditor({ onFileSelect, initialPreviewUrl }) {
  const [preview, setPreview] = useState(initialPreviewUrl || null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-32 h-32">
        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {preview ? (
            <img src={preview} alt="Vista previa de perfil" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <Button
          type="button"
          size="icon"
          className="absolute bottom-0 right-0 rounded-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="w-5 h-5" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}