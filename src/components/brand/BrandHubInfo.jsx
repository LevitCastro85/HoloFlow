import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Building2, Palette } from 'lucide-react';

export default function BrandHubInfo({ currentUser, canEdit }) {
  return (
    <div className="space-y-6">
      {/* Información de permisos */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Acceso al Brand Hub</h4>
            <div className="text-blue-800 text-sm mt-1 space-y-1">
              <p>• <strong>Todos los usuarios</strong> pueden consultar información de marcas y branding</p>
              <p>• <strong>Solo Director General y Supervisores</strong> pueden crear o editar contenido</p>
              <p>• <strong>Usuario actual:</strong> {currentUser?.name} ({currentUser?.role === 'director' ? 'Director General' : currentUser?.role === 'supervisor' ? 'Supervisor' : 'Creativo/Freelancer'})</p>
              <p>• <strong>Permisos:</strong> {canEdit ? 'Lectura y escritura' : 'Solo lectura'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Descripción de módulos */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 border shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Brand Control</h3>
              <p className="text-sm text-gray-600">Datos operativos por marca</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Nombre de la marca e industria/giro</p>
            <p>• Sitio web con validación de URL</p>
            <p>• Redes sociales (FB, IG, TikTok, LinkedIn, YouTube)</p>
            <p>• Checkbox: "La agencia administra esta red"</p>
            <p>• Notas internas del equipo</p>
            <p>• Link directo al Branding Control</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 border shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Palette className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Branding Control</h3>
              <p className="text-sm text-gray-600">Identidad visual y narrativa</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Brief general y slogan</p>
            <p>• Misión / Visión / Valores</p>
            <p>• Paleta de colores completa</p>
            <p>• Tipografías principales y secundarias</p>
            <p>• Logotipo y elementos gráficos</p>
            <p>• Ejemplos de estilo visual</p>
            <p>• Tono y estilo de comunicación</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}