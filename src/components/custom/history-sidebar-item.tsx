import { getUserProfiles } from '@/lib/firebase/actions';
import { loadUserId } from '@/lib/firebase/session';
import { History } from './history';

export const HistorySidebarItem = async () => {
  const userId = await loadUserId();

  if (!userId)
    return (
      <div className="text-sm text-gray-600 dark:text-gray-400 p-4 text-center">
        If you are logged in, you can see your history here.
      </div>
    );

  const history = await getUserProfiles(userId);

  return <History initialHistory={history} />;
};
