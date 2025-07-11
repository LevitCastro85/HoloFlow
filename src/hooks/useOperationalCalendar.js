import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { tasksService, brandsService, clientsService } from '@/lib/supabaseHelpers';

export function useOperationalCalendar() {
  const [state, setState] = useState({
    currentDate: new Date(),
    viewMode: 'general',
    calendarView: 'month',
    selectedBrand: null,
    tasks: [],
    brands: [],
    clients: [],
    selectedTask: null,
    showTaskModal: false,
    showTaskForm: false,
    selectedDate: null,
    draggedTask: null,
    filters: {
      brand_id: '',
      assigned_to: '',
      service_id: '',
      status: '',
      priority: ''
    }
  });

  const loadData = useCallback(async () => {
    try {
      const [tasksData, brandsData, clientsData] = await Promise.all([
        tasksService.getAll(),
        brandsService.getAll(),
        clientsService.getAll()
      ]);
      setState(prev => ({
        ...prev,
        tasks: tasksData || [],
        brands: brandsData || [],
        clients: clientsData || []
      }));
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los datos del calendario.", variant: "destructive" });
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), isCurrentMonth: false });
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

  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      days.push({ date: currentDay, isCurrentMonth: true });
    }
    return days;
  };

  const getTasksForDate = (date) => {
    return state.tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      const isSameDate = taskDate.toDateString() === date.toDateString();
      if (!isSameDate) return false;
      if (state.viewMode === 'brand' && state.selectedBrand && task.brand_id !== state.selectedBrand.id) return false;
      if (state.filters.brand_id && task.brand_id !== parseInt(state.filters.brand_id)) return false;
      if (state.filters.assigned_to && task.assigned_collaborator?.name !== state.filters.assigned_to) return false;
      if (state.filters.service_id && task.service?.name !== state.filters.service_id) return false;
      if (state.filters.status && task.status !== state.filters.status) return false;
      if (state.filters.priority && task.priority !== state.filters.priority) return false;
      return true;
    });
  };

  const navigateDate = (direction) => {
    setState(prev => {
      const newDate = new Date(prev.currentDate);
      if (prev.calendarView === 'month') {
        newDate.setMonth(prev.currentDate.getMonth() + direction);
      } else {
        newDate.setDate(prev.currentDate.getDate() + (direction * 7));
      }
      return { ...prev, currentDate: newDate };
    });
  };

  const isTaskOverdue = (task) => {
    if (!task.due_date || task.status === 'entregado') return false;
    return new Date(task.due_date) < new Date();
  };

  const isTaskUrgent = (task) => {
    if (!task.due_date || task.status === 'entregado') return false;
    const diffDays = (new Date(task.due_date) - new Date()) / (1000 * 60 * 60 * 24);
    return diffDays <= 2 && diffDays >= 0;
  };

  const handleTaskClick = (task) => setState(prev => ({ ...prev, selectedTask: task, showTaskModal: true }));
  const handleDateClick = (date) => {
    if (state.viewMode === 'brand' && state.selectedBrand) {
      setState(prev => ({ ...prev, selectedDate: date, showTaskForm: true }));
    }
  };

  const handleDragStart = (e, task) => {
    if (state.viewMode !== 'brand') return;
    setState(prev => ({ ...prev, draggedTask: task }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, date) => {
    e.preventDefault();
    if (!state.draggedTask || state.viewMode !== 'brand') return;
    const newDate = date.toISOString().split('T')[0];
    try {
      await tasksService.update(state.draggedTask.id, { due_date: newDate });
      loadData();
      setState(prev => ({ ...prev, draggedTask: null }));
      toast({ title: "Tarea reprogramada", description: `"${state.draggedTask.title}" movida al ${date.toLocaleDateString('es-ES')}` });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo reprogramar la tarea.", variant: "destructive" });
    }
  };

  const handleTaskSave = async (taskData) => {
    try {
      await tasksService.create(taskData);
      loadData();
      setState(prev => ({ ...prev, showTaskForm: false, selectedDate: null }));
      toast({ title: "¡Tarea creada desde calendario!", description: `Nueva tarea programada.` });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo crear la tarea.", variant: "destructive" });
    }
  };

  const handleBrandSelect = (brandId) => {
    const brand = state.brands.find(b => b.id === parseInt(brandId));
    setState(prev => ({ ...prev, selectedBrand: brand, viewMode: 'brand' }));
  };

  const handleCloseModals = () => setState(prev => ({ ...prev, showTaskModal: false, selectedTask: null, showTaskForm: false, selectedDate: null }));

  const setCalendarView = (view) => setState(prev => ({ ...prev, calendarView: view }));
  const setFilters = (newFilters) => setState(prev => ({ ...prev, filters: newFilters }));

  const calendarData = useMemo(() => ({
    currentDate: state.currentDate,
    calendarView: state.calendarView,
    days: state.calendarView === 'month' ? getDaysInMonth(state.currentDate) : getWeekDays(state.currentDate),
    uniqueResponsibles: [...new Set(state.tasks.map(t => t.assigned_collaborator?.name).filter(Boolean))],
    uniqueTypes: [...new Set(state.tasks.map(t => t.service?.name).filter(Boolean))],
    getTasksForDate,
    isTaskOverdue,
    isTaskUrgent,
    navigateDate,
    getWeekDays,
    setCalendarView,
  }), [state.currentDate, state.calendarView, state.tasks, state.filters, state.viewMode, state.selectedBrand]);

  return {
    state,
    actions: {
      handleTaskClick,
      handleDateClick,
      handleDragStart,
      handleDragOver,
      handleDrop,
      handleTaskSave,
      handleBrandSelect,
      handleCloseModals,
      setFilters,
    },
    calendarData,
  };
}