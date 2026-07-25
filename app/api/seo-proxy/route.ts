import { NextRequest, NextResponse } from 'next/server';

const DFS_BASE = 'https://api.dataforseo.com/v3';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('X-DataForSEO-Auth');
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Missing X-DataForSEO-Auth header' },
      { status: 401 },
    );
  }

  let body: { path?: string; [key: string]: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const apiPath = body.path;
  if (!apiPath || typeof apiPath !== 'string') {
    return NextResponse.json(
      { error: 'Missing "path" in request body' },
      { status: 400 },
    );
  }

  const payload = { ...body };
  delete payload.path;

  try {
    const res = await fetch(`${DFS_BASE}${apiPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Proxy request failed' },
      { status: 502 },
    );
  }
}
