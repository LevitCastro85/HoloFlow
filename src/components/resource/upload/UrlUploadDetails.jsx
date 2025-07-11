import React from 'react';

export default function UrlUploadDetails({ urlData, onUrlChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL del recurso *
        </label>
        <input
          type="url"
          name="url"
          value={urlData.url}
          onChange={onUrlChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://drive.google.com/..."
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plataforma
          </label>
          <select
            name="platform"
            value={urlData.platform}
            onChange={onUrlChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar...</option>
            <option value="Google Drive">Google Drive</option>
            <option value="Dropbox">Dropbox</option>
            <option value="OneDrive">OneDrive</option>
            <option value="WeTransfer">WeTransfer</option>
            <option value="Figma">Figma</option>
            <option value="Behance">Behance</option>
            <option value="YouTube">YouTube</option>
            <option value="Vimeo">Vimeo</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción del contenido
          </label>
          <input
            type="text"
            name="description"
            value={urlData.description}
            onChange={onUrlChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Diseños finales, Video..."
          />
        </div>
      </div>
    </div>
  );
}