import React from 'react';
import { Shield } from 'lucide-react';

export default function BrandControlInfo({ client, currentUser, canEdit, showPermissions = false }) {
  if (!showPermissions) {
    return (
      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          Información del Cliente
        </h3>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Tipo:</span>
            <span className="font-medium ml-2 capitalize">{client.tipoCliente}</span>
          </div>
          <div>
            <span className="text-gray-600">Facturación:</span>
            <span className={`font-medium ml-2 ${client.requiereFactura ? 'text-green-600' : 'text-gray-600'}`}>
              {client.requiereFactura ? 'Con factura' : 'Sin factura'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Método de pago:</span>
            <span className="font-medium ml-2 capitalize">{client.metodoPago}</span>
          </div>
          <div>
            <span className="text-gray-600">Estado:</span>
            <span className={`font-medium ml-2 capitalize ${
              client.estatus === 'activo' ? 'text-green-600' :
              client.estatus === 'pausa' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {client.estatus}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-900">Control de Acceso</h4>
          <div className="text-blue-800 text-sm mt-1 space-y-1">
            <p>• <strong>Todos los usuarios</strong> pueden consultar la información de las marcas</p>
            <p>• <strong>Solo Supervisores y Directores</strong> pueden crear o editar marcas</p>
            <p>• <strong>Usuario actual:</strong> {currentUser?.name} ({currentUser?.role === 'director' ? 'Director General' : currentUser?.role === 'supervisor' ? 'Supervisor' : 'Creativo/Freelancer'})</p>
            <p>• <strong>Permisos:</strong> {canEdit ? 'Lectura y escritura' : 'Solo lectura'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}