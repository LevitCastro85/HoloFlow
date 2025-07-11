import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { FileText, Image, Video, Archive } from 'lucide-react';

export function useDeliveryUploader() {
  const [deliveryMethod, setDeliveryMethod] = useState('file');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [urlDeliveries, setUrlDeliveries] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [urlDescription, setUrlDescription] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      uploadedAt: new Date().toISOString()
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    toast({
      title: "Archivos agregados",
      description: `${files.length} archivo(s) agregado(s) correctamente`
    });
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const addUrlDelivery = () => {
    if (!newUrl.trim()) {
      toast({
        title: "URL requerida",
        description: "Por favor ingresa una URL válida",
        variant: "destructive"
      });
      return;
    }

    try {
      new URL(newUrl);
    } catch {
      toast({
        title: "URL inválida",
        description: "Por favor ingresa una URL válida",
        variant: "destructive"
      });
      return;
    }

    const urlDelivery = {
      id: Date.now() + Math.random(),
      url: newUrl,
      description: urlDescription || 'Entregable',
      addedAt: new Date().toISOString(),
      platform: detectPlatform(newUrl)
    };

    setUrlDeliveries(prev => [...prev, urlDelivery]);
    setNewUrl('');
    setUrlDescription('');
    
    toast({
      title: "URL agregada",
      description: "La URL de descarga ha sido agregada correctamente"
    });
  };

  const removeUrl = (urlId) => {
    setUrlDeliveries(prev => prev.filter(url => url.id !== urlId));
  };

  const detectPlatform = (url) => {
    if (url.includes('drive.google.com')) return 'Google Drive';
    if (url.includes('dropbox.com')) return 'Dropbox';
    if (url.includes('wetransfer.com')) return 'WeTransfer';
    if (url.includes('onedrive.live.com')) return 'OneDrive';
    if (url.includes('mega.nz')) return 'MEGA';
    return 'Enlace personalizado';
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return Image;
    if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) return Video;
    if (['zip', 'rar', '7z'].includes(extension)) return Archive;
    return FileText;
  };

  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'ai', 'psd'].includes(extension)) return 'image';
    if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) return 'video';
    if (['mp3', 'wav', 'aac', 'flac'].includes(extension)) return 'audio';
    if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) return 'document';
    return 'archive';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    deliveryMethod,
    setDeliveryMethod,
    uploadedFiles,
    setUploadedFiles,
    urlDeliveries,
    setUrlDeliveries,
    newUrl,
    setNewUrl,
    urlDescription,
    setUrlDescription,
    deliveryNotes,
    setDeliveryNotes,
    handleFileUpload,
    removeFile,
    addUrlDelivery,
    removeUrl,
    getFileType,
    formatFileSize,
    getFileIcon
  };
}