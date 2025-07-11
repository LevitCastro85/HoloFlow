import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Eye,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { paymentMethodLabels, clientTypeLabels, statusLabels } from '@/lib/clientConstants';

export default function ClientCard({ client, index, onEdit, onView }) {
  const getStatusColor = (status) => {
    const colors = {
      'activo': 'text-green-600 bg-green-100',
      'pausado': 'text-yellow-600 bg-yellow-100',
      'suspendido': 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              {client.client_type === 'empresa' ? (
                <Building2 className="w-6 h-6 text-white" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{client.name}</h3>
              <p className="text-sm text-gray-600">
                {clientTypeLabels[client.client_type] || client.client_type}
              </p>
            </div>
          </div>
          
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
            {statusLabels[client.status] || client.status}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          {client.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              {client.email}
            </div>
          )}
          
          {client.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              {client.phone}
            </div>
          )}
          
          {(client.city || client.region) && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {[client.city, client.region].filter(Boolean).join(', ')}
            </div>
          )}
          
          {client.onboarding_date && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              Cliente desde {new Date(client.onboarding_date).toLocaleDateString()}
            </div>
          )}
          
          {client.payment_method && (
            <div className="flex items-center text-sm text-gray-600">
              <CreditCard className="w-4 h-4 mr-2" />
              {paymentMethodLabels[client.payment_method] || client.payment_method}
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(client)}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <Button
            size="sm"
            onClick={() => onView(client)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            Ver Marcas
          </Button>
        </div>
      </div>
    </motion.div>
  );
}