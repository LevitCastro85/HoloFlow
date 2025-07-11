import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  FileText,
  Settings,
  Facebook,
  Instagram,
  Youtube,
  Hash,
  ExternalLink,
  Save,
  X,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

const industries = [
  'Tecnología',
  'Salud y Bienestar',
  'Educación',
  'Retail y E-commerce',
  'Alimentación y Bebidas',
  'Moda y Belleza',
  'Deportes y Fitness',
  'Inmobiliaria',
  'Servicios Financieros',
  'Turismo y Hospitalidad',
  'Automotriz',
  'Entretenimiento',
  'Construcción',
  'Consultoría',
  'Otro'
];

const paymentMethods = [
  'Efectivo',
  'Transferencia bancaria',
  'Tarjeta de crédito',
  'PayPal',
  'Domiciliación bancaria',
  'Otro'
];

const clientStatuses = [
  { value: 'activo', label: 'Activo', color: 'text-green-600', bgColor: 'bg-green-100' },
  { value: 'pausa', label: 'En pausa', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { value: 'suspendido', label: 'Suspendido', color: 'text-red-600', bgColor: 'bg-red-100' }
];

export default function ClientModal({ show, onClose, editingClient, onSave }) {
  const [formData, setFormData] = useState({
    // Datos generales
    nombre: '',
    nombreMarca: '',
    email: '',
    telefono: '',
    industria: '',
    ciudad: '',
    estado: '',
    fechaAlta: new Date().toISOString().split('T')[0],
    notasInternas: '',
    
    // Configuración administrativa
    tipoCliente: 'empresa',
    requiereFactura: true,
    metodoPago: 'transferencia',
    estatus: 'activo',
    
    // Redes sociales
    administraRedes: false,
    redesSociales: {
      facebook: '',
      instagram: '',
      tiktok: '',
      youtube: '',
      otra: { nombre: '', enlace: '' }
    }
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (editingClient) {
      setFormData({
        ...formData,
        ...editingClient,
        redesSociales: editingClient.redesSociales || formData.redesSociales
      });
    } else {
      // Reset form for new client
      setFormData({
        nombre: '',
        nombreMarca: '',
        email: '',
        telefono: '',
        industria: '',
        ciudad: '',
        estado: '',
        fechaAlta: new Date().toISOString().split('T')[0],
        notasInternas: '',
        tipoCliente: 'empresa',
        requiereFactura: true,
        metodoPago: 'transferencia',
        estatus: 'activo',
        administraRedes: false,
        redesSociales: {
          facebook: '',
          instagram: '',
          tiktok: '',
          youtube: '',
          otra: { nombre: '', enlace: '' }
        }
      });
    }
    setErrors({});
  }, [editingClient, show]);

  const validateForm = () => {
    const newErrors = {};

    // Validaciones obligatorias
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    }

    if (!formData.industria) {
      newErrors.industria = 'La industria es obligatoria';
    }

    // Validaciones de redes sociales si está activado
    if (formData.administraRedes) {
      const { redesSociales } = formData;
      
      if (redesSociales.facebook && !isValidSocialUrl(redesSociales.facebook, 'facebook')) {
        newErrors.facebook = 'URL de Facebook inválida';
      }
      
      if (redesSociales.instagram && !isValidSocialUrl(redesSociales.instagram, 'instagram')) {
        newErrors.instagram = 'URL de Instagram inválida';
      }
      
      if (redesSociales.tiktok && !isValidSocialUrl(redesSociales.tiktok, 'tiktok')) {
        newErrors.tiktok = 'URL de TikTok inválida';
      }
      
      if (redesSociales.youtube && !isValidSocialUrl(redesSociales.youtube, 'youtube')) {
        newErrors.youtube = 'URL de YouTube inválida';
      }
      
      if (redesSociales.otra.nombre && !redesSociales.otra.enlace) {
        newErrors.otraEnlace = 'El enlace es obligatorio si especificas el nombre';
      }
      
      if (redesSociales.otra.enlace && !isValidUrl(redesSociales.otra.enlace)) {
        newErrors.otraEnlace = 'URL inválida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const isValidSocialUrl = (value, platform) => {
    if (!value) return true;
    
    // Si empieza con @, es un username válido
    if (value.startsWith('@')) {
      return value.length > 1;
    }
    
    // Si es una URL, validar que sea del dominio correcto
    if (value.includes('http')) {
      const domains = {
        facebook: ['facebook.com', 'fb.com'],
        instagram: ['instagram.com'],
        tiktok: ['tiktok.com'],
        youtube: ['youtube.com', 'youtu.be']
      };
      
      try {
        const url = new URL(value);
        return domains[platform]?.some(domain => url.hostname.includes(domain));
      } catch {
        return false;
      }
    }
    
    // Si no es URL ni username, asumir que es nombre de canal/usuario válido
    return value.length > 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSocialChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      redesSociales: {
        ...prev.redesSociales,
        [platform]: value
      }
    }));
    
    if (errors[platform]) {
      setErrors(prev => ({
        ...prev,
        [platform]: undefined
      }));
    }
  };

  const handleOtraSocialChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      redesSociales: {
        ...prev.redesSociales,
        otra: {
          ...prev.redesSociales.otra,
          [field]: value
        }
      }
    }));
    
    if (errors.otraEnlace) {
      setErrors(prev => ({
        ...prev,
        otraEnlace: undefined
      }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Error en el formulario",
        description: "Por favor corrige los errores antes de continuar",
        variant: "destructive"
      });
      return;
    }

    const clientData = {
      ...formData,
      id: editingClient?.id || Date.now(),
      fechaCreacion: editingClient?.fechaCreacion || new Date().toISOString()
    };

    onSave(clientData);
    onClose();
    
    toast({
      title: editingClient ? "Cliente actualizado" : "Cliente creado",
      description: editingClient 
        ? "Los cambios han sido guardados correctamente" 
        : "El nuevo cliente ha sido registrado en el sistema"
    });
  };

  const tabs = [
    { id: 'general', label: 'Datos Generales', icon: User },
    { id: 'admin', label: 'Configuración', icon: Settings },
    { id: 'social', label: 'Redes Sociales', icon: Hash }
  ];

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-6">
          {/* Tab: Datos Generales */}
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del cliente o razón social *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Empresa ABC S.L."
                  />
                  {errors.nombre && (
                    <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la marca o proyecto
                  </label>
                  <input
                    type="text"
                    value={formData.nombreMarca}
                    onChange={(e) => handleInputChange('nombreMarca', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: MarcaXYZ"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="contacto@empresa.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de contacto *
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.telefono ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+34 600 000 000"
                  />
                  {errors.telefono && (
                    <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industria o giro *
                  </label>
                  <select
                    value={formData.industria}
                    onChange={(e) => handleInputChange('industria', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.industria ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar industria</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                  {errors.industria && (
                    <p className="text-red-500 text-xs mt-1">{errors.industria}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={formData.ciudad}
                    onChange={(e) => handleInputChange('ciudad', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Madrid"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado/Provincia
                  </label>
                  <input
                    type="text"
                    value={formData.estado}
                    onChange={(e) => handleInputChange('estado', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Madrid"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de alta
                </label>
                <input
                  type="date"
                  value={formData.fechaAlta}
                  onChange={(e) => handleInputChange('fechaAlta', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas internas
                </label>
                <textarea
                  value={formData.notasInternas}
                  onChange={(e) => handleInputChange('notasInternas', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Información adicional, preferencias, historial, etc."
                />
              </div>
            </motion.div>
          )}

          {/* Tab: Configuración Administrativa */}
          {activeTab === 'admin' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de cliente
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="tipoCliente"
                        value="empresa"
                        checked={formData.tipoCliente === 'empresa'}
                        onChange={(e) => handleInputChange('tipoCliente', e.target.value)}
                        className="text-blue-600"
                      />
                      <Building2 className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Empresa</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="tipoCliente"
                        value="persona"
                        checked={formData.tipoCliente === 'persona'}
                        onChange={(e) => handleInputChange('tipoCliente', e.target.value)}
                        className="text-blue-600"
                      />
                      <User className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Persona física</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ¿Requiere factura?
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="requiereFactura"
                        value={true}
                        checked={formData.requiereFactura === true}
                        onChange={() => handleInputChange('requiereFactura', true)}
                        className="text-blue-600"
                      />
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Sí, requiere factura</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="requiereFactura"
                        value={false}
                        checked={formData.requiereFactura === false}
                        onChange={() => handleInputChange('requiereFactura', false)}
                        className="text-blue-600"
                      />
                      <X className="w-5 h-5 text-red-600" />
                      <span className="font-medium">No requiere factura</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de pago preferido
                  </label>
                  <select
                    value={formData.metodoPago}
                    onChange={(e) => handleInputChange('metodoPago', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {paymentMethods.map(method => (
                      <option key={method} value={method.toLowerCase()}>{method}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estatus del cliente
                  </label>
                  <select
                    value={formData.estatus}
                    onChange={(e) => handleInputChange('estatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {clientStatuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Vista previa de configuración */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3">Resumen de Configuración</h4>
                <div className="bg-white p-4 rounded border space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium capitalize">{formData.tipoCliente}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Facturación:</span>
                    <span className={`font-medium ${formData.requiereFactura ? 'text-green-600' : 'text-red-600'}`}>
                      {formData.requiereFactura ? 'Requiere factura' : 'Sin factura'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pago:</span>
                    <span className="font-medium capitalize">{formData.metodoPago}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className={`font-medium ${clientStatuses.find(s => s.value === formData.estatus)?.color}`}>
                      {clientStatuses.find(s => s.value === formData.estatus)?.label}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab: Redes Sociales */}
          {activeTab === 'social' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.administraRedes}
                    onChange={(e) => handleInputChange('administraRedes', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <div>
                    <span className="font-medium text-yellow-900">¿Contratará administración de redes sociales?</span>
                    <p className="text-sm text-yellow-700">Activa esta opción para configurar las redes sociales del cliente</p>
                  </div>
                </label>
              </div>

              {formData.administraRedes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <h4 className="font-medium text-gray-900">Configuración de Redes Sociales</h4>
                  <p className="text-sm text-gray-600">
                    Puedes ingresar URLs completas (https://...) o nombres de usuario (@usuario)
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Facebook className="w-4 h-4 inline mr-2 text-blue-600" />
                        Facebook
                      </label>
                      <input
                        type="text"
                        value={formData.redesSociales.facebook}
                        onChange={(e) => handleSocialChange('facebook', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.facebook ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="@usuario o https://facebook.com/usuario"
                      />
                      {errors.facebook && (
                        <p className="text-red-500 text-xs mt-1">{errors.facebook}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Instagram className="w-4 h-4 inline mr-2 text-pink-600" />
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={formData.redesSociales.instagram}
                        onChange={(e) => handleSocialChange('instagram', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.instagram ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="@usuario o https://instagram.com/usuario"
                      />
                      {errors.instagram && (
                        <p className="text-red-500 text-xs mt-1">{errors.instagram}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Hash className="w-4 h-4 inline mr-2 text-black" />
                        TikTok
                      </label>
                      <input
                        type="text"
                        value={formData.redesSociales.tiktok}
                        onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.tiktok ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="@usuario o https://tiktok.com/@usuario"
                      />
                      {errors.tiktok && (
                        <p className="text-red-500 text-xs mt-1">{errors.tiktok}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Youtube className="w-4 h-4 inline mr-2 text-red-600" />
                        YouTube
                      </label>
                      <input
                        type="text"
                        value={formData.redesSociales.youtube}
                        onChange={(e) => handleSocialChange('youtube', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.youtube ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Canal o https://youtube.com/c/canal"
                      />
                      {errors.youtube && (
                        <p className="text-red-500 text-xs mt-1">{errors.youtube}</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h5 className="font-medium text-gray-900 mb-3">Otra red social</h5>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre de la red
                        </label>
                        <input
                          type="text"
                          value={formData.redesSociales.otra.nombre}
                          onChange={(e) => handleOtraSocialChange('nombre', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ej: LinkedIn, Twitter, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enlace
                        </label>
                        <input
                          type="url"
                          value={formData.redesSociales.otra.enlace}
                          onChange={(e) => handleOtraSocialChange('enlace', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.otraEnlace ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="https://..."
                        />
                        {errors.otraEnlace && (
                          <p className="text-red-500 text-xs mt-1">{errors.otraEnlace}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Vista previa de redes */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h5 className="font-medium text-gray-900 mb-3">Vista previa de redes configuradas</h5>
                    <div className="space-y-2">
                      {formData.redesSociales.facebook && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Facebook className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-600">Facebook:</span>
                          <span className="font-medium">{formData.redesSociales.facebook}</span>
                        </div>
                      )}
                      {formData.redesSociales.instagram && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Instagram className="w-4 h-4 text-pink-600" />
                          <span className="text-gray-600">Instagram:</span>
                          <span className="font-medium">{formData.redesSociales.instagram}</span>
                        </div>
                      )}
                      {formData.redesSociales.tiktok && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Hash className="w-4 h-4 text-black" />
                          <span className="text-gray-600">TikTok:</span>
                          <span className="font-medium">{formData.redesSociales.tiktok}</span>
                        </div>
                      )}
                      {formData.redesSociales.youtube && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Youtube className="w-4 h-4 text-red-600" />
                          <span className="text-gray-600">YouTube:</span>
                          <span className="font-medium">{formData.redesSociales.youtube}</span>
                        </div>
                      )}
                      {formData.redesSociales.otra.nombre && formData.redesSociales.otra.enlace && (
                        <div className="flex items-center space-x-2 text-sm">
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">{formData.redesSociales.otra.nombre}:</span>
                          <span className="font-medium">{formData.redesSociales.otra.enlace}</span>
                        </div>
                      )}
                      {!formData.redesSociales.facebook && !formData.redesSociales.instagram && 
                       !formData.redesSociales.tiktok && !formData.redesSociales.youtube && 
                       !formData.redesSociales.otra.enlace && (
                        <p className="text-gray-500 text-sm">No hay redes sociales configuradas</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Botones de acción */}
          <div className="flex space-x-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingClient ? 'Actualizar' : 'Crear'} Cliente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}