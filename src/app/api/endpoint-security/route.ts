import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_ATLAS_BACKEND_URL || 'http://localhost:8000';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const env = searchParams.get('env') || 'cloud';

    const headers: Record<string, string> = {};
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(`${API_URL}/api/v1/dashboard/endpoint-security?env=${env}`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Backend error' }));
      return NextResponse.json(
        { error: error.detail || 'Failed to fetch endpoint security data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Endpoint security API error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend' },
      { status: 503 }
    );
  }
}
