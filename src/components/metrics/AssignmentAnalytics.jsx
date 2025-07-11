import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Clock, 
  TrendingUp, 
  Users,
  Calendar,
  Award,
  AlertTriangle,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskAssignmentMetrics from '@/components/task/TaskAssignmentMetrics';

export default function AssignmentAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalAssignments: 0,
    avgResponseTime: 0,
    topPerformers: [],
    assignmentTrends: [],
    workloadDistribution: []
  });
  
  const [selectedCollaborator, setSelectedCollaborator] = useState('');
  const [timeRange, setTimeRange] = useState('30'); // días
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    loadCollaborators();
    calculateAnalytics();
  }, [timeRange]);

  const loadCollaborators = () => {
    const savedFreelancers = localStorage.getItem('creativeFreelancers');
    if (savedFreelancers) {
      setCollaborators(JSON.parse(savedFreelancers));
    }
  };

  const calculateAnalytics = () => {
    const savedTasks = localStorage.getItem('brandTasks');
    const assignmentHistory = JSON.parse(localStorage.getItem('assignmentHistory') || '[]');
    
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      
      // Filtrar por rango de tiempo
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));
      
      const recentTasks = allTasks.filter(task => {
        const taskDate = new Date(task.fechaCreacion || task.fechaSolicitud);
        return taskDate >= cutoffDate;
      });

      // Calcular métricas generales
      const totalAssignments = recentTasks.filter(t => t.responsable).length;
      
      const completedTasks = recentTasks.filter(t => t.estado === 'entregado' && t.tiempoRespuesta);
      const avgResponseTime = completedTasks.length > 0 
        ? Math.round(completedTasks.reduce((sum, t) => sum + t.tiempoRespuesta, 0) / completedTasks.length)
        : 0;

      // Calcular top performers
      const collaboratorStats = {};
      recentTasks.forEach(task => {
        if (task.responsable) {
          if (!collaboratorStats[task.responsable]) {
            collaboratorStats[task.responsable] = {
              name: task.responsable,
              assigned: 0,
              completed: 0,
              avgTime: 0,
              efficiency: 0
            };
          }
          
          collaboratorStats[task.responsable].assigned++;
          
          if (task.estado === 'entregado') {
            collaboratorStats[task.responsable].completed++;
            if (task.tiempoRespuesta) {
              collaboratorStats[task.responsable].avgTime = 
                (collaboratorStats[task.responsable].avgTime + task.tiempoRespuesta) / 2;
            }
          }
        }
      });

      // Calcular eficiencia y ordenar
      const topPerformers = Object.values(collaboratorStats)
        .map(stat => ({
          ...stat,
          efficiency: stat.assigned > 0 ? Math.round((stat.completed / stat.assigned) * 100) : 0,
          avgTime: Math.round(stat.avgTime)
        }))
        .sort((a, b) => b.efficiency - a.efficiency)
        .slice(0, 5);

      // Calcular distribución de carga de trabajo
      const workloadDistribution = Object.values(collaboratorStats)
        .map(stat => ({
          name: stat.name,
          activeTasks: recentTasks.filter(t => 
            t.responsable === stat.name && 
            ['en-fila', 'en-proceso', 'revision'].includes(t.estado)
          ).length,
          totalAssigned: stat.assigned
        }));

      // Calcular tendencias de asignación (últimas 4 semanas)
      const assignmentTrends = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const weekAssignments = assignmentHistory.filter(assignment => {
          const assignmentDate = new Date(assignment.assignmentDate);
          return assignmentDate >= weekStart && assignmentDate <= weekEnd;
        });
        
        assignmentTrends.push({
          week: `Sem ${4 - i}`,
          assignments: weekAssignments.length,
          date: weekStart.toLocaleDateString('es-ES')
        });
      }

      setAnalytics({
        totalAssignments,
        avgResponseTime,
        topPerformers,
        assignmentTrends,
        workloadDistribution
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Análisis de Asignaciones</h2>
          <p className="text-gray-600">Métricas de rendimiento y distribución de carga de trabajo</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
          </select>
          
          <select
            value={selectedCollaborator}
            onChange={(e) => setSelectedCollaborator(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Todos los colaboradores</option>
            {collaborators.map(collaborator => (
              <option key={collaborator.id} value={collaborator.nombre}>
                {collaborator.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 border shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Asignaciones</p>
              <p className="text-2xl font-bold text-blue-600">{analytics.totalAssignments}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 border shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
              <p className="text-2xl font-bold text-purple-600">{analytics.avgResponseTime}d</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 border shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mejor Eficiencia</p>
              <p className="text-2xl font-bold text-green-600">
                {analytics.topPerformers[0]?.efficiency || 0}%
              </p>
            </div>
            <Award className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 border shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tendencia</p>
              <p className="text-2xl font-bold text-orange-600">
                <TrendingUp className="w-6 h-6 inline" />
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-lg p-6 border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-600" />
            Top Performers
          </h3>
          
          <div className="space-y-3">
            {analytics.topPerformers.map((performer, index) => (
              <div key={performer.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{performer.name}</p>
                    <p className="text-sm text-gray-600">
                      {performer.completed}/{performer.assigned} completadas
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-green-600">{performer.efficiency}%</p>
                  <p className="text-xs text-gray-500">{performer.avgTime}d promedio</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución de carga */}
        <div className="bg-white rounded-lg p-6 border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Distribución de Carga
          </h3>
          
          <div className="space-y-3">
            {analytics.workloadDistribution.map((item, index) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  <span className="text-sm text-gray-600">
                    {item.activeTasks} activas / {item.totalAssigned} total
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      item.activeTasks === 0 ? 'bg-green-500' :
                      item.activeTasks <= 2 ? 'bg-yellow-500' :
                      item.activeTasks <= 4 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${Math.min(100, (item.activeTasks / Math.max(1, Math.max(...analytics.workloadDistribution.map(w => w.activeTasks)))) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Métricas detalladas del colaborador seleccionado */}
      {selectedCollaborator && (
        <div className="bg-white rounded-lg p-6 border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Métricas Detalladas - {selectedCollaborator}
          </h3>
          <TaskAssignmentMetrics 
            collaboratorName={selectedCollaborator} 
            showDetailed={true} 
          />
        </div>
      )}

      {/* Tendencias de asignación */}
      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Tendencias de Asignación
        </h3>
        
        <div className="grid grid-cols-4 gap-4">
          {analytics.assignmentTrends.map((trend, index) => (
            <div key={trend.week} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{trend.assignments}</p>
              <p className="text-sm text-gray-600">{trend.week}</p>
              <p className="text-xs text-gray-500">{trend.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}