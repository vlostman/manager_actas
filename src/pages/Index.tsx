
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MeetingHeader from '@/components/MeetingHeader';
import MeetingList from '@/components/MeetingList';
import ThemeLanguageToggle from '@/components/ThemeLanguageToggle';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Index = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="container py-6 md:py-10 flex-grow">
      <div className="flex justify-between items-center mb-6">
        <MeetingHeader />
        <ThemeLanguageToggle />
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={t('searchPlaceholder')}
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <MeetingList searchTerm={searchTerm} />
    </div>
  );
};

export default Index;
