import { NextResponse } from 'next/server';

// This route is no longer used - chat functionality has been moved to the backend Express server
export async function POST() {
  return NextResponse.json(
    { 
      error: 'This endpoint is deprecated. Please use the backend API endpoint instead.' 
    }, 
    { status: 410 }
  );
}
