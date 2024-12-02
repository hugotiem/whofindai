import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { adminDb } from '@/lib/firebase/admin';
import { adminAuth } from '@/lib/firebase/admin';
export async function GET(request: NextRequest) {
  try {
    const jwt = request.cookies.get('__session')?.value;
    if (!jwt) {
      return NextResponse.json(
        { error: 'Unauthorized Error' },
        { status: 401 }
      );
    }

    const { uid } = await adminAuth.verifySessionCookie(jwt, true);

    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        new URL(`/?subscribed=false&error=Missing session_id`, request.url)
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.status !== 'complete') {
      return NextResponse.json(
        new URL(`/?subscribed=false&error=Session not completed`, request.url)
      );
    }

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (subscription.status !== 'active') {
      return NextResponse.redirect(
        new URL(`/?subscribed=false&error=Subscription not active`, request.url)
      );
    }

    const userData = await adminDb.collection('users').doc(uid).get();
    if (!userData.exists) {
      return NextResponse.redirect(
        new URL(`/?subscribed=false&error=Unauthorized Error`, request.url)
      );
    }

    const subscriptionName = subscription.items.data[0].plan.nickname;
    const subscriptionPlanId = subscription.items.data[0].plan.id;

    await adminDb.collection('users').doc(uid).update({
      stripe_subscription_id: subscription.id,
      stripe_subscription_name: subscriptionName,
      stripe_subscription_plan_id: subscriptionPlanId
    });
    return NextResponse.redirect(
      new URL(`/?subscribed=true&plan=${subscriptionName}`, request.url)
    );
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(
      new URL(`/?subscribed=false&error=${e}`, request.url)
    );
  }
}
