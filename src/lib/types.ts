
export interface Participant {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  description: string;
  assignee: string;
  completed: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  participants: Participant[];
  topics: string[];
  decisions: string[];
  tasks: Task[];
  signature?: string;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export type MeetingFormData = Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>;

// Interfaces para la gestión de la base de datos
export interface DBInitOptions {
  force?: boolean;
}
