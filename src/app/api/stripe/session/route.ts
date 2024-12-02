import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { stripe } from '@/lib/stripe/client';

export async function POST(request: NextRequest) {
  try {
    const jwt = request.cookies.get('__session')?.value;
    if (!jwt)
      return NextResponse.json(
        { error: 'Unauthorized Error' },
        { status: 401 }
      );
    const { uid } = await adminAuth.verifySessionCookie(jwt, true);
    const userData = await adminDb.collection('users').doc(uid).get();
    if (!userData.exists)
      return NextResponse.json(
        { error: 'Unauthorized Error' },
        { status: 401 }
      );
    const user = userData.data()!;
    if (!user.stripe_customer_id) {
      const customer = await stripe.customers.create({
        email: user.email
      });
      await adminDb.collection('users').doc(uid).update({
        stripe_customer_id: customer.id
      });
      user.stripe_customer_id = customer.id;
    }
    const customerSession = await stripe.customerSessions.create({
      customer: user.stripe_customer_id,
      components: { pricing_table: { enabled: true } }
    });
    return NextResponse.json({
      customer_session_client_secret: customerSession.client_secret
    });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
