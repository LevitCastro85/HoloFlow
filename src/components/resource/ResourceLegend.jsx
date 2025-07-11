import React from 'react';
import { statusInfo } from '@/lib/resourceConstants';

export default function ResourceLegend() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Estados de Recursos</h3>
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(statusInfo).map(([status, { label, color }]) => (
          <div key={status} className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full border ${color}`}></div>
            <span className="text-sm text-gray-700">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}