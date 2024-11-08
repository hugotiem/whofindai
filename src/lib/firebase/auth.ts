import {
  AuthErrorCodes,
  AuthProvider,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  User
} from 'firebase/auth';
import { auth } from './client';
import { encrypt } from '../utils';
import { toast } from 'sonner';
import { FirebaseError } from 'firebase/app';

export const signUpWithPassword = async (
  email: string,
  password: string,
  { redirect_path }: { redirect_path?: string }
) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await sendEmailAddressVerification(user, false);
    const idToken = await user.getIdToken();
    window.location.href = `/api/auth/session?idToken=${encrypt(idToken)}${redirect_path && `&redirect_path=${redirect_path}`}`;
  } catch (e) {
    if (e instanceof FirebaseError) {
      if (e.code === AuthErrorCodes.EMAIL_EXISTS) {
        toast.error('Email already in use');
      } else if (e.code === AuthErrorCodes.WEAK_PASSWORD) {
        toast.error('Password is too weak');
      } else if (e.code === AuthErrorCodes.INVALID_EMAIL) {
        toast.error('Invalid email address');
      } else {
        toast.error('Error signing up');
      }
    }
  }
};

export const sendEmailAddressVerification = async (
  user: User,
  showToast = true
) => {
  try {
    await sendEmailVerification(user);
    if (showToast) toast.success('Email verification sent');
  } catch (error) {
    toast.error(`Error sending email verification (Error: ${error})`);
  }
};

export const signInWithPassword = async (
  email: string,
  password: string,
  { redirect_path }: { redirect_path?: string }
) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await user.getIdToken();
    window.location.href = `/api/auth/session?idToken=${encrypt(idToken)}${(redirect_path && `&redirect_path=${redirect_path}`) || ''}`;
    return;
  } catch (e) {
    console.error(e);
    if (e instanceof FirebaseError) {
      if (e.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
        toast.error('Invalid email or password');
      } else if (e.code === AuthErrorCodes.INVALID_PASSWORD) {
        toast.error('Invalid password');
      } else {
        toast.error('Error signing in');
      }
    } else {
      toast.error(`Error during Login: ${e}`);
    }
  }
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
