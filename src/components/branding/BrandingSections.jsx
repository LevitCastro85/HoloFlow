import React from 'react';
import { 
  FileText,
  Heart,
  Palette,
  Type,
  Image,
  Target,
  Eye,
  MessageSquare,
  Camera
} from 'lucide-react';

export const brandingSections = [
  { id: 'brief', label: 'Brief General', icon: FileText },
  { id: 'identidad', label: 'Identidad', icon: Heart },
  { id: 'colores', label: 'Paleta de Colores', icon: Palette },
  { id: 'tipografia', label: 'Tipografías', icon: Type },
  { id: 'logotipo', label: 'Logotipo', icon: Image },
  { id: 'elementos', label: 'Elementos Gráficos', icon: Target },
  { id: 'biblioteca', label: 'Biblioteca Fotográfica', icon: Camera },
  { id: 'estilo', label: 'Estilo Visual', icon: Eye },
  { id: 'comunicacion', label: 'Tono de Comunicación', icon: MessageSquare }
];

export default function BrandingSections({ activeSection, onSectionChange }) {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Secciones</h3>
      <nav className="space-y-2">
        {brandingSections.map(section => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}