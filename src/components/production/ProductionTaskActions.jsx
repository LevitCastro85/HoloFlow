import React, { useState } from 'react';
import { Calendar, UserCheck, Copy, ExternalLink, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

export default function ProductionTaskActions({
  task,
  collaborators,
  onReschedule,
  onReassign,
  onDuplicate,
  onOpenBranding,
  onCancelTask,
}) {
  const [showReschedule, setShowReschedule] = useState(false);
  const [showReassign, setShowReassign] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  
  const [newDate, setNewDate] = useState(task.due_date || '');
  const [newResponsible, setNewResponsible] = useState(task.assigned_to || '');
  const [cancelReason, setCancelReason] = useState('');

  const handleReschedule = () => {
    onReschedule(newDate);
    setShowReschedule(false);
  };

  const handleReassign = () => {
    onReassign(newResponsible);
    setShowReassign(false);
  };

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      toast({
        title: "Motivo requerido",
        description: "Por favor, escribe un motivo para cancelar la tarea.",
        variant: "destructive",
      });
      return;
    }
    onCancelTask(cancelReason);
    setShowCancel(false);
    setCancelReason('');
  };

  return (
    <div className="flex space-x-1">
      <Dialog open={showReschedule} onOpenChange={setShowReschedule}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
            title="Reprogramar fecha"
          >
            <Calendar className="w-3 h-3" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprogramar Tarea</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva fecha de entrega
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReschedule(false)}>
                Cancelar
              </Button>
              <Button onClick={handleReschedule}>
                Reprogramar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReassign} onOpenChange={setShowReassign}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 border-green-200 hover:bg-green-50"
            title="Reasignar responsable"
          >
            <UserCheck className="w-3 h-3" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reasignar Responsable</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nuevo responsable
              </label>
              <select
                value={newResponsible}
                onChange={(e) => setNewResponsible(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sin asignar</option>
                {Array.isArray(collaborators) && collaborators.map(collaborator => (
                  <option key={collaborator.id} value={collaborator.id}>
                    {collaborator.name} - {collaborator.specialty || 'General'}
                  </option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReassign(false)}>
                Cancelar
              </Button>
              <Button onClick={handleReassign}>
                Reasignar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        size="sm"
        variant="outline"
        onClick={onDuplicate}
        className="text-orange-600 border-orange-200 hover:bg-orange-50"
        title="Duplicar tarea"
      >
        <Copy className="w-3 h-3" />
      </Button>

      <Dialog open={showCancel} onOpenChange={setShowCancel}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
            title="Cancelar tarea"
          >
            <XCircle className="w-3 h-3" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Tarea</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. La tarea se marcará como cancelada.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de la cancelación (obligatorio)
              </label>
              <Textarea
                id="cancelReason"
                placeholder="Ej: El cliente solicitó detener el proyecto..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancel(false)}>
                Volver
              </Button>
              <Button variant="destructive" onClick={handleCancel}>
                Confirmar Cancelación
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        size="sm"
        variant="outline"
        onClick={onOpenBranding}
        title="Ver Branding Control"
      >
        <ExternalLink className="w-3 h-3" />
      </Button>
    </div>
  );
}