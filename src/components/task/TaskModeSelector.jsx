import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, ToggleRight, Palette, Building2, User, Clock, Users, Target, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TaskModeSelector({ brand, client, onModeSelect, onBack }) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header con información de la marca */}
      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a marcas
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{brand.nombre}</h2>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {brand.industria}
                  </span>
                  {client && (
                    <div className="flex items-center space-x-1">
                      {client.tipoCliente === 'empresa' ? (
                        <Building2 className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      <span>{client.nombre}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información del flujo */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">
          🎯 Elige el Modo de Creación
        </h3>
        <p className="text-green-700 text-sm">
          Ahora puedes elegir libremente cómo crear las tareas para <strong>{brand.nombre}</strong>. 
          Selecciona el modo que mejor se adapte a tu trabajo actual.
        </p>
      </div>

      {/* Selector de modo - Ahora con 3 opciones */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Modo Individual */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border p-6 card-hover cursor-pointer"
          onClick={() => onModeSelect('individual')}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Tarea Individual</h3>
            <p className="text-gray-600 mb-6">
              Crea una sola tarea con formulario completo. Ideal para solicitudes espontáneas o proyectos únicos.
            </p>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Creación rápida y directa</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <Target className="w-4 h-4 text-blue-600" />
                <span>Formulario completo en una vista</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Perfecto para urgencias</span>
              </div>
            </div>
            
            <Button className="w-full mt-6" onClick={() => onModeSelect('individual')}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Tarea Individual
            </Button>
          </div>
        </motion.div>

        {/* Modo Masivo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border p-6 card-hover cursor-pointer"
          onClick={() => onModeSelect('bulk')}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ToggleRight className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Modo Masivo</h3>
            <p className="text-gray-600 mb-6">
              Crea múltiples tareas seguidas para la misma marca. Perfecto para calendarios editoriales y campañas.
            </p>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Hasta 10 tareas por lote</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <Target className="w-4 h-4 text-purple-600" />
                <span>Tabla editable para eficiencia</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>Ideal para planificación</span>
              </div>
            </div>
            
            <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700" onClick={() => onModeSelect('bulk')}>
              <ToggleRight className="w-4 h-4 mr-2" />
              Usar Modo Masivo
            </Button>
          </div>
        </motion.div>

        {/* Tarea con Recurso */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border p-6 card-hover"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LinkIcon className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Tarea con Recurso</h3>
            <p className="text-gray-600 mb-6">
              Crea una nueva tarea usando un recurso existente como input. Disponible desde el Banco de Recursos.
            </p>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <LinkIcon className="w-4 h-4 text-green-600" />
                <span>Usa recursos como input</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <Target className="w-4 h-4 text-green-600" />
                <span>Trazabilidad completa</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <Plus className="w-4 h-4 text-green-600" />
                <span>Tareas concatenadas</span>
              </div>
            </div>
            
            <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium mb-2">💡 Disponible en Banco de Recursos</p>
              <p className="text-xs text-green-700">
                Ve al Banco de Recursos y haz clic en "Usar como Input" en cualquier recurso aprobado.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Información adicional */}
      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">💡 ¿Cuándo usar cada modo?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-blue-900 mb-2 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Tarea Individual
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Solicitudes urgentes del cliente</li>
              <li>• Proyectos únicos o especiales</li>
              <li>• Cuando necesitas completar todos los detalles</li>
              <li>• Tareas con archivos específicos</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-purple-900 mb-2 flex items-center">
              <ToggleRight className="w-4 h-4 mr-2" />
              Modo Masivo
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Calendarios editoriales mensuales</li>
              <li>• Campañas con múltiples piezas</li>
              <li>• Planificación de contenido semanal</li>
              <li>• Cuando tienes una lista de tareas similares</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-green-900 mb-2 flex items-center">
              <LinkIcon className="w-4 h-4 mr-2" />
              Tarea con Recurso
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Adaptaciones de diseños existentes</li>
              <li>• Versiones para diferentes formatos</li>
              <li>• Cuando una entrega da pie a otra tarea</li>
              <li>• Reutilización de elementos aprobados</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Información de la marca seleccionada */}
      <div className="bg-gray-50 rounded-lg p-4 border">
        <h4 className="font-medium text-gray-900 mb-3">📋 Información de la marca seleccionada</h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Marca:</span>
            <p className="text-gray-600">{brand.nombre}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Industria:</span>
            <p className="text-gray-600">{brand.industria}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Cliente:</span>
            <p className="text-gray-600">{client?.nombre || 'No especificado'}</p>
          </div>
          {brand.sitioWeb && (
            <div>
              <span className="font-medium text-gray-700">Sitio web:</span>
              <p className="text-gray-600 truncate">{brand.sitioWeb}</p>
            </div>
          )}
          {brand.administraRedes && (
            <div>
              <span className="font-medium text-gray-700">Redes sociales:</span>
              <p className="text-gray-600">Administradas por la agencia</p>
            </div>
          )}
          {brand.notasInternas && (
            <div className="md:col-span-3">
              <span className="font-medium text-gray-700">Notas internas:</span>
              <p className="text-gray-600">{brand.notasInternas}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}