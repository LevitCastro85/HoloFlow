import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { authService } from '@/lib/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { LogIn, Mail, Key, Send, UserPlus } from 'lucide-react';
import SignUp from '@/components/auth/SignUp';

export default function Login() {
  const [view, setView] = useState('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async e => {
    e.preventDefault();
    setLoading(true);
    const { error } = await authService.signInWithPassword(email, password);
    if (error) {
      toast({
        title: 'Error de autenticación',
        description: 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  const handleForgotPassword = async e => {
    e.preventDefault();
    setLoading(true);
    const { error } = await authService.sendPasswordReset(email);
    if (error) {
      let description = error.message;
      if (error.message === 'Unable to process request') {
        description = 'No se pudo enviar el correo de recuperación. Esto suele deberse a una configuración de correo (SMTP) incompleta. Por favor, contacta al administrador.';
      }
      toast({
        title: 'Error al enviar correo',
        description,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Correo enviado',
        description: 'Revisa tu bandeja de entrada para restablecer tu contraseña.'
      });
      setView('signIn');
    }
    setLoading(false);
  };

  const renderContent = () => {
    switch (view) {
      case 'signUp':
        return <SignUp onBackToLogin={() => setView('signIn')} />;
      case 'forgotPassword':
        return (
          <div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Restablecer Contraseña</h1>
              <p className="mt-2 text-gray-600">Ingresa tu correo para recibir un enlace de recuperación.</p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
              <div className="space-y-2">
                <Label htmlFor="email-forgot">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="email-forgot"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              <div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Enlace'}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="text-sm text-center">
                <button
                  type="button"
                  onClick={() => setView('signIn')}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Volver a Iniciar Sesión
                </button>
              </div>
            </form>
          </div>
        );
      case 'signIn':
      default:
        return (
          <div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Bienvenido a HoloFlow</h1>
              <p className="mt-2 text-gray-500 font-medium tracking-wider uppercase">Studio Resource Planner</p>
              <p className="mt-6 text-gray-600">Inicia sesión para continuar</p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Key className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => setView('forgotPassword')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>
              <div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">¿No tienes cuenta?</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setView('signUp')}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Crear cuenta nueva
              </Button>
            </form>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12">
      <motion.div
        key={view}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg"
      >
        {renderContent()}
      </motion.div>
    </div>
  );
}