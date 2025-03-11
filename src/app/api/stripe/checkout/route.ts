import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const customers = await stripe.customers.list({ email: user.email });

    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const customer = customers.data[0];

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Checkout session failed' },
        { status: 500 }
      );
    }

    return NextResponse.redirect(session.url);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
