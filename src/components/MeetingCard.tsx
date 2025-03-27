
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  ListChecks, 
  Lightbulb, 
  CheckSquare, 
  ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Meeting } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface MeetingCardProps {
  meeting: Meeting;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const formattedDate = meeting.date ? format(new Date(meeting.date), "d 'de' MMMM, yyyy", { locale: es }) : '';

  const completedTasks = meeting.tasks.filter(task => task.completed).length;

  return (
    <Card className="overflow-hidden transition-card h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="bg-primary/10 text-primary mb-2">
            {t('meetingMinutes')}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {format(new Date(meeting.createdAt), "dd/MM/yyyy")}
          </span>
        </div>
        <CardTitle className="text-xl line-clamp-1">{meeting.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow grid gap-4">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground">{formattedDate}</span>
        </div>
        
        <div>
          <div className="flex items-center mb-1.5">
            <Users className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm font-medium">{t('participants')}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {meeting.participants.map(p => p.name).join(', ')}
          </p>
        </div>

        <div>
          <div className="flex items-center mb-1.5">
            <ListChecks className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm font-medium">{t('topics')}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {meeting.topics.length} {t('topics').toLowerCase()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-1.5">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <span className="text-xs">{meeting.decisions.length} {t('decisionsCount').toLowerCase()}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckSquare className="h-4 w-4 text-emerald-500" />
            <span className="text-xs">{completedTasks}/{meeting.tasks.length} {t('tasksCount').toLowerCase()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button 
          className="w-full gap-1" 
          variant="outline"
          onClick={() => navigate(`/ver/${meeting.id}`)}
        >
          {t('details')}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MeetingCard;
