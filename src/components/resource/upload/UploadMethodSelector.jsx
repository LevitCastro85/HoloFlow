import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Link as LinkIcon } from 'lucide-react';

export default function UploadMethodSelector({ deliveryMethod, setDeliveryMethod }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Método de entrega *
      </label>
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
            deliveryMethod === 'file'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setDeliveryMethod('file')}
        >
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="deliveryMethod"
              value="file"
              checked={deliveryMethod === 'file'}
              onChange={() => setDeliveryMethod('file')}
              className="text-blue-600"
            />
            <Upload className="w-5 h-5 text-gray-600" />
            <div>
              <h4 className="font-medium text-gray-900">Subir Archivo</h4>
              <p className="text-sm text-gray-600">Cargar desde tu dispositivo</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
            deliveryMethod === 'url'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setDeliveryMethod('url')}
        >
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="deliveryMethod"
              value="url"
              checked={deliveryMethod === 'url'}
              onChange={() => setDeliveryMethod('url')}
              className="text-blue-600"
            />
            <LinkIcon className="w-5 h-5 text-gray-600" />
            <div>
              <h4 className="font-medium text-gray-900">Compartir Enlace</h4>
              <p className="text-sm text-gray-600">URL de Drive, Figma, etc.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}