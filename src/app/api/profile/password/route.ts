import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_ATLAS_BACKEND_URL || 'http://localhost:8000';

export async function PUT(request: Request) {
  const headers = new Headers(request.headers);
  const url = `${API_URL}/api/profile/password`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: headers,
    body: request.body,
  });

  const data = await response.text();
  
  return new NextResponse(data, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
    },
  });
}
