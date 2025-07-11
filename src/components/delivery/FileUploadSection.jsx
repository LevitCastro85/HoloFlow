import React from 'react';
import { Upload, X, File } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FileUploadSection({ 
  uploadedFiles, 
  onFileUpload, 
  onRemoveFile,
  formatFileSize,
  getFileIcon 
}) {
  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-3">Subir Archivos</h4>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">Arrastra archivos aquí o haz clic para seleccionar</p>
        <input
          type="file"
          multiple
          onChange={onFileUpload}
          className="hidden"
          id="file-upload"
          accept="*/*"
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById('file-upload').click()}
        >
          Seleccionar Archivos
        </Button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h5 className="font-medium text-gray-900 mb-3">Archivos seleccionados</h5>
          <div className="space-y-2">
            {uploadedFiles.map(file => {
              const FileIcon = getFileIcon(file.name);
              return (
                <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFile(file.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}