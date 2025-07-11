import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Image,
  Video,
  Music,
  FileText,
  Archive,
  Link as LinkIcon,
  Folder
} from 'lucide-react';

export const statusInfo = {
  'pendiente-revision': {
    label: 'Pendiente de Revisión',
    color: 'bg-yellow-100 text-yellow-800',
    Icon: Clock
  },
  'aprobado': {
    label: 'Aprobado',
    color: 'bg-green-100 text-green-800',
    Icon: CheckCircle
  },
  'rechazado': {
    label: 'Rechazado',
    color: 'bg-red-100 text-red-800',
    Icon: XCircle
  },
  'necesita-cambios': {
    label: 'Necesita Cambios',
    color: 'bg-orange-100 text-orange-800',
    Icon: AlertTriangle
  },
  'en-uso': {
    label: 'En Uso',
    color: 'bg-blue-100 text-blue-800',
    Icon: CheckCircle
  }
};

export const taskStatuses = [
  { value: 'en-fila', label: 'En Fila' },
  { value: 'en-proceso', label: 'En Proceso' },
  { value: 'revision', label: 'En Revisión' },
  { value: 'requiere-atencion', label: 'Requiere Atención' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'cancelado', label: 'Cancelado' }
];

export const taskStatusColors = {
  'en-fila': 'text-gray-600 bg-gray-100',
  'en-proceso': 'text-blue-600 bg-blue-100',
  'revision': 'text-yellow-600 bg-yellow-100',
  'requiere-atencion': 'text-red-600 bg-red-100',
  'entregado': 'text-green-600 bg-green-100',
  'cancelado': 'text-gray-500 bg-gray-200'
};

export const statusLabels = {
  'en-fila': 'En Fila',
  'en-proceso': 'En Proceso',
  'revision': 'En Revisión',
  'requiere-atencion': 'Requiere Atención',
  'entregado': 'Entregado',
  'cancelado': 'Cancelado'
};

export const statusColors = {
  'en-fila': 'text-gray-600 bg-gray-100',
  'en-proceso': 'text-blue-600 bg-blue-100',
  'revision': 'text-yellow-600 bg-yellow-100',
  'requiere-atencion': 'text-red-600 bg-red-100',
  'entregado': 'text-green-600 bg-green-100',
  'cancelado': 'text-gray-500 bg-gray-200'
};

export const taskPriorities = [
  { value: 'baja', label: 'Baja' },
  { value: 'normal', label: 'Normal' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
  { value: 'urgente', label: 'Urgente' }
];

export const priorityColors = {
  'baja': 'text-gray-600',
  'normal': 'text-blue-600',
  'media': 'text-green-600',
  'alta': 'text-orange-600',
  'urgente': 'text-red-600'
};

export const priorityLabels = {
  'baja': 'Baja',
  'normal': 'Normal',
  'media': 'Media',
  'alta': 'Alta',
  'urgente': 'Urgente'
};

export const socialNetworks = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'web', label: 'Sitio Web' }
];

export const fileTypeIcons = {
  'image': Image,
  'video': Video,
  'audio': Music,
  'document': FileText,
  'archive': Archive,
  'url': LinkIcon,
  'unknown': Folder
};

export const deliveryMethods = {
  'file': 'Archivo',
  'url': 'URL/Enlace',
  'drive': 'Google Drive',
  'dropbox': 'Dropbox'
};

export const resourceCategories = [
  { value: 'general', label: 'General' },
  { value: 'entregable', label: 'Entregable' },
  { value: 'input', label: 'Material de entrada' },
  { value: 'referencia', label: 'Referencia' },
  { value: 'borrador', label: 'Borrador' },
  { value: 'final', label: 'Versión final' }
];

export const resourceStatuses = [
  { value: 'pendiente-revision', label: 'Pendiente de Revisión' },
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'rechazado', label: 'Rechazado' },
  { value: 'necesita-cambios', label: 'Necesita Cambios' },
  { value: 'en-uso', label: 'En Uso' }
];

export const resourceStatusLabels = {
  'pendiente-revision': 'Pendiente de Revisión',
  'aprobado': 'Aprobado',
  'rechazado': 'Rechazado',
  'necesita-cambios': 'Necesita Cambios',
  'en-uso': 'En Uso',
};