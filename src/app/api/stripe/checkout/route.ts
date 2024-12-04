import { NextResponse } from 'next/server';

import { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe/client';
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  console.log(email);

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const customers = await stripe.customers.list({ email });
  console.log(customers);
  if (customers.data.length === 0) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  const customer = customers.data[0];

  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    line_items: [
      {
        price: 'price_1QP0YqBF5MiC7mCxSMZFsRXR'
      }
    ],
    mode: 'subscription'
  });

  if (!session.url) {
    return NextResponse.json(
      { error: 'Checkout session failed' },
      { status: 500 }
    );
  }

  return NextResponse.redirect(session.url);
}
