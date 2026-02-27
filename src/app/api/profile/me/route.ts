import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_ATLAS_BACKEND_URL || 'http://localhost:8000';

async function forwardRequest(request: Request) {
  const headers = new Headers(request.headers);
  const url = `${API_URL}/api/profile/me`;

  const response = await fetch(url, {
    method: request.method,
    headers: headers,
    body: request.method !== 'GET' ? request.body : null,
  });

  const data = await response.text();
  
  return new NextResponse(data, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
    },
  });
}

export async function GET(request: Request) {
  return forwardRequest(request);
}

export async function PUT(request: Request) {
  return forwardRequest(request);
}
