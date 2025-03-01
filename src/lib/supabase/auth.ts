import { toast } from 'sonner';
import { auth } from './client';
import { Provider } from '@supabase/supabase-js';
import { encrypt } from '../utils';

export const signUpWithPassword = async (
  email: string,
  password: string,
  { redirect_path }: { redirect_path?: string }
) => {
  try {
    const { data, error } = await auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`
      }
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      const { data: sessionData } = await auth.getSession();
      if (sessionData.session) {
        window.location.href = `/api/auth/session?session=${encrypt(JSON.stringify(sessionData.session))}${redirect_path ? `&redirect_path=${redirect_path}` : ''}`;
      } else {
        toast.success('Verification email sent. Please check your inbox.');
      }
    }
  } catch (e: any) {
    console.error(e);
    if (e.message.includes('already registered')) {
      toast.error('Email already in use');
    } else if (e.message.includes('password')) {
      toast.error('Password is too weak');
    } else if (e.message.includes('email')) {
      toast.error('Invalid email address');
    } else {
      toast.error('Error signing up');
    }
  }
};

export const signInWithPassword = async (
  email: string,
  password: string,
  { redirect_path }: { redirect_path?: string }
) => {
  try {
    const { data, error } = await auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    if (data.session) {
      window.location.href = `/api/auth/session?session=${encrypt(JSON.stringify(data.session))}${redirect_path ? `&redirect_path=${redirect_path}` : ''}`;
    }
  } catch (e: any) {
    console.error(e);
    if (e.message.includes('Invalid login credentials')) {
      toast.error('Invalid email or password');
    } else if (e.message.includes('password')) {
      toast.error('Invalid password');
    } else {
      toast.error('Error signing in');
    }
  }
};

export const signInWithGoogle = ({
  redirect_path
}: {
  redirect_path?: string;
}) => {
  return signInWithProvider('google', { redirect_path });
};

export const signInWithProvider = async (
  provider: Provider,
  { redirect_path }: { redirect_path?: string }
) => {
  try {
    const { data, error } = await auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback${redirect_path ? `?redirect_path=${redirect_path}` : ''}`
      }
    });

    if (error) {
      throw error;
    }
  } catch (e) {
    console.error('Error signing in with provider', e);
    toast.error('Error signing in');
  }
};

export const logout = async () => {
  try {
    await auth.signOut();
    window.location.href = '/';
  } catch (error) {
    console.error('Error signing out', error);
    toast.error('Error signing out');
  }
};
