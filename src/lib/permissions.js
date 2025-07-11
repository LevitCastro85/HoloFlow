import { Crown, Shield, User } from 'lucide-react';

export const ROLES = {
  DIRECTOR: 'Director',
  ADMINISTRADOR: 'Administrador',
  OPERADOR: 'Operador',
  FREELANCE: 'Freelance',
};

export const permissions = {
  [ROLES.DIRECTOR]: {
    canManageUsers: true,
    editAll: true,
    editBranding: true,
    createTasks: true,
    canChangePasswordsDirectly: true,
  },
  [ROLES.ADMINISTRADOR]: {
    canManageUsers: true,
    editAll: true,
    editBranding: true,
    createTasks: true,
    canChangePasswordsDirectly: false,
  },
  [ROLES.OPERADOR]: {
    canManageUsers: false,
    editAll: false,
    editBranding: false,
    createTasks: false,
    canChangePasswordsDirectly: false,
  },
  [ROLES.FREELANCE]: {
    canManageUsers: false,
    editAll: false,
    editBranding: false,
    createTasks: false,
    canChangePasswordsDirectly: false,
  },
};

export const hasPermission = (userRole, permissionKey, user) => {
  if (user?.user_metadata?.is_super_admin) {
    return true;
  }

  const superAdminEmails = ['levit.delfin@gmail.com'];
  if (user?.email && superAdminEmails.includes(user.email)) {
    return true;
  }

  if (!userRole) return false;
  const userPermissions = permissions[userRole];
  return !!userPermissions?.[permissionKey];
};

export const roleInfoMap = {
  [ROLES.DIRECTOR]: { icon: Crown, color: 'text-purple-600 bg-purple-100' },
  [ROLES.ADMINISTRADOR]: { icon: Shield, color: 'text-blue-600 bg-blue-100' },
  [ROLES.OPERADOR]: { icon: User, color: 'text-green-600 bg-green-100' },
  [ROLES.FREELANCE]: { icon: User, color: 'text-yellow-600 bg-yellow-100' },
};