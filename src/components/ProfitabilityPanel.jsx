import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart,
  BarChart3,
  Calculator,
  Target
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ProfitabilityPanel() {
  const [profitabilityData, setProfitabilityData] = useState({
    clientes: [],
    servicios: [],
    resumenGeneral: {
      ingresosTotales: 0,
      costosTotales: 0,
      margenTotal: 0,
      tareasEntregadas: 0
    }
  });

  useEffect(() => {
    // Cargar datos reales de tareas y calcular rentabilidad
    const savedTasks = localStorage.getItem('creativeTasks');
    const savedProposals = localStorage.getItem('generatedProposals');
    
    let realData = { clientes: [], servicios: [] };
    
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      const completedTasks = tasks.filter(task => task.estado === 'entregado');
      
      // Agrupar por cliente
      const clientData = {};
      completedTasks.forEach(task => {
        if (!clientData[task.cliente]) {
          clientData[task.cliente] = {
            nombre: task.cliente,
            tareasEntregadas: 0,
            ingresosGenerados: 0,
            costosInternos: 0
          };
        }
        
        clientData[task.cliente].tareasEntregadas++;
        clientData[task.cliente].ingresosGenerados += task.precioTarea || 0;
        clientData[task.cliente].costosInternos += (task.precioTarea || 0) * 0.6; // 60% costos estimados
      });
      
      // Agrupar por servicio
      const serviceData = {};
      completedTasks.forEach(task => {
        if (!serviceData[task.tipo]) {
          serviceData[task.tipo] = {
            tipo: task.tipo.charAt(0).toUpperCase() + task.tipo.slice(1),
            tareasEntregadas: 0,
            ingresosGenerados: 0,
            costosInternos: 0
          };
        }
        
        serviceData[task.tipo].tareasEntregadas++;
        serviceData[task.tipo].ingresosGenerados += task.precioTarea || 0;
        serviceData[task.tipo].costosInternos += (task.precioTarea || 0) * 0.6;
      });
      
      // Calcular márgenes
      realData.clientes = Object.values(clientData).map((cliente, index) => ({
        id: index + 1,
        ...cliente,
        margenEstimado: cliente.ingresosGenerados - cliente.costosInternos,
        porcentajeMargen: cliente.ingresosGenerados > 0 ? 
          ((cliente.ingresosGenerados - cliente.costosInternos) / cliente.ingresosGenerados) * 100 : 0
      }));
      
      realData.servicios = Object.values(serviceData).map(servicio => ({
        ...servicio,
        margenEstimado: servicio.ingresosGenerados - servicio.costosInternos,
        porcentajeMargen: servicio.ingresosGenerados > 0 ? 
          ((servicio.ingresosGenerados - servicio.costosInternos) / servicio.ingresosGenerados) * 100 : 0
      }));
    }
    
    // Si no hay datos reales, usar datos de ejemplo
    const mockData = realData.clientes.length > 0 ? realData : {
      clientes: [
        {
          id: 1,
          nombre: 'Marca Deportiva XYZ',
          tareasEntregadas: 12,
          ingresosGenerados: 312000,
          costosInternos: 164000,
          margenEstimado: 148000,
          porcentajeMargen: 47.4
        },
        {
          id: 2,
          nombre: 'Cosmética Natural',
          tareasEntregadas: 8,
          ingresosGenerados: 196000,
          costosInternos: 108000,
          margenEstimado: 88000,
          porcentajeMargen: 44.9
        },
        {
          id: 3,
          nombre: 'E-commerce Fashion',
          tareasEntregadas: 15,
          ingresosGenerados: 450000,
          costosInternos: 224000,
          margenEstimado: 226000,
          porcentajeMargen: 50.2
        }
      ],
      servicios: [
        {
          tipo: 'Diseño Gráfico',
          tareasEntregadas: 18,
          ingresosGenerados: 432000,
          costosInternos: 216000,
          margenEstimado: 216000,
          porcentajeMargen: 50.0
        },
        {
          tipo: 'Video/Reel',
          tareasEntregadas: 12,
          ingresosGenerados: 360000,
          costosInternos: 192000,
          margenEstimado: 168000,
          porcentajeMargen: 46.7
        },
        {
          tipo: 'Fotografía',
          tareasEntregadas: 5,
          ingresosGenerados: 156000,
          costosInternos: 72000,
          margenEstimado: 84000,
          porcentajeMargen: 53.8
        }
      ]
    };

    // Calcular resumen general
    const ingresosTotales = mockData.clientes.reduce((sum, cliente) => sum + cliente.ingresosGenerados, 0);
    const costosTotales = mockData.clientes.reduce((sum, cliente) => sum + cliente.costosInternos, 0);
    const margenTotal = ingresosTotales - costosTotales;
    const tareasEntregadas = mockData.clientes.reduce((sum, cliente) => sum + cliente.tareasEntregadas, 0);

    setProfitabilityData({
      ...mockData,
      resumenGeneral: {
        ingresosTotales,
        costosTotales,
        margenTotal,
        tareasEntregadas
      }
    });
  }, []);

  const getMarginColor = (percentage) => {
    if (percentage >= 50) return 'text-green-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMarginBgColor = (percentage) => {
    if (percentage >= 50) return 'bg-green-100';
    if (percentage >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Rentabilidad</h1>
        <p className="text-gray-600 mt-1">Análisis financiero por cliente y servicio</p>
      </div>

      {/* Resumen general */}
      <div className="grid gap-6 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">
              {formatCurrency(profitabilityData.resumenGeneral.ingresosTotales)}
            </h3>
            <p className="text-sm font-medium text-gray-700">Ingresos Totales</p>
            <p className="text-xs text-gray-500">Este período</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">
              {formatCurrency(profitabilityData.resumenGeneral.costosTotales)}
            </h3>
            <p className="text-sm font-medium text-gray-700">Costos Totales</p>
            <p className="text-xs text-gray-500">Internos y externos</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">
              {formatCurrency(profitabilityData.resumenGeneral.margenTotal)}
            </h3>
            <p className="text-sm font-medium text-gray-700">Margen Total</p>
            <p className="text-xs text-gray-500">
              {((profitabilityData.resumenGeneral.margenTotal / profitabilityData.resumenGeneral.ingresosTotales) * 100).toFixed(1)}% de margen
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">
              {profitabilityData.resumenGeneral.tareasEntregadas}
            </h3>
            <p className="text-sm font-medium text-gray-700">Tareas Entregadas</p>
            <p className="text-xs text-gray-500">Este período</p>
          </div>
        </motion.div>
      </div>

      {/* Rentabilidad por cliente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border"
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Rentabilidad por Cliente</h2>
          <p className="text-gray-600">Análisis detallado de ingresos y márgenes</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">Cliente</th>
                <th className="text-left p-4 font-semibold text-gray-900">Tareas</th>
                <th className="text-left p-4 font-semibold text-gray-900">Ingresos</th>
                <th className="text-left p-4 font-semibold text-gray-900">Costos</th>
                <th className="text-left p-4 font-semibold text-gray-900">Margen</th>
                <th className="text-left p-4 font-semibold text-gray-900">% Margen</th>
              </tr>
            </thead>
            <tbody>
              {profitabilityData.clientes.map((cliente, index) => (
                <motion.tr
                  key={cliente.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-gray-900">{cliente.nombre}</td>
                  <td className="p-4 text-gray-700">{cliente.tareasEntregadas}</td>
                  <td className="p-4 text-gray-700">{formatCurrency(cliente.ingresosGenerados)}</td>
                  <td className="p-4 text-gray-700">{formatCurrency(cliente.costosInternos)}</td>
                  <td className="p-4 font-semibold text-gray-900">{formatCurrency(cliente.margenEstimado)}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMarginBgColor(cliente.porcentajeMargen)} ${getMarginColor(cliente.porcentajeMargen)}`}>
                      {cliente.porcentajeMargen.toFixed(1)}%
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Rentabilidad por servicio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border"
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Rentabilidad por Servicio</h2>
          <p className="text-gray-600">Análisis de márgenes por tipo de contenido</p>
        </div>
        
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            {profitabilityData.servicios.map((servicio, index) => (
              <motion.div
                key={servicio.tipo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{servicio.tipo}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMarginBgColor(servicio.porcentajeMargen)} ${getMarginColor(servicio.porcentajeMargen)}`}>
                    {servicio.porcentajeMargen.toFixed(1)}%
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tareas entregadas</span>
                    <span className="font-medium">{servicio.tareasEntregadas}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ingresos</span>
                    <span className="font-medium text-green-600">{formatCurrency(servicio.ingresosGenerados)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Costos</span>
                    <span className="font-medium text-red-600">{formatCurrency(servicio.costosInternos)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="text-gray-600">Margen</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(servicio.margenEstimado)}</span>
                  </div>
                </div>
                
                {/* Barra de progreso del margen */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${servicio.porcentajeMargen}%` }}
                      transition={{ delay: index * 0.2, duration: 1 }}
                      className={`h-2 rounded-full ${
                        servicio.porcentajeMargen >= 50 ? 'bg-green-500' :
                        servicio.porcentajeMargen >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}