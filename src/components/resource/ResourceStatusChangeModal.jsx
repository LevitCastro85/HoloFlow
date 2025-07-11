import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, RefreshCw, XCircle, Send } from 'lucide-react';
import { resourceStatusLabels } from '@/lib/resourceConstants';
import { toast } from '@/components/ui/use-toast';

const statusOptions = [
  { value: 'aprobado', label: resourceStatusLabels.aprobado, Icon: CheckCircle, color: 'text-green-500' },
  { value: 'necesita-cambios', label: resourceStatusLabels['necesita-cambios'], Icon: RefreshCw, color: 'text-orange-500' },
  { value: 'rechazado', label: resourceStatusLabels.rechazado, Icon: XCircle, color: 'text-red-500' },
];

export default function ResourceStatusChangeModal({ isOpen, onClose, onSubmit, resource }) {
  const [newStatus, setNewStatus] = useState('');
  const [observations, setObservations] = useState('');

  useEffect(() => {
    if (resource) {
      setNewStatus(resource.status);
      setObservations(resource.review_notes || '');
    }
  }, [resource]);

  if (!isOpen || !resource) return null;

  const requiresObservations = ['necesita-cambios', 'rechazado'].includes(newStatus);

  const handleSubmit = () => {
    if (requiresObservations && !observations.trim()) {
      toast({
        title: "Observaciones requeridas",
        description: "Debes añadir un comentario para enviar a revisión o rechazar.",
        variant: "destructive"
      });
      return;
    }
    onSubmit(resource.id, newStatus, observations);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar Estado del Recurso</DialogTitle>
          <DialogDescription>
            Gestiona la aprobación y el feedback para "{resource.nombre}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar nuevo estado
            </label>
            <div className="grid grid-cols-3 gap-2">
              {statusOptions.map(({ value, label, Icon, color }) => (
                <button
                  key={value}
                  onClick={() => setNewStatus(value)}
                  className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all ${newStatus === value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <Icon className={`w-6 h-6 mb-1 ${color}`} />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {(requiresObservations) && (
            <div>
              <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones (requerido)
              </label>
              <Textarea
                id="observations"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Añade feedback claro y constructivo para el colaborador..."
                rows={4}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={requiresObservations && !observations.trim()}>
            <Send className="w-4 h-4 mr-2" />
            Actualizar Estado
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}