import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe/client';

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const client = await createClient();
    const { data: { user }, error } = await client.auth.getUser(token);

    if (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!existingUser) {
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata.full_name
      });

      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          plan: 'FREE',
          emailVerified: user.email_confirmed_at,
          provider: user.app_metadata.provider || 'email',
          stripeCustomerId: stripeCustomer.id
        }
      });
    }
    return NextResponse.json({ message: 'User created' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
