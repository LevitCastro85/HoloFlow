import React from 'react';
import { motion } from 'framer-motion';
import { User, Edit, Clock, CheckCircle, XCircle, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { roleInfoMap } from '@/lib/permissions';

const statusInfoMap = {
  pending_approval: { label: 'Pendiente Aprobación', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Aprobado', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rechazado', icon: XCircle, color: 'bg-red-100 text-red-800' },
  pending_email_confirmation: { label: 'Pendiente Email', icon: Clock, color: 'bg-blue-100 text-blue-800' },
};

export default function CollaboratorCard({ collaborator, onEdit, onAccessChange, canManage, onReview }) {
  const RoleIcon = roleInfoMap[collaborator.role]?.icon || User;
  const roleColor = roleInfoMap[collaborator.role]?.color || 'text-gray-600 bg-gray-100';
  const statusInfo = statusInfoMap[collaborator.status];
  const StatusIcon = statusInfo?.icon || User;

  return (
    <motion.div
      key={collaborator.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border p-4 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              className="w-12 h-12 rounded-full object-cover"
              alt={`Foto de ${collaborator.name}`}
              src={collaborator.profile_photo_url || `https://ui-avatars.com/api/?name=${collaborator.name}&background=random`}
            />
            <div>
              <h3 className="font-semibold text-gray-900">{collaborator.name}</h3>
              <p className="text-sm text-gray-500">{collaborator.email}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {statusInfo && (
            <Badge variant="outline" className={statusInfo.color}>
              <StatusIcon className="w-3 h-3 mr-1.5" />
              {statusInfo.label}
            </Badge>
          )}
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleColor}`}>
            <RoleIcon className="w-3 h-3 mr-1.5" />
            {collaborator.role || 'Sin rol asignado'}
          </div>
           <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border">
              <label htmlFor={`access-switch-${collaborator.id}`} className="text-sm font-medium text-gray-700">
                  Acceso al sistema
              </label>
              <Switch
                  id={`access-switch-${collaborator.id}`}
                  checked={collaborator.has_system_access}
                  onCheckedChange={(checked) => onAccessChange(collaborator, checked)}
                  disabled={!canManage || collaborator.status !== 'approved'}
              />
          </div>
        </div>
      </div>

      <div className="mt-4 border-t pt-4 flex justify-end">
        {collaborator.status === 'pending_approval' && canManage ? (
          <Button size="sm" onClick={() => onReview(collaborator)}>
            <FileCheck className="w-4 h-4 mr-2" />
            Revisar Solicitud
          </Button>
        ) : (
          <Button size="sm" onClick={() => onEdit(collaborator)} disabled={!canManage}>
            <Edit className="w-4 h-4 mr-2" />
            Gestionar Rol
          </Button>
        )}
      </div>
    </motion.div>
  );
}