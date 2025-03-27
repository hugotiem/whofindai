import { NextResponse } from 'next/server';
import { notionClient, NOTION_DATABASE_ID } from '@/lib/notion/client';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { feedback, rating } = body;

    if (!feedback || !rating) {
      return NextResponse.json(
        { error: 'Feedback and rating are required' },
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
        Nom: {
          title: [
            {
              text: {
                content: `Feedback from ${user.email}`
              }
            }
          ]
        },
        État: {
          status: {
            name: 'À faire'
          }
        },
        Priorité: {
          select: {
            name: 'Medium'
          }
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
