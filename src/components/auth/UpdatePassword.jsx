import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { useAuth } from '@/contexts/AuthContext';
    import { authService } from '@/lib/services/authService';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { Key, Save } from 'lucide-react';

    export default function UpdatePassword({ onFinished }) {
      const [password, setPassword] = useState('');
      const [loading, setLoading] = useState(false);
      const { signOut } = useAuth();
      const { toast } = useToast();

      const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            toast({
                title: 'Contraseña muy corta',
                description: 'La contraseña debe tener al menos 6 caracteres.',
                variant: 'destructive',
            });
            return;
        }
        setLoading(true);
        const { error } = await authService.updateUserPassword(password);
        if (error) {
          toast({
            title: 'Error al actualizar contraseña',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Contraseña actualizada',
            description: 'Tu contraseña ha sido cambiada. Por favor, inicia sesión de nuevo.',
          });
          await signOut();
          if (onFinished) onFinished();
        }
        setLoading(false);
      };

      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg"
          >
            <div>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Crea tu nueva contraseña</h1>
                <p className="mt-2 text-gray-600">Ingresa una contraseña segura y fácil de recordar.</p>
              </div>
              <form className="mt-8 space-y-6" onSubmit={handleUpdatePassword}>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva Contraseña</Label>
                  <div className="relative">
                    <Key className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      id="new-password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Contraseña'}
                    <Save className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      );
    }