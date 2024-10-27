import {
  AuthProvider,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './client';
import { encrypt } from '../utils';

export const signUpWithPassword = async (email: string, password: string) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  return user;
};

export const signInWithPassword = async (email: string, password: string) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

export const signInWithGoogle = ({
  redirect_path
}: {
  redirect_path?: string;
}) => {
  const provider = new GoogleAuthProvider();
  return signInWithProvider(provider, { redirect_path });
};

export const signInWithProvider = async (
  provider: AuthProvider,
  { redirect_path }: { redirect_path?: string }
) => {
  try {
    const { user } = await signInWithPopup(auth, provider);
    const idToken = await user.getIdToken();
    window.location.href = `/api/auth/session?idToken=${encrypt(idToken)}&redirect_path=${redirect_path}`;
    return;
  } catch (e) {
    console.error(e);
  }
};

export const logout = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Error signing out with Google', error);
  }
};
