'use client';

import { SidebarMenu } from '../ui/sidebar';
import { useHistory } from '@/hooks/use-history';
import { useEffect } from 'react';
import { HistoryItem } from './history-item';
import { HistoryItem as HistoryItemType } from '@/lib/definitions';

interface HistoryProps {
  initialHistory: HistoryItemType[];
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
          <HistoryItem key={profile.id} {...profile} />
        ))}
      </SidebarMenu>
    )
  );
};
