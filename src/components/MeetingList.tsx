
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MeetingCard from '@/components/MeetingCard';
import { Meeting } from '@/lib/types';
import { getMeetings, initDatabase } from '@/lib/storage';

interface MeetingListProps {
  searchTerm?: string;
}

const MeetingList: React.FC<MeetingListProps> = ({ searchTerm = '' }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        // Inicializar la base de datos
        await initDatabase();
        
        // Cargar las actas
        const loadedMeetings = await getMeetings();
        setMeetings(loadedMeetings);
        setLoading(false);
      } catch (error) {
        console.error('Error loading meetings:', error);
        setLoading(false);
      }
    };
    
    loadMeetings();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMeetings(meetings);
    } else {
      const filtered = meetings.filter(meeting => 
        meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        meeting.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase())) ||
        meeting.decisions.some(decision => decision.toLowerCase().includes(searchTerm.toLowerCase())) ||
        meeting.tasks.some(task => 
          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredMeetings(filtered);
    }
  }, [searchTerm, meetings]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-pulse">
        <div className="h-16 w-16 rounded-full bg-muted mb-4" />
        <div className="h-6 w-48 bg-muted rounded mb-4" />
        <div className="h-4 w-64 bg-muted rounded" />
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">{t('noMeetings')}</h3>
        <p className="text-muted-foreground mb-6">{t('createFirst')}</p>
        <Button onClick={() => navigate('/nueva')}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {t('newMeeting')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{t('recentMeetings')}</h2>
        <Button onClick={() => navigate('/nueva')}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {t('newMeeting')}
        </Button>
      </div>

      {filteredMeetings.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">{t('noMeetings')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingList;
