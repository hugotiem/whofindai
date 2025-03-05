'use server';

import { prisma } from '../prisma';
import { stripe } from '../stripe/client';
import { createClient } from './server';

import { redirect } from 'next/navigation';

export async function signUpWithEmail(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
      data: {
        email_confirm: process.env.NODE_ENV !== 'production'
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
    return { error: error.message };
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
  currentState: { message: string },
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
    redirect(data.url); // use the redirect API for your server framework
  }
}
