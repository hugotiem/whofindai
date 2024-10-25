import {
  AuthProvider,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './client';

export const signUpWithPassword = async (email: string, password: string) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithPassword = async (email: string, password: string) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
};

export const signInWithProvider = async (provider: AuthProvider) => {
  try {
    const { user } = await signInWithPopup(auth, provider);
    return user;
  } catch (e) {
    console.error(e);
  }
};
