import { getUserProfiles } from '@/lib/firebase/actions';
import { loadUserId } from '@/lib/firebase/session';
import { History } from './history';

export const HistorySidebarItem = async () => {
  const userId = await loadUserId();

  if (!userId) return <></>;

  const history = await getUserProfiles(userId);

  return <History initialHistory={history} />;
};
