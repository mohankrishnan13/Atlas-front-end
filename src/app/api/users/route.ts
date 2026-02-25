import { NextResponse } from 'next/server';

// This is a proxy route to your backend.
// It fetches data from your actual backend API and forwards it to the frontend.
// This is a good practice to avoid CORS issues and to keep your backend URL and any API keys secret.
export async function GET() {
  const backendUrl = `${process.env.ATLAS_BACKEND_URL}/api/v1/settings/users`;

  try {
    const response = await fetch(backendUrl, {
        // If your backend requires authentication (e.g., an API token),
        // you would add the Authorization header here.
        // headers: {
        //   'Authorization': `Bearer ${process.env.BACKEND_API_TOKEN}`
        // }
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Backend error from ${backendUrl}: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to fetch from backend. Status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Failed to proxy request to ${backendUrl}:`, error);
    // Return a 502 Bad Gateway error if the proxy fails
    const details = `Could not connect to the backend service at ${backendUrl}. Please ensure the backend server is running and accessible from the application. Details: ${error.message}`;
    return new NextResponse(
      JSON.stringify({ message: 'Failed to fetch data from backend.', details }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
