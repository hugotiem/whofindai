// import brevoClient from '@/lib/brevo/client';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend/client';
import { welcomeEmailOptions } from '@/lib/resend/templates/welcome';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return new NextResponse('No code provided', { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return new NextResponse('Error exchanging code for session', {
        status: 500
      });
    }

    const user = data.user;

    if (!user || !user.email) {
      return new NextResponse('No user found', { status: 400 });
    }

    // check if user exists in supabase with prisma
    const existingUser = await prisma.user.findUnique({
      where: { id: user?.id }
    });

    if (!existingUser) {
      const stripeCustomer = await stripe.customers.create({
        email: user?.email,
        name: user.user_metadata.full_name
      });

      await prisma.user.create({
        data: {
          id: user?.id,
          email: user?.email,
          plan: 'FREE',
          emailVerified: user.email_confirmed_at,
          provider: user.app_metadata.provider || 'email',
          stripeCustomerId: stripeCustomer.id
        }
      });

      // const fullName = user.user_metadata.full_name;
      // let firstName = null;
      // let lastName = null;

      // if (fullName) {
      //   const nameParts = fullName.split(' ');
      //   firstName = nameParts[0];
      //   lastName = nameParts.slice(1).join(' ');
      // }

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

      try {
        // Extract first name from user metadata
        const userName = user.user_metadata.full_name || '';
        const firstName = userName.split(' ')[0] || 'there';

        const { data, error } = await resend.emails.send(
          welcomeEmailOptions(user?.email, firstName)
        );
        console.log('Welcome email sent successfully', data);
        if (error) console.log('Email error', error);
      } catch (error) {
        console.error('Error sending welcome email', error);
      }
    }

    return NextResponse.redirect(url.origin);
  } catch (error) {
    console.error('Error exchanging code for session', error);
    return new NextResponse('Error exchanging code for session', {
      status: 500
    });
  }
}
