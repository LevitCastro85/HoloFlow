import React, { useState, useEffect } from 'react';
import { KeyRound, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { collaboratorsService } from '@/lib/services/collaboratorsService';
import { authService } from '@/lib/services/authService';
import { ROLES, hasPermission } from '@/lib/permissions';
import { useAuth } from '@/contexts/AuthContext';

export default function UserManagementModal({ user: managedUser, isOpen, onClose, onSave }) {
  const [role, setRole] = useState(managedUser?.role || ROLES.FREELANCE);
  const [isSaving, setIsSaving] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { profile: currentUserProfile, user: authUser, signOut } = useAuth();

  const canChangePasswordDirectly = hasPermission(currentUserProfile?.role, 'canChangePasswordsDirectly', authUser);

  useEffect(() => {
    if (managedUser) {
      setRole(managedUser.role || ROLES.FREELANCE);
      setNewPassword('');
    }
  }, [managedUser]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(managedUser.id, { role });
      toast({
        title: "Rol actualizado",
        description: `Se ha guardado el nuevo rol para ${managedUser.name}.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudo actualizar el rol.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSendPasswordReset = async () => {
    try {
      await collaboratorsService.sendPasswordReset(managedUser.email);
      toast({
        title: 'Correo enviado',
        description: `Se ha enviado un correo para restablecer la contraseña a ${managedUser.email}.`
      });
    } catch(error) {
      let description = error.message;
      if (error.message === 'Unable to process request') {
        description = 'No se pudo enviar el correo de recuperación. Esto suele deberse a una configuración de correo (SMTP) incompleta. Por favor, contacta al administrador.';
      }
      toast({
        title: 'Error al enviar correo',
        description: description,
        variant: 'destructive'
      });
    }
  };

  const handleChangePassword = async () => {
    setIsChangingPassword(true);
    try {
      const { data, error } = await authService.adminUpdateUserPassword(managedUser.user_id, newPassword);

      if (error) {
        if (error.message.toLowerCase().includes('unauthorized')) {
          toast({
            title: "Sesión Expirada",
            description: "Tu sesión ya no es válida. Por favor, inicia sesión de nuevo.",
            variant: "destructive",
          });
          await signOut();
          return;
        }
        throw error;
      }
      
      toast({ title: "Éxito", description: `Contraseña para ${managedUser.name} actualizada.` });
      setNewPassword('');
    } catch (e) {
      toast({ title: "Error al cambiar contraseña", description: e.message, variant: "destructive" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!managedUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestionar Rol de Usuario</DialogTitle>
          <DialogDescription>
            Configura el rol y las credenciales para <span className="font-bold">{managedUser.name}</span>. El acceso se gestiona desde la tarjeta.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <label htmlFor="role-select" className="font-medium">Rol del usuario</label>
            <select id="role-select" value={role} onChange={(e) => setRole(e.target.value)} className="p-2 border rounded-md">
              {Object.values(ROLES).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          {managedUser.has_system_access && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <KeyRound className="w-4 h-4 mr-2" />
                  Enviar reseteo de contraseña por correo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Confirmar envío de correo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Se enviará un correo electrónico a <strong>{managedUser.email}</strong> con instrucciones para establecer o restablecer su contraseña.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSendPasswordReset}>Confirmar y Enviar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {canChangePasswordDirectly && managedUser.has_system_access && managedUser.user_id && (
            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="new-password" className='text-gray-800 font-semibold'>Cambiar Contraseña Directamente (Solo Director)</Label>
              <div className="flex space-x-2">
                <div className="relative flex-grow">
                  <Lock className="absolute w-4 h-4 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={!newPassword || newPassword.length < 6 || isChangingPassword}>
                      {isChangingPassword ? 'Cambiando...' : 'Cambiar'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Confirmar cambio de contraseña?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esto cambiará inmediatamente la contraseña para <strong>{managedUser.name}</strong>. El usuario no será notificado por correo. ¿Estás seguro?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleChangePassword}>Confirmar y Cambiar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <p className="text-xs text-gray-500">Acción de alto privilegio. La contraseña debe tener al menos 6 caracteres.</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}