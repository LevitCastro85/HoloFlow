import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search,
  Link as LinkIcon,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  Clock,
  User,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fileTypeIcons, statusInfo } from '@/lib/resourceConstants';

export default function ResourceReviewControl({ 
  resources, 
  onResourceAction 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredResources = useMemo(() => resources.filter(resource => {
    const searchString = `${resource.nombre} ${resource.descripcion} ${resource.marca} ${resource.clientName} ${resource.submittedBy} ${resource.reviewed_by}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || resource.status === statusFilter;
    const matchesType = !typeFilter || resource.tipo === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  }), [resources, searchTerm, statusFilter, typeFilter]);

  const counters = useMemo(() => ({
    pending: resources.filter(r => r.status === 'pending-approval').length,
    approved: resources.filter(r => r.status === 'approved').length,
    rejected: resources.filter(r => ['rejected', 'needs-review'].includes(r.status)).length,
  }), [resources]);

  const getPreviewComponent = (resource) => {
    const FileIcon = fileTypeIcons[resource.tipo] || FileText;
    const isImage = resource.tipo === 'image' && resource.url;
    
    return (
      <div className="flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-12 h-12 bg-gray-100 rounded-lg shrink-0 relative overflow-hidden" 
          onClick={() => onResourceAction('preview', resource)}
        >
          {isImage ? (
            <img 
              src={resource.url} 
              alt={resource.nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center ${isImage ? 'hidden' : ''}`}>
            <FileIcon className="w-6 h-6 text-gray-600" />
          </div>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900 truncate" title={resource.nombre}>
            {resource.nombre}
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>{new Date(resource.fechaSubida).toLocaleDateString('es-ES')}</span>
            <span>•</span>
            <span className="capitalize">{resource.tipo}</span>
            {resource.tamaño && (
              <>
                <span>•</span>
                <span>{resource.tamaño}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getStatusButton = (resource) => {
    const { label, color, Icon } = statusInfo[resource.status] || {
      label: 'Desconocido',
      color: 'bg-gray-100 text-gray-800',
      Icon: Clock,
    };

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onResourceAction('statusChange', resource)}
        className={`${color} hover:opacity-80 transition-all`}
      >
        <Icon className="w-4 h-4 mr-1.5" />
        {label}
      </Button>
    );
  };

  const getActionButtons = (resource) => {
    const isApproved = resource.status === 'approved';
    
    return (
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onResourceAction('preview', resource)}
          className="text-blue-600 hover:bg-blue-50"
        >
          <Eye className="w-4 h-4" />
        </Button>
        
        {resource.url && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onResourceAction('download', resource)}
            className="text-green-600 hover:bg-green-50"
          >
            <Download className="w-4 h-4" />
          </Button>
        )}
        
        {isApproved && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onResourceAction('useAsInput', resource)}
            className="text-purple-600 hover:bg-purple-50"
            title="Crear tarea con este recurso"
          >
            <CheckCircle className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Control de Revisión</h2>
          <p className="text-gray-600">Vista operativa para gestionar la calidad de los recursos creativos.</p>
        </div>
        
        <div className="flex items-center space-x-4 text-sm font-medium">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span>🟡 Pendientes: {counters.pending}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>🟢 Aprobados: {counters.approved}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span>🔴 Rechazados/Revisión: {counters.rejected}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, marca, revisor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            {Object.entries(statusInfo).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los tipos</option>
            {Object.keys(fileTypeIcons).map(type => (
              <option key={type} value={type} className="capitalize">{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Vista Previa / Recurso</th>
                <th className="text-left p-4 font-medium text-gray-700">Marca / Cliente</th>
                <th className="text-left p-4 font-medium text-gray-700">Tarea Relacionada</th>
                <th className="text-left p-4 font-medium text-gray-700">Estado</th>
                <th className="text-left p-4 font-medium text-gray-700">Subido por</th>
                <th className="text-left p-4 font-medium text-gray-700">Revisado por</th>
                <th className="text-left p-4 font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((resource, index) => (
                <motion.tr
                  key={resource.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">
                    {getPreviewComponent(resource)}
                  </td>
                  
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-800">{resource.marca || 'Sin asignar'}</p>
                      <p className="text-xs text-gray-500">{resource.clientName || ''}</p>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    {resource.taskTitle ? (
                      <div>
                        <p className="text-gray-700 font-medium">{resource.taskTitle}</p>
                        <p className="text-xs text-gray-500">ID: {resource.taskId}</p>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onResourceAction('linkTask', resource)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <LinkIcon className="w-3 h-3 mr-1" />
                        Vincular
                      </Button>
                    )}
                  </td>
                  
                  <td className="p-4">
                    {getStatusButton(resource)}
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-700">{resource.submittedBy || 'Sistema'}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(resource.fechaSubida).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {resource.reviewed_by ? (
                        <>
                          <User className="w-4 h-4 text-green-500" />
                          <div>
                            <p className="text-gray-700">{resource.reviewed_by}</p>
                            {resource.reviewed_at && (
                              <p className="text-xs text-gray-500">
                                {new Date(resource.reviewed_at).toLocaleDateString('es-ES')}
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Pendiente</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    {getActionButtons(resource)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron recursos</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter || typeFilter ? 'Intenta ajustar los filtros de búsqueda' : 'Los recursos aparecerán aquí cuando se suban'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}