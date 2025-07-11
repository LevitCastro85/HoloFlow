import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings,
  Facebook,
  Instagram,
  Hash,
  Youtube,
  Linkedin,
  ExternalLink
} from 'lucide-react';

export default function BrandFormSocial({ formData, errors, onInputChange, onSocialChange }) {
  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-600" />
          Redes Sociales
        </h3>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.administraRedes}
            onChange={(e) => onInputChange('administraRedes', e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded"
          />
          <span className="font-medium text-gray-700">¿La agencia administra las redes?</span>
        </label>
      </div>

      {formData.administraRedes && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4"
        >
          <p className="text-sm text-gray-600 mb-4">
            Configura las redes sociales que administra la agencia. Puedes ingresar URLs completas o nombres de usuario (@usuario)
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Facebook className="w-4 h-4 inline mr-2 text-blue-600" />
                Facebook
              </label>
              <input
                type="text"
                value={formData.redesSociales.facebook}
                onChange={(e) => onSocialChange('facebook', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.facebook ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="@usuario o https://facebook.com/usuario"
              />
              {errors.facebook && (
                <p className="text-red-500 text-xs mt-1">{errors.facebook}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Instagram className="w-4 h-4 inline mr-2 text-pink-600" />
                Instagram
              </label>
              <input
                type="text"
                value={formData.redesSociales.instagram}
                onChange={(e) => onSocialChange('instagram', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.instagram ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="@usuario o https://instagram.com/usuario"
              />
              {errors.instagram && (
                <p className="text-red-500 text-xs mt-1">{errors.instagram}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-2 text-black" />
                TikTok
              </label>
              <input
                type="text"
                value={formData.redesSociales.tiktok}
                onChange={(e) => onSocialChange('tiktok', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.tiktok ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="@usuario o https://tiktok.com/@usuario"
              />
              {errors.tiktok && (
                <p className="text-red-500 text-xs mt-1">{errors.tiktok}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Youtube className="w-4 h-4 inline mr-2 text-red-600" />
                YouTube
              </label>
              <input
                type="text"
                value={formData.redesSociales.youtube}
                onChange={(e) => onSocialChange('youtube', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.youtube ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Canal o https://youtube.com/c/canal"
              />
              {errors.youtube && (
                <p className="text-red-500 text-xs mt-1">{errors.youtube}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Linkedin className="w-4 h-4 inline mr-2 text-blue-700" />
                LinkedIn
              </label>
              <input
                type="text"
                value={formData.redesSociales.linkedin}
                onChange={(e) => onSocialChange('linkedin', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.linkedin ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Empresa o https://linkedin.com/company/empresa"
              />
              {errors.linkedin && (
                <p className="text-red-500 text-xs mt-1">{errors.linkedin}</p>
              )}
            </div>
          </div>

          {/* Vista previa de redes */}
          <div className="bg-gray-50 p-4 rounded-lg border mt-4">
            <h5 className="font-medium text-gray-900 mb-3">Redes configuradas</h5>
            <div className="space-y-2">
              {formData.redesSociales.facebook && (
                <div className="flex items-center space-x-2 text-sm">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600">Facebook:</span>
                  <span className="font-medium">{formData.redesSociales.facebook}</span>
                </div>
              )}
              {formData.redesSociales.instagram && (
                <div className="flex items-center space-x-2 text-sm">
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span className="text-gray-600">Instagram:</span>
                  <span className="font-medium">{formData.redesSociales.instagram}</span>
                </div>
              )}
              {formData.redesSociales.tiktok && (
                <div className="flex items-center space-x-2 text-sm">
                  <Hash className="w-4 h-4 text-black" />
                  <span className="text-gray-600">TikTok:</span>
                  <span className="font-medium">{formData.redesSociales.tiktok}</span>
                </div>
              )}
              {formData.redesSociales.youtube && (
                <div className="flex items-center space-x-2 text-sm">
                  <Youtube className="w-4 h-4 text-red-600" />
                  <span className="text-gray-600">YouTube:</span>
                  <span className="font-medium">{formData.redesSociales.youtube}</span>
                </div>
              )}
              {formData.redesSociales.linkedin && (
                <div className="flex items-center space-x-2 text-sm">
                  <Linkedin className="w-4 h-4 text-blue-700" />
                  <span className="text-gray-600">LinkedIn:</span>
                  <span className="font-medium">{formData.redesSociales.linkedin}</span>
                </div>
              )}
              {!Object.values(formData.redesSociales).some(value => value) && (
                <p className="text-gray-500 text-sm">No hay redes sociales configuradas</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}