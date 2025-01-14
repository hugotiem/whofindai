import { APIProfile } from '@/app/api/completion/route';
import { Profile } from '../definitions';
import { adminDb } from './admin';
import { loadUserId } from './session';

export const getProfileById = async (
  id: string
): Promise<APIProfile | undefined> => {
  const userId = await loadUserId();
  const data = await adminDb.collection('profiles').doc(id).get();
  if (data.exists) {
    return {
      ...(data.data() as APIProfile),
      // content: userId
      //   ? data.data()!.content
      //   : (data.data()!.content as string).substring(0, 500),
      id: data.id
    };
  }
};

export const getUserProfiles = async (userId: string): Promise<APIProfile[]> => {
  const data = await adminDb
    .collection('profiles')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();
  if (data.empty) return [];
  return data.docs.map((profile) => ({
    ...(profile.data() as APIProfile),
    id: profile.id,
    createdAt: profile.createTime.toDate().toISOString()
  }));
};
