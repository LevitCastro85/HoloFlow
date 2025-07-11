import React from 'react';
import { ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function CalendarHeader({ 
  currentDate, 
  calendarView, 
  setCalendarView, 
  onNavigate,
  getWeekDays 
}) {
  return (
    <div className="flex items-center justify-between p-6 border-b">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavigate(-1)}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <h2 className="text-xl font-semibold text-gray-900">
        {calendarView === 'month' 
          ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
          : `Semana del ${getWeekDays(currentDate)[0].date.toLocaleDateString('es-ES')} al ${getWeekDays(currentDate)[6].date.toLocaleDateString('es-ES')}`
        }
      </h2>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
          <Button
            size="sm"
            variant={calendarView === 'month' ? 'default' : 'ghost'}
            onClick={() => setCalendarView('month')}
          >
            <Grid className="w-4 h-4 mr-1" />
            Mes
          </Button>
          <Button
            size="sm"
            variant={calendarView === 'week' ? 'default' : 'ghost'}
            onClick={() => setCalendarView('week')}
          >
            <List className="w-4 h-4 mr-1" />
            Semana
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate(1)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}