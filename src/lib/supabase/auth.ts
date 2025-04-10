'use server';

import { prisma } from '../prisma';
import { stripe } from '../stripe/client';
import { createClient } from './server';

import { redirect } from 'next/navigation';

export async function signUpWithEmail(
  currentState: { message: string },
  formData: FormData
) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
      data: {
        email_confirm: process.env.NODE_ENV !== 'production'
        // full_name: formData.get('name') as string
      }
    }
  });

  if (error) {
    if (error.message.includes('already registered')) {
      return {
        message:
          'An account with this email already exists. Please login instead.'
      };
    }

    console.error('Error signing up with email', error);
    return { message: error.message };
  }

  if (!data?.user || !data.user.email) {
    return { message: 'Failed to create user' };
  }

  const stripeCustomer = await stripe.customers.create({
    email: data.user.email,
    name: data.user.user_metadata.full_name
  });

  await prisma.user.create({
    data: {
      id: data.user.id,
      email: data.user.email,
      plan: 'FREE',
      provider: 'email',
      stripeCustomerId: stripeCustomer.id
    }
  });

  redirect('/');
}

export async function signInWithEmail(
  _: { message: string },
  formData: FormData
) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string
  });

  if (error) {
    console.error('Error signing in with email', error);
    return { message: error.message };
  }

  redirect('/');
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
    }
  });

  if (error) {
    console.error('Error signing in with Google', error);
    // return { message: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export const handleSave = async (
  _: {
    status: 'error' | 'success' | 'initial';
    errorMessage?: string;
  },
  formData: FormData
): Promise<{
  status: 'error' | 'success' | 'initial';
  errorMessage?: string;
}> => {
  const fullName = formData.get('fullName') as string;
  const companyName = formData.get('companyName') as string;
  if (!fullName || !companyName) {
    return { status: 'error', errorMessage: 'Please fill in all fields' };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      company_name: companyName
    }
  });
  if (error) {
    return { status: 'error', errorMessage: error.message };
  }

  // add new data to CRM

  return { status: 'success' };
};
