import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_ATLAS_BACKEND_URL || 'http://localhost:8000';

async function handler(request: Request) {
  try {
    const headers: Record<string, string> = {};
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    if (request.method === 'POST' || request.method === 'PUT') {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}/api/users`, {
      method: request.method,
      headers,
      body: (request.method === 'POST' || request.method === 'PUT') ? request.body : null,
      cache: 'no-store',
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.detail || 'Backend error' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API proxy error for /api/users:', error);
    return NextResponse.json({ error: 'Failed to connect to backend' }, { status: 503 });
  }
}

export { handler as GET, handler as POST };
