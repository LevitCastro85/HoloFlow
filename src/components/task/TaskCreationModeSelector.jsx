import React from 'react';
import { motion } from 'framer-motion';
import BrandSelector from '@/components/task/BrandSelector';

export default function TaskCreationModeSelector({ brands, resources, onModeSelect }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">
          🎯 Selecciona la Marca para Continuar
        </h3>
        <p className="text-blue-700 text-sm">
          Primero selecciona la marca para la cual crearás las tareas. Después podrás elegir el tipo de tarea específico.
        </p>
      </div>

      <BrandSelector 
        onBrandSelect={(brand) => onModeSelect('brand-selected', brand)}
        searchPlaceholder="Buscar marca para crear tareas..."
      />
    </div>
  );
}