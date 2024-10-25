import { cookies } from 'next/headers';
import { adminAuth } from './admin';

export const loadSession = async () => {
  'use server';
  const _cookies = await cookies();
  const jwt = _cookies.get('__session')?.value;
  try {
    if (!jwt) return;
    const token = await adminAuth.verifySessionCookie(jwt, true);
    return await adminAuth.createCustomToken(token.uid);
  } catch (e) {}
};
