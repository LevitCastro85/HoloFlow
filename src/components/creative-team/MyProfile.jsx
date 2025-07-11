import React, { useState, useEffect } from 'react';
    import { useAuth } from '@/contexts/AuthContext';
    import { collaboratorsService } from '@/lib/services/collaboratorsService';
    import { storageService } from '@/lib/services/storageService';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Loader2, Save, Key, AlertCircle } from 'lucide-react';
    import ProfilePhotoEditor from '@/components/auth/ProfilePhotoEditor';
    import ChangePasswordModal from '@/components/auth/ChangePasswordModal';
    import { mexicoStates } from '@/lib/mexico-locations';
    import { v4 as uuidv4 } from 'uuid';

    const collaboratorTypes = ['Interno', 'Freelancer', 'Agencia', 'Otro'];
    const ALL_SPECIALTIES = [
      'Diseño Gráfico', 'Diseño Web', 'Desarrollo Frontend', 'Desarrollo Backend',
      'Copywriting', 'Marketing Digital', 'SEO/SEM', 'Gestión de Proyectos',
      'Producción Audiovisual', 'Edición de Video', 'Animación / Motion Graphics', 'Ilustración',
      'Estrategia de Marca', 'Fotografía', 'UI/UX Design', 'Social Media Management'
    ];

    export default function MyProfile() {
      const { user, profile, refreshProfile } = useAuth();
      const { toast } = useToast();
      const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        country: 'México',
        state: '',
        city: '',
        locality: '',
        collaborator_type: '',
        specialties: [],
      });
      const [photoFile, setPhotoFile] = useState(null);
      const [municipalities, setMunicipalities] = useState([]);
      const [isSaving, setIsSaving] = useState(false);
      const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
      const isProfileIncomplete = profile?.status === 'pending_profile_completion';

      useEffect(() => {
        if (profile) {
          setFormData({
            name: profile.name || user?.user_metadata?.name || '',
            email: profile.email || '',
            whatsapp: profile.whatsapp || '',
            country: profile.country || 'México',
            state: profile.state || '',
            city: profile.city || '',
            locality: profile.locality || '',
            collaborator_type: profile.collaborator_type || '',
            specialties: profile.specialties || [],
          });
        }
      }, [profile, user]);

      useEffect(() => {
        if (formData.state) {
          const selectedState = mexicoStates.find(s => s.nombre === formData.state);
          setMunicipalities(selectedState ? selectedState.municipios : []);
          if (selectedState && !selectedState.municipios.map(m => m.nombre).includes(formData.city)) {
              setFormData(prev => ({ ...prev, city: '' }));
          }
        } else {
          setMunicipalities([]);
        }
      }, [formData.state]);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };
      
      const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleSpecialtyChange = (specialty) => {
        setFormData(prev => {
          const newSpecialties = prev.specialties.includes(specialty)
            ? prev.specialties.filter(s => s !== specialty)
            : [...prev.specialties, specialty];
          return { ...prev, specialties: newSpecialties };
        });
      };

      const handleSave = async () => {
        if (!user || !profile) {
          toast({ title: 'Error', description: 'No se pudo cargar el perfil. Por favor, recarga la página.', variant: 'destructive' });
          return;
        }
        setIsSaving(true);
        try {
          const profileData = { ...formData };

          if (isProfileIncomplete) {
            profileData.status = 'approved';
          }

          if (photoFile) {
            const fileExt = photoFile.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `profile-photos/${user.id}/${fileName}`;
            
            const { publicURL, error: uploadError } = await storageService.uploadFile('resources', filePath, photoFile);
            if (uploadError) throw uploadError;

            profileData.profile_photo_url = publicURL;
          }

          await collaboratorsService.updateCurrentUserProfile(profileData);
          
          toast({ title: '¡Perfil actualizado!', description: 'Tus cambios han sido guardados correctamente.' });
          await refreshProfile();

        } catch (error) {
          toast({ title: 'Error', description: `No se pudo guardar tu perfil: ${error.message}`, variant: 'destructive' });
          console.error(error);
        } finally {
          setIsSaving(false);
        }
      };

      if (!profile) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
      }

      return (
        <div className="space-y-6">
          <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
              <p className="text-gray-600 mt-1">Mantén tu información personal y profesional actualizada.</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsChangePasswordOpen(true)}>
                <Key className="w-4 h-4 mr-2" />
                Cambiar Contraseña
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isProfileIncomplete ? 'Guardar y Finalizar Perfil' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>

          {isProfileIncomplete && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader className="flex flex-row items-center space-x-4">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                <div>
                  <CardTitle className="text-yellow-900">¡Completa tu perfil!</CardTitle>
                  <CardDescription className="text-yellow-800">
                    Tu perfil está incompleto. Por favor, rellena todos los campos para acceder a todas las funcionalidades.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Foto de Perfil</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center space-y-4">
                  <ProfilePhotoEditor onFileSelect={setPhotoFile} initialPreviewUrl={profile.profile_photo_url} />
                  <h2 className="text-xl font-bold">{formData.name}</h2>
                  <p className="text-sm text-blue-600 font-medium uppercase">{profile.role}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Tipo de Colaborador</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="collaborator_type">Rol principal</Label>
                  <Select onValueChange={(value) => handleSelectChange('collaborator_type', value)} value={formData.collaborator_type}>
                    <SelectTrigger id="collaborator_type">
                      <SelectValue placeholder="Selecciona tu rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {collaboratorTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input id="name" name="name" value={formData.name || ''} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" name="email" type="email" value={formData.email || ''} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input id="whatsapp" name="whatsapp" value={formData.whatsapp || ''} onChange={handleInputChange} placeholder="+52 1 55 1234 5678" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ubicación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Select onValueChange={(value) => handleSelectChange('state', value)} value={formData.state}>
                        <SelectTrigger id="state"><SelectValue placeholder="Selecciona un estado" /></SelectTrigger>
                        <SelectContent>
                          {mexicoStates.map(state => <SelectItem key={state.nombre} value={state.nombre}>{state.nombre}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Municipio</Label>
                      <Select onValueChange={(value) => handleSelectChange('city', value)} value={formData.city} disabled={!formData.state}>
                        <SelectTrigger id="city"><SelectValue placeholder="Selecciona un municipio" /></SelectTrigger>
                        <SelectContent>
                          {municipalities.map(municipality => <SelectItem key={municipality.nombre} value={municipality.nombre}>{municipality.nombre}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="locality">Localidad (Colonia, etc.)</Label>
                    <Input id="locality" name="locality" value={formData.locality || ''} onChange={handleInputChange} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Especialidades y Habilidades</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ALL_SPECIALTIES.map(specialty => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <Checkbox
                        id={`specialty-${specialty}`}
                        checked={formData.specialties?.includes(specialty)}
                        onCheckedChange={() => handleSpecialtyChange(specialty)}
                      />
                      <Label htmlFor={`specialty-${specialty}`} className="font-normal">{specialty}</Label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    }