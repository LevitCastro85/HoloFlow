import React, { useEffect, useState } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { motion } from 'framer-motion';
    import { CheckCircle, XCircle, Loader2, MailWarning } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

    const ConfirmAccount = () => {
      const [status, setStatus] = useState('verifying');
      const [errorMessage, setErrorMessage] = useState('');

      useEffect(() => {
        const verifyToken = async () => {
          const params = new URLSearchParams(window.location.search);
          const token = params.get('token');
          const type = params.get('type') || 'signup';
          const email = params.get('email');

          if (!token || !email) {
            setErrorMessage('El enlace de verificación es inválido o está incompleto. Asegúrate de que la URL contenga el token y el correo electrónico.');
            setStatus('error');
            return;
          }

          const validTypes = ['signup', 'recovery', 'invite', 'magiclink', 'email_change'];
          if (!validTypes.includes(type)) {
            setErrorMessage('El tipo de verificación es inválido.');
            setStatus('error');
            return;
          }

          const { error } = await supabase.auth.verifyOtp({
            token,
            type: type,
            email: email,
          });

          if (error) {
            console.error('Error al confirmar cuenta:', error.message);
            setErrorMessage('El enlace de confirmación es inválido, ha expirado o el correo no coincide. Por favor, solicita un nuevo enlace.');
            setStatus('error');
          } else {
            setStatus('success');
            setTimeout(() => {
              window.location.href = '/';
            }, 3000);
          }
        };

        verifyToken();
      }, []);
      
      const handleGoHome = () => {
        window.location.href = '/';
      };

      const renderContent = () => {
        switch (status) {
          case 'verifying':
            return (
              <div className="flex flex-col items-center text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                <h2 className="text-xl font-semibold text-slate-800">Verificando tu cuenta</h2>
                <p className="text-slate-500 text-sm">Un momento, por favor...</p>
              </div>
            );
          case 'success':
            return (
              <div className="flex flex-col items-center text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <h2 className="text-xl font-semibold text-slate-800">¡Cuenta confirmada!</h2>
                <p className="text-slate-500 text-sm">Serás redirigido en unos instantes.</p>
              </div>
            );
          case 'error':
            return (
              <div className="flex flex-col items-center text-center space-y-4">
                <XCircle className="h-12 w-12 text-red-500" />
                <h2 className="text-xl font-semibold text-slate-800">Error de Verificación</h2>
                <p className="text-red-600 text-sm max-w-xs">{errorMessage}</p>
                <Button onClick={handleGoHome} variant="outline" className="mt-4">Volver al Inicio</Button>
              </div>
            );
          default:
            return null;
        }
      };

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-sm"
          >
            <Card className="shadow-lg border-slate-200/80 rounded-xl">
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight">
                    HoloFlow
                  </CardTitle>
                  <CardDescription className="pt-1">
                    Confirmación de cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-2">
                  <div className="flex justify-center items-center min-h-[150px]">
                    {renderContent()}
                  </div>
                </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default ConfirmAccount;