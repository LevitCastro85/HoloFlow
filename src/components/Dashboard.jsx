import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  tasksService,
  contractsService,
  brandsService,
  collaboratorsService,
  servicesService,
} from '@/lib/supabaseHelpers';
import ProductionKPIs from '@/components/dashboard/ProductionKPIs';
import FinancialKPIs from '@/components/dashboard/FinancialKPIs';
import IntelligentView from '@/components/dashboard/IntelligentView';

export default function Dashboard() {
  const { profile } = useAuth();
  const [data, setData] = useState({
    tasks: [],
    contracts: [],
    brands: [],
    collaborators: [],
    services: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          tasksData,
          contractsData,
          brandsData,
          collaboratorsData,
          servicesData,
        ] = await Promise.all([
          tasksService.getAll(),
          contractsService.getAll(),
          brandsService.getAll(),
          collaboratorsService.getAll(),
          servicesService.getAll(),
        ]);
        setData({
          tasks: tasksData || [],
          contracts: contractsData || [],
          brands: brandsData || [],
          collaborators: collaboratorsData || [],
          services: servicesData || [],
        });
      } catch (err) {
        setError('No se pudieron cargar los datos del dashboard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const productionStats = useMemo(() => {
    const activeTasks = data.tasks.filter((t) =>
      ['en-fila', 'en-proceso', 'revision', 'requiere-atencion'].includes(
        t.status
      )
    );
    const overdueTasks = activeTasks.filter(
      (t) => new Date(t.due_date) < new Date()
    );

    return {
      activeTasks: activeTasks.length,
      completedTasks: data.tasks.filter((t) => t.status === 'entregado').length,
      urgentOrOverdue:
        data.tasks.filter((t) => t.priority === 'urgente').length +
        overdueTasks.length,
      activeBrands: [...new Set(data.brands.map((b) => b.id))].length,
      activeCollaborators: data.collaborators.filter(
        (c) => c.availability !== 'no disponible'
      ).length,
    };
  }, [data]);

  const financialStats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const soldThisMonth = data.contracts
      .filter((c) => new Date(c.created_at) >= startOfMonth)
      .reduce((sum, c) => sum + (c.final_price || 0), 0);

    const accumulatedThisYear = data.contracts
      .filter((c) => new Date(c.created_at) >= startOfYear)
      .reduce((sum, c) => sum + (c.final_price || 0), 0);

    const renewableIncome = data.contracts
      .filter((c) => c.status === 'activo' && c.frequency === 'mensual')
      .reduce((sum, c) => sum + (c.final_price || 0), 0);
      
    const activeTasksValue = data.tasks
      .filter((t) => ['en-fila', 'en-proceso', 'revision'].includes(t.status))
      .reduce((sum, t) => sum + (t.price || 0), 0);

    return {
      soldThisMonth,
      accumulatedThisYear,
      renewableIncome,
      activeTasksValue,
      activeContracts: data.contracts.filter((c) => c.status === 'activo').length,
    };
  }, [data]);

  const rankingData = useMemo(() => {
    const activeTasks = data.tasks.filter((t) =>
      ['en-fila', 'en-proceso', 'revision', 'requiere-atencion'].includes(
        t.status
      )
    );

    const brandTaskCounts = activeTasks.reduce((acc, task) => {
      acc[task.brand_id] = (acc[task.brand_id] || 0) + 1;
      return acc;
    }, {});

    const topBrands = Object.entries(brandTaskCounts)
      .map(([brand_id, count]) => ({
        id: brand_id,
        name: data.brands.find((b) => b.id == brand_id)?.name || 'Marca Desconocida',
        value: count,
        metric: 'tareas activas',
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const serviceRequestCounts = data.tasks.reduce((acc, task) => {
      if (task.service_id) {
        acc[task.service_id] = (acc[task.service_id] || 0) + 1;
      }
      return acc;
    }, {});

    const topServices = Object.entries(serviceRequestCounts)
      .map(([service_id, count]) => ({
        id: service_id,
        name: data.services.find((s) => s.id == service_id)?.name || 'Servicio Desconocido',
        value: count,
        metric: 'solicitudes',
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const topContracts = data.contracts
      .sort((a, b) => (b.final_price || 0) - (a.final_price || 0))
      .slice(0, 5)
      .map((contract) => ({
        id: contract.id,
        name: contract.client?.name || 'Cliente Desconocido',
        value: contract.final_price || 0,
        metric: 'MXN',
      }));

    return { topBrands, topServices, topContracts };
  }, [data]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}{profile ? `, ${profile.name}` : ''}
        </h1>
        <div className="flex items-center justify-between mt-2">
            <p className="text-md text-gray-500">Aquí tienes un resumen del estado de tu operación.</p>
            {profile && (
                <span className="inline-block px-3 py-1 text-sm font-semibold text-purple-800 bg-purple-100 rounded-full shadow-sm">
                    {profile.role}
                </span>
            )}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProductionKPIs stats={productionStats} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <FinancialKPIs stats={financialStats} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <IntelligentView rankings={rankingData} />
      </motion.div>
    </div>
  );
}