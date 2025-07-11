import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  X, 
  Clock,
  Award,
  Heart,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FreelancerEvaluation({ task, onComplete, onCancel }) {
  const [evaluation, setEvaluation] = useState({
    tiempo: 0,
    calidad: 0,
    actitud: 0,
    comentarios: '',
    recomendaria: true
  });

  const handleStarClick = (category, rating) => {
    setEvaluation(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleSubmit = () => {
    if (evaluation.tiempo === 0 || evaluation.calidad === 0 || evaluation.actitud === 0) {
      return;
    }
    
    onComplete(evaluation);
  };

  const StarRating = ({ category, value, label, icon: Icon, color }) => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleStarClick(category, star)}
            className="transition-colors"
          >
            <Star
              className={`w-6 h-6 ${
                star <= value
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      <div className="text-sm text-gray-600">
        {value === 0 && 'Sin calificar'}
        {value === 1 && 'Muy malo'}
        {value === 2 && 'Malo'}
        {value === 3 && 'Regular'}
        {value === 4 && 'Bueno'}
        {value === 5 && 'Excelente'}
      </div>
    </div>
  );

  const isComplete = evaluation.tiempo > 0 && evaluation.calidad > 0 && evaluation.actitud > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Evaluar Freelancer</h2>
              <p className="text-gray-600 mt-1">{task.responsable}</p>
              <p className="text-sm text-gray-500">{task.titulo}</p>
            </div>
            <Button variant="ghost" onClick={onCancel}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <StarRating
            category="tiempo"
            value={evaluation.tiempo}
            label="Cumplimiento de Tiempos"
            icon={Clock}
            color="text-blue-600"
          />

          <StarRating
            category="calidad"
            value={evaluation.calidad}
            label="Calidad del Trabajo"
            icon={Award}
            color="text-green-600"
          />

          <StarRating
            category="actitud"
            value={evaluation.actitud}
            label="Actitud y Comunicación"
            icon={Heart}
            color="text-purple-600"
          />

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-900">Comentarios Adicionales</span>
            </label>
            <textarea
              value={evaluation.comentarios}
              onChange={(e) => setEvaluation(prev => ({ ...prev, comentarios: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Comparte detalles sobre el desempeño del freelancer..."
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="recomendaria"
              checked={evaluation.recomendaria}
              onChange={(e) => setEvaluation(prev => ({ ...prev, recomendaria: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="recomendaria" className="text-sm text-gray-700">
              Recomendaría este freelancer para futuros proyectos
            </label>
          </div>

          {isComplete && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">
                  Calificación promedio: {((evaluation.tiempo + evaluation.calidad + evaluation.actitud) / 3).toFixed(1)}/5
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isComplete}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Star className="w-4 h-4 mr-2" />
            Guardar Evaluación
          </Button>
        </div>
      </motion.div>
    </div>
  );
}