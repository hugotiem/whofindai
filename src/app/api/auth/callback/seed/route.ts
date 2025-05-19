import { resend } from '@/lib/resend/client';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
export async function GET() {
  // const users = await prisma.user.findMany();
  return NextResponse.json({ message: 'Error' }, { status: 500 });

  const supabase = await createAdminClient();

  const { data: usersData } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 100
  });

  for (const user of usersData.users) {
    const fullName = user.user_metadata.full_name;
    const firstName = fullName?.split(' ')[0];
    const lastName = fullName?.split(' ')[1];
    console.log(user.email);
    const contact = await resend.contacts.create({
      email: user.email!,
      audienceId: process.env.RESEND_GENERAL_AUDIENCES_ID || '',
      firstName,
      lastName
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log(contact);
  }

  return NextResponse.json({ message: 'Users created' }, { status: 200 });
}
