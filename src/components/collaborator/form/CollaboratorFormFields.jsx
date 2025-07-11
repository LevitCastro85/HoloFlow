import React from 'react';
import { User, Mail, Phone, MapPin, Camera, Shield } from 'lucide-react';
import { ROLES } from '@/lib/permissions';

const availabilityOptions = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'ocupado', label: 'Ocupado' },
  { value: 'no disponible', label: 'No disponible' }
];

const specialtiesList = [
  'Diseño Gráfico', 'Diseño Web', 'Desarrollo Frontend', 'Desarrollo Backend',
  'Copywriting', 'Marketing Digital', 'SEO/SEM', 'Gestión de Proyectos',
  'Producción Audiovisual', 'Edición de Video', 'Animación / Motion Graphics', 'Ilustración'
];

export default function CollaboratorFormFields({ formData, errors, onInputChange, onBlur }) {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Nombre completo *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: María García López"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Correo electrónico *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="maria@ejemplo.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Teléfono
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            onBlur={onBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+52 55 1234 5678"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Especialidades
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 p-3 border rounded-lg bg-gray-50">
          {specialtiesList.map(spec => (
            <div key={spec} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`modal-spec-${spec}`}
                checked={(formData.specialties || []).includes(spec)}
                onChange={() => {
                  const currentSpecialties = formData.specialties || [];
                  const newSpecialties = currentSpecialties.includes(spec)
                    ? currentSpecialties.filter(s => s !== spec)
                    : [...currentSpecialties, spec];
                  onInputChange({ target: { name: 'specialties', value: newSpecialties } });
                }}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor={`modal-spec-${spec}`} className="font-normal text-sm text-gray-700">{spec}</label>
            </div>
          ))}
        </div>
      </div>

       <div className="grid md:grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Shield className="w-4 h-4 inline mr-1" />
                Rol de Usuario *
            </label>
            <select
                name="role"
                value={formData.role}
                onChange={onInputChange}
                onBlur={onBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                {Object.values(ROLES).map(role => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Define los permisos de acceso del usuario en la plataforma.
            </p>
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Disponibilidad
          </label>
          <select
            name="availability"
            value={formData.availability}
            onChange={onInputChange}
            onBlur={onBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {availabilityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
       </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Ciudad
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={onInputChange}
            onBlur={onBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Ciudad de México"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Estado
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={onInputChange}
            onBlur={onBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: CDMX"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Camera className="w-4 h-4 inline mr-1" />
          Foto de perfil (URL)
        </label>
        <input
          type="url"
          name="profile_photo_url"
          value={formData.profile_photo_url}
          onChange={onInputChange}
          onBlur={onBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://ejemplo.com/foto.jpg"
        />
        <p className="text-xs text-gray-500 mt-1">
          Proporciona la URL de una imagen para la foto de perfil del colaborador
        </p>
      </div>
      
      <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación
          </label>
          <input
            type="number"
            name="rating"
            min="1"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={onInputChange}
            onBlur={onBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nota interna (opcional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={onInputChange}
          onBlur={onBlur}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Información adicional, habilidades, etc."
        />
      </div>
    </>
  );
}