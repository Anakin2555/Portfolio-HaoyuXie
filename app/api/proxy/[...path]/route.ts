import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://118.31.186.204:3001/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  
  const url = `${BACKEND_URL}/${path}${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
} 