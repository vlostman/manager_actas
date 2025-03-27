
import { Meeting, Task, Participant, DBInitOptions } from './types';

// Variable para almacenar los datos
let meetings: Meeting[] = [];
let dbInitialized = false;
const STORAGE_KEY = 'meeting_minutes_data';

// Helper para obtener un nuevo ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Inicializa la base de datos desde localStorage
export const initDatabase = async (options: DBInitOptions = {}): Promise<void> => {
  if (dbInitialized && !options.force) {
    return;
  }

  try {
    console.log("Inicializando base de datos en localStorage...");
    // Cargar la base de datos existente desde localStorage o crear una nueva
    const savedData = localStorage.getItem(STORAGE_KEY);
    
    if (savedData && !options.force) {
      meetings = JSON.parse(savedData);
      console.log(`Base de datos cargada: ${meetings.length} actas encontradas`);
      
      // Asegurar que todas las actas tengan un array de tareas
      meetings = meetings.map(meeting => {
        if (!Array.isArray(meeting.tasks)) {
          console.log(`Inicializando array de tareas para acta ${meeting.id}`);
          meeting.tasks = [];
        }
        return meeting;
      });
    } else {
      meetings = [];
      
      // Si estamos forzando la inicialización o no hay datos existentes, creamos un acta de demostración
      const needsDemoData = options.force || !savedData;
      if (needsDemoData) {
        await createDemoMeeting();
      }
    }
    
    dbInitialized = true;
    console.log("Base de datos inicializada correctamente");
  } catch (error) {
    console.error('Error initializing database:', error);
    throw new Error('Could not initialize database');
  }
};

// Guardar los datos en localStorage
export const persistDatabase = (): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    console.log("Datos guardados en localStorage correctamente");
  } catch (error) {
    console.error('Error saving database:', error);
  }
};

// Crear acta de demostración
const createDemoMeeting = async (): Promise<void> => {
  console.log("Creando acta de demostración...");
  const now = new Date().toISOString();
  const meetingId = generateId();
  
  // Crear acta de demostración
  const demoMeeting: Meeting = {
    id: meetingId,
    title: 'Prueba 1 - Ejemplo',
    date: now.split('T')[0],
    participants: [
      { id: generateId(), name: 'Nombre 1' },
      { id: generateId(), name: 'Nombre 2' },
      { id: generateId(), name: 'Nombre 3' }
    ],
    topics: [
      'Ejemplo de tema 1',
      'Ejemplo de tema 2',
      'Ejemplo de tema 3'
    ],
    decisions: [
      'Esto es una prueba de uso de decisiones',
      'Esto es otra prueba de uso de decisiones',
      'Esto es una tercera prueba de uso de decisiones'
    ],
    tasks: [
      {
        id: generateId(),
        description: 'Ejemplo de tema 1',
        assignee: 'Nombre 1',
        completed: false
      },
      {
        id: generateId(),
        description: 'Ejemplo de tema 2',
        assignee: 'Nombre 2',
        completed: true
      },
      {
        id: generateId(),
        description: 'Ejemplo de tema 3',
        assignee: 'Nombre 3',
        completed: false
      }
    ],
    createdAt: now,
    updatedAt: now
  };
  
  meetings.push(demoMeeting);
  
  // Persistir los cambios
  persistDatabase();
  console.log("Acta de demostración creada con id:", meetingId);
};

// Obtener todas las actas
export const getMeetings = async (): Promise<Meeting[]> => {
  if (!dbInitialized) {
    await initDatabase();
  }
  
  try {
    console.log("Obteniendo listado de actas...");
    return [...meetings].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return [];
  }
};

// Obtener acta por ID
export const getMeetingById = async (id: string): Promise<Meeting | undefined> => {
  if (!dbInitialized) {
    await initDatabase();
  }
  
  try {
    console.log(`Buscando acta con ID: ${id}`);
    const meeting = meetings.find(meeting => meeting.id === id);
    
    if (!meeting) {
      console.log(`No se encontró acta con ID: ${id}`);
      return undefined;
    }
    
    // Asegurarnos de que tasks sea un array
    if (!Array.isArray(meeting.tasks)) {
      console.log(`La acta ${id} no tenía un array de tareas válido. Inicializando...`);
      meeting.tasks = [];
    }
    
    console.log(`Acta encontrada: ${meeting.title}`);
    console.log(`Tiene ${meeting.tasks.length} tareas asignadas`);
    console.log("Tareas:", JSON.stringify(meeting.tasks));
    
    return meeting;
  } catch (error) {
    console.error(`Error fetching meeting ${id}:`, error);
    return undefined;
  }
};

// Crear una nueva acta
export const createMeeting = async (meetingData: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meeting> => {
  if (!dbInitialized) {
    await initDatabase();
  }
  
  try {
    console.log("Iniciando creación de acta:", meetingData);
    const now = new Date().toISOString();
    const id = generateId();
    
    // Asegurar que tasks sea siempre un array válido
    if (!Array.isArray(meetingData.tasks)) {
      console.log("La propiedad tasks no es un array válido. Inicializándola...");
      meetingData.tasks = [];
    }
    
    // Crear nuevo objeto de acta
    const newMeeting: Meeting = {
      ...meetingData,
      id,
      tasks: meetingData.tasks.map(task => ({
        ...task,
        id: task.id || generateId(), // Asegurar que cada tarea tenga un ID único
        completed: task.completed || false // Asegurar que completed tenga un valor booleano
      })),
      createdAt: now,
      updatedAt: now
    };
    
    console.log("Nueva acta a guardar:", JSON.stringify(newMeeting));
    console.log(`Contiene ${newMeeting.tasks.length} tareas`);
    
    // Añadir a la lista de actas
    meetings.push(newMeeting);
    
    // Persistir los cambios
    console.log("Guardando cambios en localStorage...");
    persistDatabase();
    
    console.log("Acta creada exitosamente:", newMeeting.id);
    return newMeeting;
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw new Error('Could not create meeting');
  }
};

// Actualizar acta existente
export const updateMeeting = async (id: string, meetingData: Partial<Meeting>): Promise<Meeting | undefined> => {
  if (!dbInitialized) {
    await initDatabase();
  }
  
  try {
    // Verificar que la acta existe
    const index = meetings.findIndex(meeting => meeting.id === id);
    if (index === -1) {
      return undefined;
    }
    
    const now = new Date().toISOString();
    
    // Si se están actualizando tareas, asegurar que todas tengan ID
    if (Array.isArray(meetingData.tasks)) {
      meetingData.tasks = meetingData.tasks.map(task => ({
        ...task,
        id: task.id || generateId(),
        completed: typeof task.completed === 'boolean' ? task.completed : false
      }));
    }
    
    // Actualizar acta existente
    meetings[index] = {
      ...meetings[index],
      ...meetingData,
      updatedAt: now
    };
    
    // Asegurar que tasks sea siempre un array
    if (!Array.isArray(meetings[index].tasks)) {
      meetings[index].tasks = [];
    }
    
    // Persistir los cambios
    persistDatabase();
    
    return meetings[index];
  } catch (error) {
    console.error(`Error updating meeting ${id}:`, error);
    return undefined;
  }
};

// Actualizar el estado de una tarea
export const updateTaskStatus = async (meetingId: string, taskId: string, completed: boolean): Promise<boolean> => {
  if (!dbInitialized) {
    await initDatabase();
  }
  
  try {
    console.log(`Actualizando estado de tarea ${taskId} en acta ${meetingId} a ${completed ? 'completada' : 'pendiente'}`);
    
    const meetingIndex = meetings.findIndex(meeting => meeting.id === meetingId);
    if (meetingIndex === -1) {
      console.error(`No se encontró acta con ID: ${meetingId}`);
      return false;
    }
    
    const meeting = meetings[meetingIndex];
    
    // Asegurarnos de que tasks sea un array
    if (!Array.isArray(meeting.tasks)) {
      meeting.tasks = [];
      console.log("La acta no tenía tareas definidas, se inicializó un array vacío");
    }
    
    const taskIndex = meeting.tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      console.error(`No se encontró tarea con ID: ${taskId}`);
      return false;
    }
    
    // Actualizar tarea
    meeting.tasks[taskIndex] = {
      ...meeting.tasks[taskIndex],
      completed
    };
    
    console.log(`Tarea actualizada: ${meeting.tasks[taskIndex].description} - Completada: ${completed}`);
    
    // Actualizar fecha de modificación
    meeting.updatedAt = new Date().toISOString();
    
    // Persistir los cambios
    persistDatabase();
    
    return true;
  } catch (error) {
    console.error(`Error updating task status ${taskId}:`, error);
    return false;
  }
};

// Eliminar acta
export const deleteMeeting = async (id: string): Promise<boolean> => {
  if (!dbInitialized) {
    await initDatabase();
  }
  
  try {
    const initialLength = meetings.length;
    meetings = meetings.filter(meeting => meeting.id !== id);
    
    // Persistir los cambios si hubo cambios
    if (initialLength !== meetings.length) {
      persistDatabase();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error deleting meeting ${id}:`, error);
    return false;
  }
};

// Generar firma (simplificado)
export const generateSignature = (signatureData: string): string => {
  return `data:image/png;base64,${btoa(signatureData)}`;
};

// Esta función se mantiene por compatibilidad pero devolverá una cadena vacía
export const generateQR = (meetingId: string): string => {
  return '';
};
