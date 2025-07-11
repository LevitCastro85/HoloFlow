import React from 'react';
import { Upload, FileText } from 'lucide-react';

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function FileUploadDetails({ files, onFileChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Seleccionar archivos *
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          multiple
          onChange={onFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">
            Haz clic para seleccionar o arrastra aquí
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Soporta múltiples archivos
          </p>
        </label>
      </div>
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Archivos seleccionados ({files.length}):
          </p>
          {files.map((file, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <FileText className="w-4 h-4" />
              <span>{file.name}</span>
              <span className="text-gray-500">({formatFileSize(file.size)})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}