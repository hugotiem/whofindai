import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json(
        { error: 'Unauthorized Error' },
        { status: 401 }
      );
    let data = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true }
    });
    if (!data?.stripeCustomerId) {
      console.log(user.id);
      const customer = await stripe.customers.create({ email: user.email });
      data = await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
        select: { stripeCustomerId: true }
      });
    }
    const customerSession = await stripe.customerSessions.create({
      customer: data.stripeCustomerId!,
      components: { pricing_table: { enabled: true } }
    });
    return NextResponse.json({
      customer_session_client_secret: customerSession.client_secret
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
