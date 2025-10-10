import { NextResponse } from 'next/server';

// Simple server-side JSON-RPC proxy for the client.
// Forwards POST requests to the RPC provider set in RPC_URL or NEXT_PUBLIC_RPC_URL.
export async function POST(request: Request) {
  const rpcUrl = process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL;
  if (!rpcUrl) {
    return NextResponse.json({ error: 'RPC backend not configured. Set RPC_URL or NEXT_PUBLIC_RPC_URL on the server.' }, { status: 500 });
  }

  try {
    const body = await request.text();
    const resp = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    const text = await resp.text();
    return new NextResponse(text, {
      status: resp.status,
      headers: {
        'Content-Type': resp.headers.get('content-type') || 'application/json',
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: 'RPC proxy is up. POST JSON-RPC requests to this endpoint.' });
}
