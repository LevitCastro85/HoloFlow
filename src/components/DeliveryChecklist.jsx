import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  X, 
  AlertTriangle,
  Eye,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const defaultChecklistItems = {
  reel: [
    { id: 'formato', label: 'Formato correcto (9:16, 1080x1920)', required: true },
    { id: 'duracion', label: 'Duración dentro del rango especificado', required: true },
    { id: 'logo', label: 'Logo de marca visible y bien posicionado', required: true },
    { id: 'calidad', label: 'Calidad de video HD sin pixelación', required: true },
    { id: 'audio', label: 'Audio claro y sin distorsión', required: true },
    { id: 'cta', label: 'Call-to-action incluido', required: false },
    { id: 'hashtags', label: 'Hashtags relevantes agregados', required: false }
  ],
  diseño: [
    { id: 'resolucion', label: 'Resolución correcta (300 DPI para impresión)', required: true },
    { id: 'colores', label: 'Colores dentro de la paleta de marca', required: true },
    { id: 'tipografia', label: 'Tipografías corporativas utilizadas', required: true },
    { id: 'logo', label: 'Logo aplicado correctamente', required: true },
    { id: 'ortografia', label: 'Ortografía y gramática revisadas', required: true },
    { id: 'formatos', label: 'Archivos en formatos solicitados', required: true },
    { id: 'margenes', label: 'Márgenes de seguridad respetados', required: false }
  ],
  fotografia: [
    { id: 'resolucion', label: 'Resolución mínima cumplida', required: true },
    { id: 'enfoque', label: 'Imágenes nítidas y bien enfocadas', required: true },
    { id: 'iluminacion', label: 'Iluminación adecuada', required: true },
    { id: 'composicion', label: 'Composición según brief', required: true },
    { id: 'edicion', label: 'Edición y retoque completados', required: true },
    { id: 'formatos', label: 'Entrega en formatos RAW y JPEG', required: true },
    { id: 'backup', label: 'Copias de seguridad creadas', required: false }
  ],
  copywriting: [
    { id: 'longitud', label: 'Longitud dentro del límite especificado', required: true },
    { id: 'tono', label: 'Tono acorde a la marca', required: true },
    { id: 'ortografia', label: 'Ortografía y gramática perfectas', required: true },
    { id: 'keywords', label: 'Keywords incluidas naturalmente', required: true },
    { id: 'cta', label: 'Call-to-action claro y persuasivo', required: true },
    { id: 'audiencia', label: 'Mensaje dirigido a la audiencia correcta', required: true },
    { id: 'seo', label: 'Optimización SEO aplicada', required: false }
  ],
  branding: [
    { id: 'coherencia', label: 'Coherencia con identidad de marca', required: true },
    { id: 'aplicaciones', label: 'Funciona en todas las aplicaciones', required: true },
    { id: 'escalabilidad', label: 'Escalable a diferentes tamaños', required: true },
    { id: 'legibilidad', label: 'Legible en diferentes fondos', required: true },
    { id: 'formatos', label: 'Entregado en formatos vectoriales', required: true },
    { id: 'manual', label: 'Manual de uso incluido', required: false },
    { id: 'variaciones', label: 'Variaciones necesarias creadas', required: false }
  ]
};

export default function DeliveryChecklist({ task, onComplete, onCancel }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [aiReviewResults, setAiReviewResults] = useState(null);
  const [isRunningAiReview, setIsRunningAiReview] = useState(false);

  const checklistItems = defaultChecklistItems[task.tipo] || defaultChecklistItems.diseño;

  const handleItemCheck = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const runAiReview = () => {
    setIsRunningAiReview(true);
    
    // Simular revisión IA
    setTimeout(() => {
      const mockResults = {
        resolucion: { status: 'pass', message: 'Resolución correcta: 1920x1080px' },
        colores: { status: 'warning', message: 'Color #FF5733 no está en la paleta de marca' },
        logo: { status: 'pass', message: 'Logo bien posicionado y visible' },
        texto: { status: 'fail', message: 'Texto cortado en la esquina inferior derecha' },
        formato: { status: 'pass', message: 'Formato de archivo correcto' }
      };
      
      setAiReviewResults(mockResults);
      setIsRunningAiReview(false);
    }, 3000);
  };

  const requiredItems = checklistItems.filter(item => item.required);
  const requiredChecked = requiredItems.filter(item => checkedItems[item.id]).length;
  const canComplete = requiredChecked === requiredItems.length;

  const handleComplete = () => {
    const checklistData = {
      items: checkedItems,
      aiReview: aiReviewResults,
      completedAt: new Date().toISOString(),
      completedBy: 'Usuario Actual' // En una app real, sería el usuario logueado
    };
    
    onComplete(checklistData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Checklist de Entrega</h2>
              <p className="text-gray-600 mt-1">{task.titulo} - {task.cliente}</p>
            </div>
            <Button variant="ghost" onClick={onCancel}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Revisión IA */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-purple-900">Revisión Asistida por IA</h3>
              <Button
                size="sm"
                onClick={runAiReview}
                disabled={isRunningAiReview}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isRunningAiReview ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analizando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Ejecutar Revisión IA
                  </>
                )}
              </Button>
            </div>
            
            {aiReviewResults && (
              <div className="space-y-2">
                {Object.entries(aiReviewResults).map(([key, result]) => (
                  <div key={key} className="flex items-center space-x-2 text-sm">
                    {result.status === 'pass' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {result.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                    {result.status === 'fail' && <X className="w-4 h-4 text-red-600" />}
                    <span className={
                      result.status === 'pass' ? 'text-green-700' :
                      result.status === 'warning' ? 'text-yellow-700' :
                      'text-red-700'
                    }>
                      {result.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checklist manual */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">
              Verificación Manual ({requiredChecked}/{requiredItems.length} obligatorios)
            </h3>
            
            <div className="space-y-3">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <button
                    onClick={() => handleItemCheck(item.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      checkedItems[item.id]
                        ? 'bg-green-600 border-green-600'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {checkedItems[item.id] && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </button>
                  
                  <label className="flex-1 text-sm text-gray-700 cursor-pointer">
                    {item.label}
                    {item.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Progreso */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progreso del checklist</span>
              <span>{Math.round((requiredChecked / requiredItems.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(requiredChecked / requiredItems.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleComplete}
            disabled={!canComplete}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Marcar como Entregado
          </Button>
        </div>
      </motion.div>
    </div>
  );
}