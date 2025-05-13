import linkedin from '@/lib/linkedin/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const url = linkedin.generateAuthUrl({ scope: 'r_dma_portability_3rd_party' });
  return NextResponse.json({ url });
}