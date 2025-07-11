import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon,
  Plus,
  Edit,
  Trash2,
  Clock,
  Repeat,
  ArrowLeft,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import EditorialEventForm from '@/components/calendar/EditorialEventForm';
import BrandTaskForm from '@/components/task/BrandTaskForm';

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const eventTypes = {
  'publicacion': { name: 'Publicación', color: 'bg-blue-100 text-blue-800' },
  'campana': { name: 'Campaña', color: 'bg-purple-100 text-purple-800' },
  'contenido': { name: 'Contenido', color: 'bg-green-100 text-green-800' },
  'promocion': { name: 'Promoción', color: 'bg-orange-100 text-orange-800' },
  'evento': { name: 'Evento', color: 'bg-red-100 text-red-800' }
};

export default function EditorialCalendar({ brand, client, onBack }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadEvents();
  }, [brand.id]);

  const loadEvents = () => {
    const savedEvents = localStorage.getItem('editorialCalendar');
    if (savedEvents) {
      const allEvents = JSON.parse(savedEvents);
      const brandEvents = allEvents.filter(event => event.brandId === brand.id);
      setEvents(brandEvents);
    } else {
      // Eventos de ejemplo
      const exampleEvents = [
        {
          id: 1,
          brandId: brand.id,
          titulo: 'Post semanal motivacional',
          tipo: 'publicacion',
          descripcion: 'Publicación semanal con mensaje motivacional para runners',
          fechaInicio: '2025-01-06',
          fechaFin: '2025-01-06',
          recurrencia: 'semanal',
          tipoContenido: 'diseño',
          responsable: 'Sofia Mendoza',
          notas: 'Usar colores de la marca y tipografía principal',
          activo: true,
          fechaCreacion: new Date().toISOString()
        },
        {
          id: 2,
          brandId: brand.id,
          titulo: 'Campaña fin de mes',
          tipo: 'campana',
          descripcion: 'Campaña promocional de fin de mes con descuentos',
          fechaInicio: '2025-01-28',
          fechaFin: '2025-01-31',
          recurrencia: 'mensual',
          tipoContenido: 'reel',
          responsable: 'Miguel Torres',
          notas: 'Incluir call-to-action claro y código de descuento',
          activo: true,
          fechaCreacion: new Date().toISOString()
        }
      ];
      setEvents(exampleEvents);
      localStorage.setItem('editorialCalendar', JSON.stringify(exampleEvents));
    }
  };

  const saveEvents = (updatedEvents) => {
    const savedEvents = localStorage.getItem('editorialCalendar');
    const allEvents = savedEvents ? JSON.parse(savedEvents) : [];
    
    const otherEvents = allEvents.filter(event => event.brandId !== brand.id);
    const newAllEvents = [...otherEvents, ...updatedEvents];
    
    setEvents(updatedEvents);
    localStorage.setItem('editorialCalendar', JSON.stringify(newAllEvents));
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      if (!event.activo) return false;
      
      const eventStart = new Date(event.fechaInicio);
      const eventEnd = new Date(event.fechaFin);
      
      if (date >= eventStart && date <= eventEnd) {
        return true;
      }
      
      if (event.recurrencia && date >= eventStart) {
        const daysDiff = Math.floor((date - eventStart) / (1000 * 60 * 60 * 24));
        
        switch (event.recurrencia) {
          case 'diaria':
            return true;
          case 'semanal':
            return daysDiff % 7 === 0;
          case 'mensual':
            return date.getDate() === eventStart.getDate();
          default:
            return false;
        }
      }
      
      return false;
    }).filter(event => {
      return filterType === 'all' || event.tipo === filterType;
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleSaveEvent = (eventData) => {
    const isEditing = events.find(e => e.id === eventData.id);
    let updatedEvents;

    if (isEditing) {
      updatedEvents = events.map(e => e.id === eventData.id ? eventData : e);
    } else {
      const newEvent = {
        ...eventData,
        id: Date.now(),
        brandId: brand.id,
        fechaCreacion: new Date().toISOString()
      };
      updatedEvents = [...events, newEvent];
    }

    saveEvents(updatedEvents);
    setShowEventForm(false);
    setEditingEvent(null);
    
    toast({
      title: isEditing ? "Evento actualizado" : "Evento creado",
      description: "El evento del calendario editorial ha sido guardado correctamente"
    });
  };

  const handleCreateTaskFromEvent = (event) => {
    setSelectedEvent(event);
    setShowTaskForm(true);
  };

  const handleTaskSave = (taskData) => {
    // Agregar el origen del calendario al task
    const taskWithOrigin = {
      ...taskData,
      origen: 'calendario',
      eventoCalendarioId: selectedEvent.id,
      eventoTitulo: selectedEvent.titulo
    };

    // Guardar la tarea
    const savedTasks = localStorage.getItem('brandTasks');
    const allTasks = savedTasks ? JSON.parse(savedTasks) : [];
    const updatedTasks = [...allTasks, taskWithOrigin];
    localStorage.setItem('brandTasks', JSON.stringify(updatedTasks));

    setShowTaskForm(false);
    setSelectedEvent(null);
    
    toast({
      title: "¡Tarea creada desde calendario!",
      description: `Nueva tarea creada basada en el evento "${selectedEvent.titulo}"`
    });
  };

  const deleteEvent = (eventId) => {
    const updatedEvents = events.filter(e => e.id !== eventId);
    saveEvents(updatedEvents);
    
    toast({
      title: "Evento eliminado",
      description: "El evento ha sido eliminado del calendario editorial"
    });
  };

  const days = getDaysInMonth(currentDate);

  if (showTaskForm && selectedEvent) {
    return (
      <BrandTaskForm
        brand={brand}
        client={client}
        editingTask={{
          titulo: selectedEvent.titulo,
          tipoContenido: selectedEvent.tipoContenido,
          descripcion: selectedEvent.descripcion,
          responsable: selectedEvent.responsable,
          notas: selectedEvent.notas,
          fechaSolicitud: new Date().toISOString().split('T')[0],
          fechaEntrega: selectedEvent.fechaInicio,
          origen: 'calendario',
          eventoCalendarioId: selectedEvent.id
        }}
        onSave={handleTaskSave}
        onCancel={() => {
          setShowTaskForm(false);
          setSelectedEvent(null);
        }}
      />
    );
  }

  if (showEventForm) {
    return (
      <EditorialEventForm
        brand={brand}
        client={client}
        editingEvent={editingEvent}
        onSave={handleSaveEvent}
        onCancel={() => setShowEventForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Brand Control
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendario Editorial</h1>
            <p className="text-gray-600">Marca: {brand.nombre} • Cliente: {client.nombre}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Todos los tipos</option>
            {Object.entries(eventTypes).map(([key, type]) => (
              <option key={key} value={key}>{type.name}</option>
            ))}
          </select>
          <Button onClick={handleAddEvent}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Evento
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border"
      >
        {/* Header del calendario */}
        <div className="flex items-center justify-between p-6 border-b">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 border-b">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="p-4 text-center font-medium text-gray-700 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Grilla del calendario */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.date);
            const isToday = day.date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b last:border-r-0 ${
                  !day.isCurrentMonth ? 'bg-gray-50' : ''
                } ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  !day.isCurrentMonth ? 'text-gray-400' : 
                  isToday ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {day.date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event, eventIndex) => (
                    <motion.div
                      key={`${event.id}-${day.date.toISOString()}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: eventIndex * 0.1 }}
                      className={`text-xs p-1 rounded cursor-pointer group ${eventTypes[event.tipo]?.color}`}
                      onClick={() => handleCreateTaskFromEvent(event)}
                      title={`${event.titulo} - Clic para crear tarea`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate flex-1">{event.titulo}</span>
                        <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditEvent(event);
                            }}
                            className="text-gray-600 hover:text-blue-600"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      {event.recurrencia && (
                        <div className="flex items-center mt-1">
                          <Repeat className="w-2 h-2 mr-1" />
                          <span className="text-xs opacity-75">{event.recurrencia}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{dayEvents.length - 2} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Lista de eventos */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Eventos Programados</h3>
        <div className="space-y-3">
          {events.filter(e => filterType === 'all' || e.tipo === filterType).map(event => (
            <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${eventTypes[event.tipo]?.color}`}>
                  {eventTypes[event.tipo]?.name}
                </span>
                <div>
                  <h4 className="font-medium text-gray-900">{event.titulo}</h4>
                  <p className="text-sm text-gray-600">{event.descripcion}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span>📅 {new Date(event.fechaInicio).toLocaleDateString('es-ES')}</span>
                    {event.recurrencia && (
                      <span className="flex items-center">
                        <Repeat className="w-3 h-3 mr-1" />
                        {event.recurrencia}
                      </span>
                    )}
                    {event.responsable && (
                      <span>👤 {event.responsable}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCreateTaskFromEvent(event)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Crear Tarea
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditEvent(event)}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteEvent(event.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {events.length === 0 && (
          <div className="text-center py-8">
            <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No hay eventos programados</h4>
            <p className="text-gray-600 mb-4">Crea el primer evento para el calendario editorial</p>
            <Button onClick={handleAddEvent}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Evento
            </Button>
          </div>
        )}
      </div>

      {/* Leyenda */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Tipos de Eventos</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(eventTypes).map(([key, type]) => (
            <div key={key} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded ${type.color}`}></div>
              <span className="text-sm text-gray-700">{type.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            💡 <strong>Tip:</strong> Haz clic en cualquier evento del calendario para crear una tarea basada en él. 
            Las tareas creadas desde el calendario se marcarán automáticamente con origen "calendario".
          </p>
        </div>
      </div>
    </div>
  );
}