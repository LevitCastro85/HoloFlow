import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MailCheck, ArrowRight, Loader2, ShieldX } from 'lucide-react';
import { authService } from '@/lib/services/authService';

export default function EmailConfirmedPage({ onContinue }) {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (token && type === 'signup') {
        const { error } = await authService.verifyOtp(token, type);
        if (error) {
          setStatus('error');
          setErrorMsg(error.message || 'El enlace de confirmación es inválido o ha expirado. Por favor, intenta registrarte de nuevo.');
        } else {
          setStatus('success');
        }
      } else {
        setStatus('error');
        setErrorMsg('URL de confirmación no válida. No se encontró el token necesario.');
      }
    };

    verifyToken();
  }, []);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 mb-6">
              <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Verificando tu cuenta...
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Por favor, espera un momento mientras confirmamos tu correo electrónico.
            </p>
          </>
        );
      case 'success':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#00ED0B]/20 mb-6">
              <MailCheck className="h-10 w-10 text-[#4b0286]" />
            </div>
            <h2 className="text-3xl font-bold text-[#4b0286] mb-4">
              ¡Tu cuenta ha sido confirmada!
            </h2>
            <p className="text-lg text-[#333333] mb-8">
              Gracias por verificar tu correo electrónico. Estás a un solo paso de unirte a la revolución creativa con HoloFlow.
            </p>
            <Button
              onClick={onContinue}
              className="w-full text-lg font-bold py-6 bg-[#00ED0B] text-black hover:bg-[#00d50a]"
            >
              Completar mi perfil
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-xs text-[#888888] mt-8">
              Serás redirigido para completar tu información de colaborador.
            </p>
          </>
        );
      case 'error':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
              <ShieldX className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              Error de Confirmación
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              No pudimos verificar tu cuenta.
            </p>
            <p className="text-sm text-gray-500 bg-red-50 p-3 rounded-md mb-8">{errorMsg}</p>
            <Button
              onClick={() => window.location.href = '/'}
              className="w-full text-lg font-bold py-6 bg-gray-600 text-white hover:bg-gray-700"
            >
              Volver al inicio
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f9f9f9]">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-lg p-8 md:p-12 bg-white rounded-2xl shadow-lg text-center border border-[#e0e0e0]"
      >
        {renderContent()}
      </motion.div>
    </div>
  );
}