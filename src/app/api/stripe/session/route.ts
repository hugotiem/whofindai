import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { stripe } from '@/lib/stripe/client';

export async function POST(request: NextRequest) {
  try {
    const jwt = request.cookies.get('__session')?.value;
    if (!jwt) throw Error('Unauthorized Error');
    const { uid } = await adminAuth.verifySessionCookie(jwt, true);
    const userData = await adminDb.collection('users').doc(uid).get();
    if (!userData.exists) throw Error('Unauthorized Error');
    const user = userData.data()!;
    if (!user.stripe_customer_id) throw Error('Unauthorized Error');
    const customerSession = await stripe.customerSessions.create({
      customer: user.stripe_customer_id,
      components: { pricing_table: { enabled: true } }
    });
    return NextResponse.json({
      customer_session_client_secret: customerSession.client_secret
    });
  } catch (e) {
    console.log('error', e);
    return NextResponse.json({ error: e }, { status: 401 });
  }
}
