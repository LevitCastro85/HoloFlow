import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import ProposalForm from '@/components/proposal/ProposalForm';
import ServiceSelector from '@/components/proposal/ServiceSelector';
import SelectedServices from '@/components/proposal/SelectedServices';
import ProposalSummary from '@/components/proposal/ProposalSummary';

export default function ProposalGenerator() {
  const [propuesta, setPropuesta] = useState({
    cliente: '',
    proyecto: '',
    servicios: [],
    descuento: 0,
    notas: '',
    validez: 30
  });

  const [generatedProposal, setGeneratedProposal] = useState(null);

  const calcularTotales = () => {
    const subtotal = propuesta.servicios.reduce((sum, servicio) => 
      sum + (servicio.cantidad * servicio.precioUnitario), 0
    );
    const descuentoAmount = (subtotal * propuesta.descuento) / 100;
    const total = subtotal - descuentoAmount;
    const tiempoTotal = propuesta.servicios.reduce((sum, servicio) => 
      sum + (servicio.cantidad * servicio.tiempoEstimado), 0
    );
    
    return { subtotal, descuentoAmount, total, tiempoTotal };
  };

  const generarPropuesta = () => {
    if (!propuesta.cliente || !propuesta.proyecto || propuesta.servicios.length === 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const totales = calcularTotales();
    const propuestaGenerada = {
      ...propuesta,
      ...totales,
      fechaCreacion: new Date(),
      numero: `PROP-${Date.now().toString().slice(-6)}`
    };

    setGeneratedProposal(propuestaGenerada);
    
    // Guardar propuesta en localStorage para métricas
    const savedProposals = JSON.parse(localStorage.getItem('generatedProposals') || '[]');
    savedProposals.push(propuestaGenerada);
    localStorage.setItem('generatedProposals', JSON.stringify(savedProposals));
    
    toast({
      title: "¡Propuesta generada!",
      description: "La propuesta ha sido creada exitosamente"
    });
  };

  const totales = calcularTotales();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Generador de Propuestas</h1>
        <p className="text-gray-600 mt-1">Crea propuestas profesionales con precios personalizados</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProposalForm propuesta={propuesta} setPropuesta={setPropuesta} />
          <ServiceSelector propuesta={propuesta} setPropuesta={setPropuesta} />
          <SelectedServices propuesta={propuesta} setPropuesta={setPropuesta} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notas Adicionales</h2>
            <textarea
              value={propuesta.notas}
              onChange={(e) => setPropuesta(prev => ({ ...prev, notas: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Condiciones especiales, términos de pago, etc..."
            />
          </motion.div>
        </div>

        <div className="space-y-6">
          <ProposalSummary 
            propuesta={propuesta}
            totales={totales}
            generatedProposal={generatedProposal}
            onGenerarPropuesta={generarPropuesta}
          />
        </div>
      </div>
    </div>
  );
}