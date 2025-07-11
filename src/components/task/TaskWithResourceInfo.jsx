import React from 'react';
import { FileText, Image, Video, Music, Archive, Link as LinkIcon } from 'lucide-react';

const fileTypeIcons = {
  image: Image,
  video: Video,
  audio: Music,
  document: FileText,
  archive: Archive,
  url: LinkIcon
};

const fileTypeColors = {
  image: 'bg-green-100 text-green-600',
  video: 'bg-purple-100 text-purple-600',
  audio: 'bg-blue-100 text-blue-600',
  document: 'bg-red-100 text-red-600',
  archive: 'bg-yellow-100 text-yellow-600',
  url: 'bg-indigo-100 text-indigo-600'
};

export default function TaskWithResourceInfo({ resource }) {
  const FileIcon = fileTypeIcons[resource.tipo] || FileText;

  return (
    <>
      {/* Información del recurso */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📎 Recurso de Input</h3>
        <div className="flex items-start space-x-4">
          <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${fileTypeColors[resource.tipo]}`}>
            <FileIcon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-2">{resource.nombre}</h4>
            <p className="text-sm text-gray-600 mb-2">{resource.descripcion}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Marca: {resource.marca}</span>
              <span>Tamaño: {resource.tamaño}</span>
              <span>Tipo: {resource.tipo}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {resource.tags.map(tag => (
                <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Información del modo */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 mb-2">
          🔗 Modo: Tarea con Recurso
        </h3>
        <p className="text-purple-700 text-sm">
          Esta tarea se creará usando "<strong>{resource.nombre}</strong>" como input. 
          El recurso quedará vinculado a la nueva tarea para trazabilidad completa.
        </p>
      </div>
    </>
  );
}