import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { tasksService, servicesService, clientsService, storageService } from '@/lib/supabaseHelpers';

const getFileType = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'ai', 'psd'].includes(extension)) return 'image';
  if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) return 'video';
  if (['mp3', 'wav', 'aac', 'flac'].includes(extension)) return 'audio';
  if (['pdf', 'doc', 'docx', 'txt', 'psd'].includes(extension)) return 'document';
  return 'archive';
};

export default function useResourceUploadForm(isOpen, onSave, onClose) {
  const [deliveryMethod, setDeliveryMethod] = useState('file');
  const [files, setFiles] = useState([]);
  const [urlData, setUrlData] = useState({ url: '', platform: '', description: '' });
  const [formData, setFormData] = useState({
    taskId: '',
    serviceId: '',
    clientId: '',
    deliveryNotes: '',
    tags: '',
    category: 'general'
  });
  const [availableTasks, setAvailableTasks] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [availableClients, setAvailableClients] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const loadAvailableData = useCallback(async () => {
    try {
      const [tasks, services, clients] = await Promise.all([
        tasksService.getAll(),
        servicesService.getAll(),
        clientsService.getAll()
      ]);
      const activeTasks = (tasks || []).filter(task => 
        ['en-proceso', 'revision', 'en-fila'].includes(task.status)
      );
      setAvailableTasks(activeTasks);
      setAvailableServices(services || []);
      setAvailableClients(clients || []);
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los datos para el formulario.", variant: "destructive" });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadAvailableData();
    }
  }, [isOpen, loadAvailableData]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUrlChange = (e) => {
    const { name, value } = e.target;
    setUrlData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = useCallback(() => {
    setDeliveryMethod('file');
    setFiles([]);
    setUrlData({ url: '', platform: '', description: '' });
    setFormData({
      taskId: '',
      serviceId: '',
      clientId: '',
      deliveryNotes: '',
      tags: '',
      category: 'general'
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    if (deliveryMethod === 'file' && files.length === 0) {
      toast({ title: "Error de validación", description: "Debes seleccionar al menos un archivo para subir.", variant: "destructive" });
      setIsUploading(false);
      return;
    }

    if (deliveryMethod === 'url' && (!urlData.url.trim() || !urlData.url.startsWith('http'))) {
      toast({ title: "Error de validación", description: "Debes proporcionar una URL válida que comience con http o https.", variant: "destructive" });
      setIsUploading(false);
      return;
    }

    const selectedTask = availableTasks.find(t => t.id == formData.taskId);

    const baseResourceData = {
      status: 'pendiente-revision',
      task_id: formData.taskId ? parseInt(formData.taskId) : null,
      brand_id: selectedTask?.brand_id || null,
      service_id: formData.serviceId ? parseInt(formData.serviceId) : null,
      client_id: formData.clientId ? parseInt(formData.clientId) : null,
      submitted_by: 'Usuario Supervisor',
      delivery_notes: formData.deliveryNotes,
      category: formData.category,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : ['manual', 'nuevo'],
      upload_date: new Date().toISOString(),
    };

    try {
      let resourcesToSave = [];
      if (deliveryMethod === 'file') {
        const uploadPromises = files.map(async (file) => {
          const fileUrl = await storageService.uploadFile(file, 'resources');
          
          if (!fileUrl || typeof fileUrl !== 'string' || !fileUrl.includes('supabase.co/storage/v1')) {
             throw new Error(`Error Crítico: El servicio de almacenamiento no devolvió una URL de Supabase válida para ${file.name}. URL recibida: ${fileUrl || 'ninguna'}`);
          }

          return {
            ...baseResourceData,
            name: file.name,
            description: formData.deliveryNotes || `Archivo subido: ${file.name}`,
            file_name: file.name,
            file_url: fileUrl,
            file_type: getFileType(file.name),
            size: file.size,
            delivery_method: 'file',
          };
        });
        
        resourcesToSave = await Promise.all(uploadPromises);

      } else {
        const urlResource = {
          ...baseResourceData,
          name: urlData.description || urlData.url,
          description: urlData.description || 'Recurso compartido por URL',
          file_name: urlData.description || 'Enlace',
          file_url: urlData.url,
          file_type: 'url',
          size: 0,
          platform: urlData.platform,
          delivery_method: 'url',
        };
        resourcesToSave.push(urlResource);
      }

      if (resourcesToSave.length > 0) {
        onSave(resourcesToSave);
      }
      
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error en el proceso de subida:", error);
      toast({ title: "Error crítico en la subida", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    deliveryMethod,
    setDeliveryMethod,
    files,
    handleFileChange,
    urlData,
    handleUrlChange,
    formData,
    handleFormChange,
    availableTasks,
    availableServices,
    availableClients,
    handleSubmit,
    isUploading,
  };
}