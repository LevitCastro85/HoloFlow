import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link as LinkIcon, Search, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function TaskLinkModal({ isOpen, onClose, onSubmit, resource }) {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateNew, setShowCreateNew] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAvailableTasks();
    }
  }, [isOpen]);

  const loadAvailableTasks = () => {
    const savedTasks = localStorage.getItem('brandTasks');
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      const activeTasks = tasks.filter(task => 
        ['en-proceso', 'revision', 'en-fila', 'requiere-atencion'].includes(task.estado)
      );
      setAvailableTasks(activeTasks);
    }
  };

  const filteredTasks = availableTasks.filter(task =>
    task.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.marcaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.tipoContenido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (!selectedTaskId && !showCreateNew) {
      toast({
        title: "Selección requerida",
        description: "Debes seleccionar una tarea o crear una nueva.",
        variant: "destructive"
      });
      return;
    }

    if (showCreateNew) {
      onSubmit(resource.id, 'create-new');
    } else {
      const selectedTask = availableTasks.find(t => t.id == selectedTaskId);
      onSubmit(resource.id, selectedTaskId, selectedTask);
    }
  };

  if (!isOpen || !resource) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <LinkIcon className="w-5 h-5 text-blue-600" />
            <span>Vincular Recurso a Tarea</span>
          </DialogTitle>
          <DialogDescription>
            Conecta "{resource.nombre}" con una tarea existente o crea una nueva.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">📎 Recurso a vincular:</h4>
            <p className="text-blue-700 text-sm">
              <strong>{resource.nombre}</strong> - {resource.marca} ({resource.tipo})
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Seleccionar tarea existente</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateNew(!showCreateNew)}
                className={showCreateNew ? 'bg-green-50 border-green-300 text-green-700' : ''}
              >
                <Plus className="w-4 h-4 mr-1" />
                {showCreateNew ? 'Cancelar nueva tarea' : 'Crear nueva tarea'}
              </Button>
            </div>

            {!showCreateNew ? (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar tareas por título, marca o tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredTasks.length > 0 ? (
                    <div className="space-y-1 p-2">
                      {filteredTasks.map(task => (
                        <label
                          key={task.id}
                          className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedTaskId == task.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="selectedTask"
                            value={task.id}
                            checked={selectedTaskId == task.id}
                            onChange={(e) => setSelectedTaskId(e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">{task.titulo}</p>
                            <p className="text-sm text-gray-600">{task.marcaNombre} - {task.tipoContenido}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                              <span className={`px-2 py-1 rounded-full ${
                                task.estado === 'en-proceso' ? 'bg-blue-100 text-blue-700' :
                                task.estado === 'revision' ? 'bg-yellow-100 text-yellow-700' :
                                task.estado === 'en-fila' ? 'bg-gray-100 text-gray-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {task.estado}
                              </span>
                              <span>Entrega: {new Date(task.fechaEntrega).toLocaleDateString('es-ES')}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No se encontraron tareas activas</p>
                      <p className="text-sm">Intenta con otros términos de búsqueda</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">✨ Crear nueva tarea</h4>
                <p className="text-green-700 text-sm">
                  Se creará una nueva tarea usando este recurso como input. 
                  Podrás configurar todos los detalles en el siguiente paso.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedTaskId && !showCreateNew}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            {showCreateNew ? 'Crear Nueva Tarea' : 'Vincular a Tarea'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}