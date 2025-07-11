import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { XCircle, RefreshCw, Send } from 'lucide-react';

export default function ReviewActionModal({ isOpen, onClose, onSubmit, resource, action }) {
  const [observations, setObservations] = useState('');

  if (!isOpen || !resource) return null;

  const isReject = action === 'reject';
  const title = isReject ? 'Rechazar Recurso' : 'Enviar a Revisión';
  const description = isReject
    ? 'El recurso será marcado como "Rechazado" y se creará una tarea de corrección para el colaborador.'
    : 'El recurso será marcado como "En Revisión" y se creará una tarea de ajuste para el colaborador.';
  const Icon = isReject ? XCircle : RefreshCw;

  const handleSubmit = () => {
    if (!observations.trim()) {
      alert('Por favor, añade tus observaciones.');
      return;
    }
    onSubmit(resource.id, action, observations);
    setObservations('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Icon className={`w-6 h-6 ${isReject ? 'text-red-500' : 'text-orange-500'}`} />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h4 className="font-medium text-gray-800">{resource.nombre}</h4>
            <p className="text-sm text-gray-500">Subido por: {resource.submittedBy || 'N/A'}</p>
          </div>
          <div>
            <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones (requerido)
            </label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Añade feedback claro y constructivo para el colaborador..."
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} className={isReject ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'}>
            <Send className="w-4 h-4 mr-2" />
            Enviar Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}