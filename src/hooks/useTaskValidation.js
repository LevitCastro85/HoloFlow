import { useState, useCallback } from 'react';

export function useTaskValidation(formData, taskLimitInfo, editingTask) {
  const [errors, setErrors] = useState({});

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.client_id) {
      newErrors.client_id = 'El cliente es obligatorio';
    }

    if (!formData.title?.trim()) {
      newErrors.title = 'El título es obligatorio';
    }

    if (!formData.service_id) {
      newErrors.service_id = 'El servicio requerido es obligatorio';
    }

    if (!formData.due_date) {
      newErrors.due_date = 'La fecha de entrega es obligatoria';
    } else {
      const fechaEntrega = new Date(formData.due_date);
      const fechaSolicitud = new Date(formData.request_date);
      
      if (fechaEntrega <= fechaSolicitud) {
        newErrors.due_date = 'La fecha de entrega debe ser posterior a la fecha de solicitud';
      }
    }

    if (!taskLimitInfo.canCreate && !editingTask) {
      newErrors.general = `Esta marca ha alcanzado el límite de ${taskLimitInfo.limit} tareas activas`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, taskLimitInfo, editingTask]);

  return { errors, validateForm, setErrors };
}