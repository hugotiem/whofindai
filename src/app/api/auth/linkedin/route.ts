import linkedin from "@/lib/linkedin/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = linkedin.generateAuthUrl({ scope: 'r_dma_portability_3rd_party' });
  return NextResponse.json({ url });
}