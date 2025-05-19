import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe/client';
import { resend } from '@/lib/resend/client';
import { welcomeEmailOptions } from '@/lib/resend/templates/welcome';
// import brevoClient from '@/lib/brevo/client';

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const client = await createClient();
    const {
      data: { user },
      error
    } = await client.auth.getUser(token);

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

      const fullName = user.user_metadata.full_name;
      let firstName = null;
      let lastName = null;

      if (fullName) {
        const nameParts = fullName.split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }

      await resend.contacts.create({
        email: user?.email,
        audienceId: process.env.RESEND_GENERAL_AUDIENCES_ID || '',
        firstName,
        lastName,
        unsubscribed: false
      });

      const payAsYouGoPromoCode = await stripe.promotionCodes.create({
        coupon: 'QB5OoQam',
        code:
          user.email
            .split('@')[0]
            .replace(/[^a-zA-Z0-9]/g, '')
            .toUpperCase() + '50',
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5, // 5 days from now
        max_redemptions: 1,
        customer: stripeCustomer.id,
        metadata: {
          user_id: user.id
        }
      });

      const proPromoCode = await stripe.promotionCodes.create({
        coupon: 'spavUnyC',
        code:
          user.email
            .split('@')[0]
            .replace(/[^a-zA-Z0-9]/g, '')
            .toUpperCase() + '75',
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5, // 5 days from now
        max_redemptions: 1,
        customer: stripeCustomer.id,
        metadata: {
          user_id: user.id
        }
      });
      
      await resend.emails.send(
        welcomeEmailOptions(
          user?.email,
          firstName ?? user?.email.split('@')[0],
          payAsYouGoPromoCode.code,
          proPromoCode.code
        )
      );

      // await brevoClient.contacts.createContact({
      //   email: user?.email,
      //   updateEnabled: true,
      //   extId: dbUser.id,
      //   attributes: {
      //     NOM: lastName,
      //     PRENOM: firstName,
      //     STRIPE_ID: stripeCustomer.id,
      //     SUBSCRIPTION: 'FREE'
      //   }
      // });
    }
    return NextResponse.json({ message: 'User created' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
