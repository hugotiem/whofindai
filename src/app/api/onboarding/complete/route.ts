import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      jobRole,
      callsPerWeek,
      meetingsPerWeek,
      whatYouSell,
      whoYouSellTo,
      mainBenefit
    } = body;

    // Get the authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update the user with onboarding data
    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
        jobRole,
        callsPerWeek: parseInt(callsPerWeek),
        meetingsPerWeek: parseInt(meetingsPerWeek),
        whatYouSell,
        whoYouSellTo,
        mainBenefit,
        onboardingCompleted: true
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
