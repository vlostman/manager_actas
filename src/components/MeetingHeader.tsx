
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MeetingHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full mb-8 animate-fade-in">
      <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-primary">Actas</span> de Reuniones
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestione la información de sus reuniones de manera eficiente
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 gap-1"
            onClick={() => navigate('/')}
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Todas</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 gap-1"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Buscar</span>
          </Button>
          <Button 
            onClick={() => navigate('/nueva')} 
            size="sm"
            className="h-9 gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Nueva Acta</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MeetingHeader;
