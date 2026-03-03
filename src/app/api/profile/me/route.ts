import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_ATLAS_BACKEND_URL || 'http://localhost:8000';

async function handler(request: Request) {
  try {
    const headers: Record<string, string> = {};
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    if (request.method === 'PUT') {
        headers['Content-Type'] = 'application/json';
    }

    const url = `${API_URL}/api/profile/me`;

    const response = await fetch(url, {
      method: request.method,
      headers: headers,
      body: request.method === 'PUT' ? request.body : null,
      cache: 'no-store',
    });

    if (!response.ok) {
        const errorText = await response.text();
        const error = JSON.parse(errorText || '{}');
        return NextResponse.json({ error: error.detail || 'Backend error' }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API proxy error for /api/profile/me:', error);
    return NextResponse.json({ error: 'Failed to connect to backend' }, { status: 503 });
  }
}

export { handler as GET, handler as PUT };
