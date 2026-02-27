import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_ATLAS_BACKEND_URL || 'http://localhost:8000';

export async function PUT(request: Request) {
  try {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const url = `${API_URL}/api/profile/password`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: request.body,
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
    console.error('API proxy error for /api/profile/password:', error);
    return NextResponse.json({ error: 'Failed to connect to backend' }, { status: 503 });
  }
}
