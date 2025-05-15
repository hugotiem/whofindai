
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE() {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    await supabase.auth.admin.deleteUser(user.id);
    const { stripeCustomerId } = await prisma.user.delete({
      where: { id: user?.id },
      select: { email: true, stripeCustomerId: true }
    });
    // await brevoClient.contacts.deleteContact(email);
    if (stripeCustomerId) {
      await stripe.customers.del(stripeCustomerId);
    }
    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : `Unknown error ${error}`
      },
      { status: 500 }
    );
  }
}
