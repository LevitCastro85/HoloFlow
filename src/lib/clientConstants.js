export const paymentMethods = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia bancaria' },
  { value: 'tarjeta', label: 'Tarjeta de crédito' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'domiciliacion', label: 'Domiciliación bancaria' },
  { value: 'otro', label: 'Otro' }
];

export const clientTypes = [
  { value: 'empresa', label: 'Empresa' },
  { value: 'persona', label: 'Persona física' }
];

export const clientStatuses = [
  { value: 'activo', label: 'Activo', color: 'text-green-600', bgColor: 'bg-green-100' },
  { value: 'pausado', label: 'En pausa', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { value: 'suspendido', label: 'Suspendido', color: 'text-red-600', bgColor: 'bg-red-100' }
];

export const paymentMethodLabels = {
  'efectivo': 'Efectivo',
  'transferencia': 'Transferencia',
  'tarjeta': 'Tarjeta',
  'paypal': 'PayPal',
  'domiciliacion': 'Domiciliación',
  'otro': 'Otro'
};

export const clientTypeLabels = {
  'empresa': 'Empresa',
  'persona': 'Persona física'
};

export const statusLabels = {
  'activo': 'Activo',
  'pausado': 'En pausa',
  'suspendido': 'Suspendido'
};