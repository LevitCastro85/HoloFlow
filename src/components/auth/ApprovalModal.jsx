import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import CollaboratorTypeSelector from '@/components/collaborator/form/CollaboratorTypeSelector';
import InternalCollaboratorFields from '@/components/collaborator/form/InternalCollaboratorFields';
import FreelancerFields from '@/components/collaborator/form/FreelancerFields';
import { ROLES } from '@/lib/permissions';

export default function ApprovalModal({ collaborator, isOpen, onClose, onApprove, onReject }) {
  const [formData, setFormData] = useState({
    role: ROLES.FREELANCE,
    collaborator_type: 'freelancer',
    weekly_salary: 0,
    base_activity_rate: 0,
  });
  const [loading, setLoading] = useState(false);

  if (!collaborator) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(collaborator.id, {
        ...formData,
        status: 'approved',
      });
      toast({ title: 'Colaborador Aprobado', description: `${collaborator.name} ahora tiene acceso al sistema.` });
      onClose();
    } catch (error) {
      toast({ title: 'Error al aprobar', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await onReject(collaborator.id);
      toast({ title: 'Solicitud Rechazada', description: `Se ha rechazado la solicitud de ${collaborator.name}.`, variant: 'destructive' });
      onClose();
    } catch (error) {
      toast({ title: 'Error al rechazar', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Revisar Solicitud de Colaborador</DialogTitle>
          <DialogDescription>Revisa la información y aprueba o rechaza la solicitud de {collaborator.name}.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* User Submitted Info */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">Información del Solicitante</h3>
            <div><p className="font-medium text-sm text-gray-500">Nombre</p><p>{collaborator.name}</p></div>
            <div><p className="font-medium text-sm text-gray-500">Email</p><p>{collaborator.email}</p></div>
            <div><p className="font-medium text-sm text-gray-500">WhatsApp</p><p>{collaborator.whatsapp}</p></div>
            <div><p className="font-medium text-sm text-gray-500">Ubicación</p><p>{`${collaborator.city || ''}, ${collaborator.state || ''}, ${collaborator.country || ''}`}</p></div>
            <div><p className="font-medium text-sm text-gray-500">Descripción</p><p className="text-sm">{collaborator.professional_description}</p></div>
            <div>
              <p className="font-medium text-sm text-gray-500 mb-2">Especialidades</p>
              <div className="flex flex-wrap gap-2">
                {collaborator.specialties?.map(spec => <Badge key={spec} variant="secondary">{spec}</Badge>)}
              </div>
            </div>
          </div>
          
          {/* Admin Configuration */}
          <div className="space-y-4 p-4">
            <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">Configuración de Administrador</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol del sistema *</label>
              <select name="role" value={formData.role} onChange={handleInputChange} className="w-full p-2 border rounded-md">
                {Object.values(ROLES).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            
            <CollaboratorTypeSelector collaboratorType={formData.collaborator_type} onInputChange={handleInputChange} />

            {formData.collaborator_type === 'interno' ? (
              <InternalCollaboratorFields formData={formData} errors={{}} onInputChange={handleInputChange} onBlur={() => {}} />
            ) : (
              <FreelancerFields formData={formData} errors={{}} onInputChange={handleInputChange} onBlur={() => {}} />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button variant="destructive" onClick={handleReject} disabled={loading}>{loading ? 'Rechazando...' : 'Rechazar Solicitud'}</Button>
          <Button onClick={handleApprove} disabled={loading}>{loading ? 'Aprobando...' : 'Aprobar y Guardar'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}