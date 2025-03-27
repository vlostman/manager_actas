
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { 
  Calendar, 
  Users, 
  ListChecks, 
  Lightbulb, 
  CheckSquare, 
  ArrowLeft,
  Edit,
  Download,
  Trash2,
  FileText,
  Check,
  X as XIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Meeting, Task } from '@/lib/types';
import { getMeetingById, deleteMeeting, updateTaskStatus, initDatabase } from '@/lib/storage';
import { Badge } from '@/components/ui/badge';
import { usePDF } from 'react-to-pdf';

const ViewMeeting: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { t } = useTranslation();
  const { toPDF, targetRef } = usePDF({
    filename: `acta-reunion-${id}.pdf`
  });

  useEffect(() => {
    const fetchMeeting = async () => {
      if (id) {
        try {
          // Asegurar que la base de datos está inicializada
          await initDatabase();
          
          console.log("Buscando acta con ID:", id);
          const meetingData = await getMeetingById(id);
          
          if (meetingData) {
            console.log("Acta encontrada:", meetingData.title);
            
            // Asegurar que tasks existe y es un array
            if (!Array.isArray(meetingData.tasks)) {
              console.log("Inicializando array de tareas");
              meetingData.tasks = [];
            }
            
            console.log("Tareas cargadas:", JSON.stringify(meetingData.tasks));
            setMeeting(meetingData);
          } else {
            console.error("No se encontró el acta");
            toast.error(t('error'));
            navigate('/');
          }
        } catch (error) {
          console.error('Error fetching meeting:', error);
          toast.error(t('error'));
          navigate('/');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchMeeting();
  }, [id, navigate, t]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      const success = await deleteMeeting(id);
      if (success) {
        toast.success(t('meetingDeleted'));
        navigate('/');
      } else {
        toast.error(t('error'));
      }
    } catch (error) {
      toast.error(t('error'));
      console.error(error);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      await toPDF();
      toast.success(t('exportSuccess'));
    } catch (error) {
      toast.error(t('error'));
      console.error(error);
    }
  };

  const handleToggleTaskCompletion = async (taskId: string) => {
    if (!meeting || !id) return;
    
    try {
      console.log("Toggling task completion for task:", taskId);
      
      // Encontrar la tarea en el array de tareas
      if (!Array.isArray(meeting.tasks)) {
        console.error("meeting.tasks no es un array válido");
        return;
      }
      
      const taskToToggle = meeting.tasks.find(t => t.id === taskId);
      
      if (!taskToToggle) {
        console.error("Task not found:", taskId);
        return;
      }
      
      // Invertir el estado actual
      const newCompletionStatus = !taskToToggle.completed;
      console.log("Changing task completion from", taskToToggle.completed, "to", newCompletionStatus);
      
      // Actualizar el estado en la base de datos
      const success = await updateTaskStatus(id, taskId, newCompletionStatus);
      
      if (success) {
        console.log("Task status updated successfully");
        
        // Actualizar directamente el estado local para inmediatez
        setMeeting(prevMeeting => {
          if (!prevMeeting) return null;
          
          return {
            ...prevMeeting,
            tasks: prevMeeting.tasks.map(task => {
              if (task.id === taskId) {
                return { ...task, completed: newCompletionStatus };
              }
              return task;
            })
          };
        });
        
        toast.success(newCompletionStatus ? 'Tarea marcada como completada' : 'Tarea marcada como pendiente');
      } else {
        console.error("Failed to update task status");
        toast.error(t('error'));
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error(t('error'));
    }
  };

  if (loading) {
    return (
      <div className="container py-6 md:py-10 flex-grow">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-pulse w-full max-w-md h-12 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="container py-6 md:py-10 flex-grow">
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">{t('noMeetings')}</h3>
          <Button onClick={() => navigate('/')}>{t('back')}</Button>
        </div>
      </div>
    );
  }

  const formattedDate = meeting?.date ? format(new Date(meeting.date), "d 'de' MMMM, yyyy", { locale: es }) : '';
  
  // Asegurar que tasks exista y es un array
  const tasks = Array.isArray(meeting.tasks) ? meeting.tasks : [];
  console.log("Tasks en renderizado:", tasks);

  return (
    <div className="container py-6 md:py-10 flex-grow" ref={targetRef}>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4 animate-slide-in-left">
          <div className="flex justify-between items-start mb-6">
            <Button 
              variant="ghost" 
              className="gap-1 mb-2" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
              {t('back')}
            </Button>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1"
                onClick={handleGeneratePDF}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">{t('export')}</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1"
                onClick={() => navigate(`/editar/${meeting.id}`)}
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">{t('edit')}</span>
              </Button>
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('delete')}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('confirmation')}</DialogTitle>
                    <DialogDescription>
                      {t('deleteWarning')}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setDeleteDialogOpen(false)}
                    >
                      {t('cancel')}
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDelete}
                    >
                      {t('delete')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="mb-8">
            <Badge variant="outline" className="bg-primary/10 text-primary mb-3">
              <FileText className="h-3.5 w-3.5 mr-1" />
              {t('meetingMinutes')}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              {meeting.title}
            </h1>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>{t('participants')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {meeting.participants.map((participant) => (
                    <div 
                      key={participant.id} 
                      className="bg-secondary px-3 py-1.5 rounded-md text-sm"
                    >
                      {participant.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <ListChecks className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>{t('topics')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {meeting.topics.map((topic, index) => (
                    <div 
                      key={index} 
                      className="flex items-start"
                    >
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary/10 text-primary rounded-full text-xs mr-3">
                        {index + 1}
                      </span>
                      <div className="text-sm pt-1">{topic}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                  <CardTitle>{t('decisions')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meeting.decisions.map((decision, index) => (
                    <div 
                      key={index} 
                      className="pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="text-sm">{decision}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <CheckSquare className="h-5 w-5 mr-2 text-emerald-500" />
                  <CardTitle>{t('tasks')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks && tasks.length > 0 ? (
                    tasks.map((task: Task) => (
                      <div 
                        key={task.id} 
                        className="flex items-start bg-secondary p-3 rounded-md"
                      >
                        <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mr-3 ${task.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                          {task.completed ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <XIcon className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="text-sm">{task.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {t('assignedTo')}: {task.assignee}
                          </div>
                        </div>
                        <div className="ml-4 flex items-center">
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={task.completed} 
                              onCheckedChange={() => handleToggleTaskCompletion(task.id)}
                            />
                            <span className="text-xs">
                              {task.completed ? t('completed') : t('incomplete')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-2">
                      {t('noTasks')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="lg:w-1/4 animate-slide-in-right">
          <div className="sticky top-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('meetingInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">{t('created')}:</span>{' '}
                  {format(new Date(meeting.createdAt), "dd/MM/yyyy")}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">{t('updated')}:</span>{' '}
                  {format(new Date(meeting.updatedAt), "dd/MM/yyyy")}
                </div>
                <Separator className="my-2" />
                <div className="text-sm">
                  <span className="text-muted-foreground">{t('participantsCount')}:</span>{' '}
                  {meeting.participants.length}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">{t('decisionsCount')}:</span>{' '}
                  {meeting.decisions.length}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">{t('tasksCount')}:</span>{' '}
                  {tasks.length}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMeeting;
