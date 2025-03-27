
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MeetingForm from '@/components/MeetingForm';
import { MeetingFormData } from '@/lib/types';
import { createMeeting } from '@/lib/storage';

const NewMeeting: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: MeetingFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    console.log("Iniciando proceso de guardar acta...");
    
    try {
      // Asegurarnos de esperar a que la promesa se resuelva
      const newMeeting = await createMeeting(data);
      console.log("Acta creada exitosamente:", newMeeting.id);
      toast.success('Acta creada con éxito');
      navigate(`/ver/${newMeeting.id}`);
    } catch (error) {
      console.error("Error al crear acta:", error);
      toast.error('Error al crear el acta');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Crear nueva acta
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete el formulario para registrar una nueva acta de reunión
        </p>
      </div>

      <MeetingForm 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default NewMeeting;
