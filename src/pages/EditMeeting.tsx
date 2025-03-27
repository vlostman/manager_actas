
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MeetingForm from '@/components/MeetingForm';
import { Meeting, MeetingFormData } from '@/lib/types';
import { getMeetingById, updateMeeting, initDatabase } from '@/lib/storage';

const EditMeeting: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadMeeting = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        // Inicializar la base de datos
        await initDatabase();
        
        // Cargar el acta
        const meetingData = await getMeetingById(id);
        if (meetingData) {
          setMeeting(meetingData);
        } else {
          toast.error('Acta no encontrada');
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading meeting:', error);
        toast.error('Error al cargar el acta');
      } finally {
        setLoading(false);
      }
    };
    
    loadMeeting();
  }, [id, navigate]);

  const handleSubmit = async (data: MeetingFormData) => {
    if (!id || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const updatedMeeting = await updateMeeting(id, data);
      if (updatedMeeting) {
        toast.success('Acta actualizada con éxito');
        navigate(`/ver/${id}`);
      } else {
        toast.error('Error al actualizar el acta');
      }
    } catch (error) {
      toast.error('Error al actualizar el acta');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-6 md:py-10">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-pulse w-full max-w-md h-12 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="container py-6 md:py-10">
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">Acta no encontrada</h3>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-10">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="gap-1 mb-4" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Editar acta
        </h1>
        <p className="text-muted-foreground mt-1">
          Modifique la información del acta de reunión
        </p>
      </div>

      <MeetingForm 
        initialData={meeting} 
        onSubmit={handleSubmit} 
        isEditing={true} 
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default EditMeeting;
