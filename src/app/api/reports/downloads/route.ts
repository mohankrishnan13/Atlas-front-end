import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_ATLAS_BACKEND_URL || 'http://localhost:8000';

export async function GET(request: Request) {
  try {
    const headers: Record<string, string> = {};
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const url = `${API_URL}/api/reports/downloads`;

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
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
    console.error('API proxy error for /api/reports/downloads:', error);
    return NextResponse.json({ error: 'Failed to connect to backend' }, { status: 503 });
  }
}
