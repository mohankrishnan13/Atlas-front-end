import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { incidentId, action } = await request.json();
  
  if (!incidentId || !action) {
    return new NextResponse(
      JSON.stringify({ message: 'incidentId and action are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // You might have different backend endpoints for different actions
  const backendUrl = `${process.env.ATLAS_BACKEND_URL}/api/v1/incidents/remediate`;

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${process.env.BACKEND_API_TOKEN}`
      },
      body: JSON.stringify({ incidentId, action }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Backend error from ${backendUrl}: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to post to backend. Status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Failed to proxy POST request to ${backendUrl}:`, error);
    const details = `Could not connect to the backend service at ${backendUrl}. Please ensure the backend server is running and accessible. Details: ${error.message}`;
    return new NextResponse(
      JSON.stringify({ message: 'Failed to send remediation command.', details }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
