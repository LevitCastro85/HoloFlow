import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import StatCard from './StatCard';
import { formatCurrency } from '@/lib/utils';

export default function FinancialKPIs({ stats }) {
  return (
    <div>
      <div className="flex items-center mb-4">
        <DollarSign className="w-6 h-6 text-green-600 mr-3" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Indicadores Financieros
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Vendido este Mes"
          value={formatCurrency(stats.soldThisMonth)}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Acumulado del Año"
          value={formatCurrency(stats.accumulatedThisYear)}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Ingreso Renovable"
          value={formatCurrency(stats.renewableIncome)}
          description="Proyección mensual"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Valor Tareas Activas"
          value={formatCurrency(stats.activeTasksValue)}
          icon={DollarSign}
          color="purple"
        />
        <StatCard
          title="Contratos Vigentes"
          value={stats.activeContracts}
          icon={DollarSign}
          color="indigo"
        />
      </div>
    </div>
  );
}