import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { authService } from '@/lib/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Key, Save, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
        description: 'Tu contraseña ha sido cambiada con éxito.',
      });
      onClose();
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar Contraseña</DialogTitle>
          <DialogDescription>
            Ingresa una nueva contraseña segura. Se recomienda cerrar sesión y volver a entrar después del cambio.
          </DialogDescription>
        </DialogHeader>
        <form className="mt-4 space-y-6" onSubmit={handleUpdatePassword}>
          <div className="space-y-2">
            <Label htmlFor="new-password-modal">Nueva Contraseña</Label>
            <div className="relative">
              <Key className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
              <Input
                id="new-password-modal"
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
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Contraseña
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}