'use client';

import { APIProfile } from '@/app/api/completion/route';
import { SidebarMenu } from '../ui/sidebar';
import { useHistory } from '@/hooks/use-history';
import { useEffect } from 'react';
import { HistoryItem } from './history-item';

interface HistoryProps {
  initialHistory: APIProfile[];
}

export const History = ({ initialHistory }: HistoryProps) => {
  const { init, history } = useHistory();

  useEffect(() => {
    init(initialHistory);
  }, [initialHistory, init]);

  return (
    history.length > 0 && (
      <SidebarMenu>
        {history.map((profile) => (
          <HistoryItem key={profile.id} profile={profile} />
        ))}
      </SidebarMenu>
    )
  );
};
