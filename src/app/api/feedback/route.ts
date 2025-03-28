import { NextResponse } from 'next/server';
import { notionClient, NOTION_DATABASE_ID } from '@/lib/notion/client';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
   const authorization = request.headers.get('Authorization')?.split(' ')[1];
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser(authorization);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userInfo = await prisma.user.findUnique({
      where: { id: user?.id }
    });

    if (!userInfo) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { feedback } = body;

    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback is required' },
        { status: 400 }
      );
    }

    // First, get the database schema to see available properties
    const database = await notionClient.databases.retrieve({
      database_id: NOTION_DATABASE_ID
    });

    console.log('Available properties:', database.properties);

    console.log(database.id);

    const response = await notionClient.pages.create({
      parent: {
        database_id: NOTION_DATABASE_ID
      },
      properties: {
        UserId: {
          title: [
            {
              text: {
                content: userInfo.id
              }
            }
          ]
        },
        Email: {
          title: [
            {
              text: {
                content: userInfo.email
              }
            }
          ]
        },
        'Customer Id': {
          rich_text: [
            {
              text: {
                content: userInfo.id
              }
            }
          ]
        },
        Plan: {
          select: {
            name: userInfo.plan || 'FREE'
          }
        },
        Message: {
          rich_text: [
            {
              text: {
                content: feedback
              }
            }
          ]
        }
        // Responsable: {
        //   people: [
        //     {
        //       id: user.id
        //     }
        //   ]
        // }
      }
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 }
    );
  }
}
