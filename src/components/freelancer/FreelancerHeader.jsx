import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Star, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FreelancerHeader({ currentUser, assignedTasks, onBackToAdmin }) {
  const getTaskStats = () => {
    if (!assignedTasks || assignedTasks.length === 0) {
      return { total: 0, enProceso: 0, completadas: 0 };
    }

    const total = assignedTasks.length;
    const enProceso = assignedTasks.filter(t => ['en-proceso', 'revision'].includes(t.status)).length;
    const completadas = assignedTasks.filter(t => t.status === 'entregado').length;

    return { total, enProceso, completadas };
  };

  const stats = getTaskStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b shadow-sm"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBackToAdmin}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Panel Admin
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Panel Freelancer - {currentUser?.name || 'Usuario'}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {currentUser?.specialty && (
                    <span className="flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      {currentUser.specialty}
                    </span>
                  )}
                  {currentUser?.email && (
                    <span className="flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {currentUser.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-600">Total Tareas</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.enProceso}</div>
              <div className="text-xs text-gray-600 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                En Proceso
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completadas}</div>
              <div className="text-xs text-gray-600 flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completadas
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}