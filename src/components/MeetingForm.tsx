
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, X, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Meeting, MeetingFormData, Participant, Task } from "@/lib/types";
import { generateId, generateQR } from "@/lib/storage";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "El título debe tener al menos 3 caracteres",
  }),
  date: z.date({
    required_error: "La fecha es requerida",
  }),
});

interface MeetingFormProps {
  initialData?: Meeting;
  onSubmit: (data: MeetingFormData) => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

const MeetingForm: React.FC<MeetingFormProps> = ({ 
  initialData, 
  onSubmit,
  isEditing = false,
  isSubmitting = false
}) => {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<Participant[]>(
    initialData?.participants || []
  );
  const [newParticipant, setNewParticipant] = useState("");
  
  const [topics, setTopics] = useState<string[]>(
    initialData?.topics || []
  );
  const [newTopic, setNewTopic] = useState("");
  
  const [decisions, setDecisions] = useState<string[]>(
    initialData?.decisions || []
  );
  const [newDecision, setNewDecision] = useState("");
  
  // Asegurar que tasks sea un array, incluso si initialData.tasks no lo es
  const initialTasks = Array.isArray(initialData?.tasks) ? initialData.tasks : [];
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");

  useEffect(() => {
    console.log("Tareas iniciales en el formulario:", tasks);
  }, [tasks]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      date: initialData?.date ? new Date(initialData.date) : new Date(),
    },
  });

  const handleAddParticipant = () => {
    if (newParticipant.trim()) {
      setParticipants([
        ...participants, 
        { id: generateId(), name: newParticipant.trim() }
      ]);
      setNewParticipant("");
    }
  };

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const handleAddDecision = () => {
    if (newDecision.trim()) {
      setDecisions([...decisions, newDecision.trim()]);
      setNewDecision("");
    }
  };

  const handleAddTask = () => {
    if (newTask.trim() && newTaskAssignee.trim()) {
      console.log("Añadiendo nueva tarea:", newTask);
      const newTaskItem: Task = { 
        id: generateId(), 
        description: newTask.trim(), 
        assignee: newTaskAssignee.trim(),
        completed: false 
      };
      
      setTasks(prevTasks => {
        const updatedTasks = [...prevTasks, newTaskItem];
        console.log("Total de tareas después de añadir:", updatedTasks.length);
        return updatedTasks;
      });
      
      setNewTask("");
      setNewTaskAssignee("");
    }
  };

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    if (participants.length === 0) {
      toast.error("Debe agregar al menos un participante");
      return;
    }

    console.log("Preparando datos del formulario para enviar...");
    console.log("Tareas a enviar:", tasks);

    const meetingData: MeetingFormData = {
      title: data.title,
      date: format(data.date, "yyyy-MM-dd"),
      participants,
      topics,
      decisions,
      tasks: tasks.map(task => ({
        ...task,
        id: task.id || generateId(),
        completed: typeof task.completed === 'boolean' ? task.completed : false
      })),
      qrCode: initialData?.qrCode || generateQR(generateId())
    };

    console.log("Datos completos a enviar:", JSON.stringify(meetingData));
    onSubmit(meetingData);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de la reunión</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Reunión de planificación" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Seleccione una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Participants */}
          <div className="space-y-4">
            <div>
              <FormLabel>Participantes</FormLabel>
              <div className="flex mt-2">
                <Input 
                  placeholder="Nombre del participante" 
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                  className="rounded-r-none"
                />
                <Button 
                  type="button" 
                  onClick={handleAddParticipant}
                  className="rounded-l-none"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {participants.map((participant) => (
                <div 
                  key={participant.id} 
                  className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full"
                >
                  <span className="text-sm">{participant.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 hover:bg-transparent"
                    onClick={() => setParticipants(participants.filter(p => p.id !== participant.id))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div className="space-y-4">
            <div>
              <FormLabel>Temas discutidos</FormLabel>
              <div className="flex mt-2">
                <Input 
                  placeholder="Tema discutido" 
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="rounded-r-none"
                />
                <Button 
                  type="button" 
                  onClick={handleAddTopic}
                  className="rounded-l-none"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {topics.map((topic, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center bg-secondary p-3 rounded-md"
                >
                  <span className="text-sm">{topic}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setTopics(topics.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Decisions */}
          <div className="space-y-4">
            <div>
              <FormLabel>Decisiones tomadas</FormLabel>
              <div className="flex mt-2">
                <Textarea 
                  placeholder="Decisión tomada" 
                  value={newDecision}
                  onChange={(e) => setNewDecision(e.target.value)}
                  className="rounded-r-none min-h-[80px]"
                />
                <Button 
                  type="button" 
                  onClick={handleAddDecision}
                  className="rounded-l-none"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {decisions.map((decision, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center bg-secondary p-3 rounded-md"
                >
                  <span className="text-sm">{decision}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setDecisions(decisions.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            <div>
              <FormLabel>Tareas asignadas</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <Input 
                  placeholder="Descripción de la tarea" 
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <div className="flex">
                  <Input 
                    placeholder="Responsable" 
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="rounded-r-none"
                    list="participants-list"
                  />
                  <datalist id="participants-list">
                    {participants.map((participant) => (
                      <option key={participant.id} value={participant.name} />
                    ))}
                  </datalist>
                  <Button 
                    type="button" 
                    onClick={handleAddTask}
                    className="rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="flex justify-between items-center bg-secondary p-3 rounded-md"
                  >
                    <div>
                      <span className="text-sm">{task.description}</span>
                      <div className="text-xs text-muted-foreground mt-1">
                        Asignada a: {task.assignee}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-2">
                  No hay tareas asignadas
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar acta' : 'Crear acta'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MeetingForm;
