import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/lib/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Key, Mail, User, UserPlus } from 'lucide-react';

export default function SignUp({ onBackToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({
        title: 'Contraseña débil',
        description: 'Tu contraseña debe tener al menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    const { error } = await authService.signUpNewUser(name, email, password);
    if (error) {
      toast({
        title: 'Error en el registro',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setIsSuccess(true);
    }
    setLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-6 p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#00ED0B]/20">
            <Mail className="h-10 w-10 text-[#4b0286]" />
          </div>
        </motion.div>
        <h2 className="text-2xl font-bold text-[#4b0286]">¡Casi listo! Revisa tu correo</h2>
        <p className="text-[#333333]">
          Te hemos enviado un enlace de confirmación. Haz clic en él para activar tu cuenta y poder continuar.
        </p>
        <p className="text-sm text-[#888888]">
          ¿No lo encuentras? Revisa tu carpeta de spam o correo no deseado.
        </p>
        <Button onClick={onBackToLogin} variant="outline" className="w-full border-[#e0e0e0] text-[#333333] hover:bg-gray-100">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio de sesión
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Crear una cuenta</h1>
        <p className="mt-2 text-gray-600">Únete a HoloFlow para empezar a colaborar.</p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
        <div className="space-y-2">
          <Label htmlFor="name-signup">Nombre Completo</Label>
          <div className="relative">
            <User className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="name-signup"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
              placeholder="Tu nombre completo"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-signup">Correo Electrónico</Label>
          <div className="relative">
            <Mail className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="email-signup"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              placeholder="tu@email.com"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password-signup">Contraseña</Label>
          <div className="relative">
            <Key className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="password-signup"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
        </div>
        <div className="pt-4 space-y-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            <UserPlus className="w-4 h-4 ml-2" />
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={onBackToLogin}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </form>
    </div>
  );
}