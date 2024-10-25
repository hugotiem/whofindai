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
};

export const signInWithPassword = async (email: string, password: string) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithProvider(provider);
};

export const signInWithProvider = async (provider: AuthProvider) => {
  try {
    const { user } = await signInWithPopup(auth, provider);
    const idToken = await user.getIdToken();
    window.location.href = `/api/auth/session?idToken=${encrypt(idToken)}`;
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
