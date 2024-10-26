import { Profile } from '../definitions';
import { adminDb } from './admin';

export const getProfileNyId = async (id: string): Promise<Profile> => {
  const data = await adminDb.collection('profiles').doc(id).get();
  return {
    ...(data.data() as Profile),
    id: data.id
  };
};

export const getUserProfiles = async (userId: string): Promise<Profile[]> => {
  const data = await adminDb
    .collection('profiles')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();
  if (data.empty) return [];
  return data.docs.map((profile) => ({
    ...(profile.data() as Profile),
    id: profile.id,
    createdAt: profile.createTime.toDate()
  }));
};
