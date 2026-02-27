import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_ATLAS_BACKEND_URL || 'http://localhost:8000';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const headers = new Headers(request.headers);
  const url = `${API_URL}/api/users/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: headers,
  });

  const data = await response.text();
  
  return new NextResponse(data, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
    },
  });
}
