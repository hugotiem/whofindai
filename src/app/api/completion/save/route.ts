import { admin, adminAuth, adminDb } from '@/lib/firebase/admin';
import { stripe } from '@/lib/stripe/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const session = request.cookies.get('__session')?.value;
  console.log(session);
  if (!session) throw Error('Unauthized Error');
  try {
    const { profile } = await request.json();

    const { uid } = await adminAuth.verifySessionCookie(session);

    const user = (await adminDb.collection('users').doc(uid).get())?.data();

    const stripe_customer_id = user?.stripe_customer_id;
    const subscription = user?.subscription;
    const used_credits = user?.used_credits;
    console.log(
      used_credits &&
        used_credits >= 5 &&
        (!subscription || subscription === 'free')
    );
    if (
      used_credits &&
      used_credits >= 5 &&
      (!subscription || subscription === 'free')
    ) {
      throw Error('Unauthized Error');
    }

    const batch = adminDb.batch();
    const profileRef = adminDb.collection('profiles').doc(profile.id);
    batch.set(profileRef, {
      fullName: profile.fullName,
      company: profile.company,
      prompt: profile.prompt,
      content: profile.content,
      userId: uid,
      lang: profile.lang,
      createdAt: admin.firestore.Timestamp.now()
    });

    const userRef = adminDb.collection('users').doc(uid);
    batch.set(
      userRef,
      { used_credits: admin.firestore.FieldValue.increment(1) },
      { merge: true }
    );

    await batch.commit();

    if (stripe_customer_id && subscription === 'pay_as_you_go') {
      await stripe.billing.meterEvents.create({
        event_name: 'generated_result',
        payload: { value: '1', stripe_customer_id }
      });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'credits expired or action unauthorized' },
      { status: 401 }
    );
  }
}
