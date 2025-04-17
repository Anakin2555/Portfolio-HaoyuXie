import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://118.31.186.204:3001/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Get the full URL of the request
    const fullUrl = new URL(request.url);
    
    // Get the target path from params
    const targetPath = params.path.join('/');
    
    // Construct the backend URL
    const backendUrl = new URL(targetPath, BACKEND_URL);
    
    // Copy all search params
    fullUrl.searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });

    console.log('Proxying request to:', backendUrl.toString());

    const response = await fetch(backendUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from backend' },
      { status: 500 }
    );
  }
} 