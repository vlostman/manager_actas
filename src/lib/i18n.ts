
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Traducciones
const resources = {
  en: {
    translation: {
      // Textos de la app header
      "meetingMinutes": "Meeting Minutes",
      "newMeeting": "New Meeting",
      "search": "Search",
      "searchPlaceholder": "Search by title...",

      // Textos de la página principal
      "recentMeetings": "Recent Meetings",
      "noMeetings": "No meetings found",
      "createFirst": "Create your first meeting",

      // Textos de formularios
      "meetingTitle": "Meeting Title",
      "date": "Date",
      "selectDate": "Select a date",
      "participants": "Participants",
      "participantName": "Participant name",
      "topics": "Topics discussed",
      "topicDescription": "Topic",
      "decisions": "Decisions made",
      "decisionDescription": "Decision",
      "tasks": "Assigned tasks",
      "taskDescription": "Task description",
      "assignee": "Assignee",
      "back": "Back",
      "cancel": "Cancel",
      "create": "Create meeting",
      "update": "Update meeting",
      "details": "View details",

      // Textos de visualización
      "meetingInfo": "Meeting Information",
      "created": "Created",
      "updated": "Updated",
      "participantsCount": "Participants",
      "decisionsCount": "Decisions",
      "tasksCount": "Tasks",
      "export": "Export",
      "edit": "Edit",
      "delete": "Delete",
      "confirmation": "Are you sure?",
      "deleteWarning": "This action will permanently delete the meeting and cannot be undone.",
      "markAsCompleted": "Mark as completed",
      "markAsIncomplete": "Mark as incomplete",
      "assignedTo": "Assigned to",
      "completed": "Completed",
      "incomplete": "Incomplete",

      // Notificaciones
      "meetingCreated": "Meeting created successfully",
      "meetingUpdated": "Meeting updated successfully",
      "meetingDeleted": "Meeting deleted successfully",
      "exportSuccess": "PDF generated successfully",
      "error": "An error occurred",
      
      // Pie de página
      "allRightsReserved": "DavidMunive all rights reserved © 2025"
    }
  },
  fr: {
    translation: {
      // Textos de la app header
      "meetingMinutes": "Procès-verbaux de réunion",
      "newMeeting": "Nouvelle réunion",
      "search": "Rechercher",
      "searchPlaceholder": "Rechercher par titre...",

      // Textos de la página principal
      "recentMeetings": "Réunions récentes",
      "noMeetings": "Aucune réunion trouvée",
      "createFirst": "Créez votre première réunion",

      // Textos de formularios
      "meetingTitle": "Titre de la réunion",
      "date": "Date",
      "selectDate": "Sélectionnez une date",
      "participants": "Participants",
      "participantName": "Nom du participant",
      "topics": "Sujets discutés",
      "topicDescription": "Sujet",
      "decisions": "Décisions prises",
      "decisionDescription": "Décision",
      "tasks": "Tâches assignées",
      "taskDescription": "Description de la tâche",
      "assignee": "Responsable",
      "back": "Retour",
      "cancel": "Annuler",
      "create": "Créer la réunion",
      "update": "Mettre à jour la réunion",
      "details": "Voir les détails",

      // Textos de visualización
      "meetingInfo": "Informations sur la réunion",
      "created": "Créée le",
      "updated": "Mise à jour le",
      "participantsCount": "Participants",
      "decisionsCount": "Décisions",
      "tasksCount": "Tâches",
      "export": "Exporter",
      "edit": "Modifier",
      "delete": "Supprimer",
      "confirmation": "Êtes-vous sûr ?",
      "deleteWarning": "Cette action supprimera définitivement la réunion et ne peut pas être annulée.",
      "markAsCompleted": "Marquer comme terminée",
      "markAsIncomplete": "Marquer comme non terminée",
      "assignedTo": "Assignée à",
      "completed": "Terminée",
      "incomplete": "Non terminée",

      // Notificaciones
      "meetingCreated": "Réunion créée avec succès",
      "meetingUpdated": "Réunion mise à jour avec succès",
      "meetingDeleted": "Réunion supprimée avec succès",
      "exportSuccess": "PDF généré avec succès",
      "error": "Une erreur est survenue",
      
      // Pie de página
      "allRightsReserved": "DavidMunive tous droits réservés © 2025"
    }
  },
  pt: {
    translation: {
      // Textos de la app header
      "meetingMinutes": "Atas de Reunião",
      "newMeeting": "Nova Reunião",
      "search": "Pesquisar",
      "searchPlaceholder": "Pesquisar por título...",

      // Textos de la página principal
      "recentMeetings": "Reuniões Recentes",
      "noMeetings": "Nenhuma reunião encontrada",
      "createFirst": "Crie sua primeira reunião",

      // Textos de formularios
      "meetingTitle": "Título da Reunião",
      "date": "Data",
      "selectDate": "Selecione uma data",
      "participants": "Participantes",
      "participantName": "Nome do participante",
      "topics": "Tópicos discutidos",
      "topicDescription": "Tópico",
      "decisions": "Decisões tomadas",
      "decisionDescription": "Decisão",
      "tasks": "Tarefas atribuídas",
      "taskDescription": "Descrição da tarefa",
      "assignee": "Responsável",
      "back": "Voltar",
      "cancel": "Cancelar",
      "create": "Criar reunião",
      "update": "Atualizar reunião",
      "details": "Ver detalhes",

      // Textos de visualización
      "meetingInfo": "Informação da Reunião",
      "created": "Criada em",
      "updated": "Atualizada em",
      "participantsCount": "Participantes",
      "decisionsCount": "Decisões",
      "tasksCount": "Tarefas",
      "export": "Exportar",
      "edit": "Editar",
      "delete": "Excluir",
      "confirmation": "Tem certeza?",
      "deleteWarning": "Esta ação excluirá permanentemente a reunião e não pode ser desfeita.",
      "markAsCompleted": "Marcar como concluída",
      "markAsIncomplete": "Marcar como não concluída",
      "assignedTo": "Atribuída a",
      "completed": "Concluída",
      "incomplete": "Não concluída",

      // Notificaciones
      "meetingCreated": "Reunião criada com sucesso",
      "meetingUpdated": "Reunião atualizada com sucesso",
      "meetingDeleted": "Reunião excluída com sucesso",
      "exportSuccess": "PDF gerado com sucesso",
      "error": "Ocorreu um erro",
      
      // Pie de página
      "allRightsReserved": "DavidMunive todos os direitos reservados © 2025"
    }
  },
  es: {
    translation: {
      // Textos de la app header
      "meetingMinutes": "Actas de Reunión",
      "newMeeting": "Nueva Acta",
      "search": "Buscar",
      "searchPlaceholder": "Buscar por título...",

      // Textos de la página principal
      "recentMeetings": "Actas recientes",
      "noMeetings": "No se encontraron actas",
      "createFirst": "Crea tu primera acta",

      // Textos de formularios
      "meetingTitle": "Título de la reunión",
      "date": "Fecha",
      "selectDate": "Seleccione una fecha",
      "participants": "Participantes",
      "participantName": "Nombre del participante",
      "topics": "Temas discutidos",
      "topicDescription": "Tema",
      "decisions": "Decisiones tomadas",
      "decisionDescription": "Decisión",
      "tasks": "Tareas asignadas",
      "taskDescription": "Descripción de la tarea",
      "assignee": "Responsable",
      "back": "Volver",
      "cancel": "Cancelar",
      "create": "Crear acta",
      "update": "Actualizar acta",
      "details": "Ver detalles",

      // Textos de visualización
      "meetingInfo": "Información",
      "created": "Creada",
      "updated": "Actualizada",
      "participantsCount": "Participantes",
      "decisionsCount": "Decisiones",
      "tasksCount": "Tareas",
      "export": "Exportar",
      "edit": "Editar",
      "delete": "Eliminar",
      "confirmation": "¿Está seguro?",
      "deleteWarning": "Esta acción eliminará permanentemente el acta y no se puede deshacer.",
      "markAsCompleted": "Marcar como completada",
      "markAsIncomplete": "Marcar como pendiente",
      "assignedTo": "Asignada a",
      "completed": "Completada",
      "incomplete": "Pendiente",

      // Notificaciones
      "meetingCreated": "Acta creada con éxito",
      "meetingUpdated": "Acta actualizada con éxito",
      "meetingDeleted": "Acta eliminada con éxito",
      "exportSuccess": "PDF generado con éxito",
      "error": "Error al procesar la operación",
      
      // Pie de página
      "allRightsReserved": "DavidMunive todos los derechos reservados © 2025"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // idioma predeterminado
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // no es necesario para React
    },
  });

export default i18n;
