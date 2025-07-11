import React from 'react';
import { ListChecks, CheckCircle, AlertTriangle, Briefcase, Users } from 'lucide-react';
import StatCard from './StatCard';

export default function ProductionKPIs({ stats }) {
  return (
    <div>
      <div className="flex items-center mb-4">
        <ListChecks className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Indicadores de Producción
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Tareas Activas"
          value={stats.activeTasks}
          icon={ListChecks}
          color="blue"
        />
        <StatCard
          title="Tareas Completadas"
          value={stats.completedTasks}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Urgentes / Atrasadas"
          value={stats.urgentOrOverdue}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Marcas Activas"
          value={stats.activeBrands}
          icon={Briefcase}
          color="purple"
        />
        <StatCard
          title="Colaboradores Activos"
          value={stats.activeCollaborators}
          icon={Users}
          color="orange"
        />
      </div>
    </div>
  );
}