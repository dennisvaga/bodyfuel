import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the search query from the request
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    
    if (!query) {
      return NextResponse.json({ 
        success: false, 
        message: 'Search query is required' 
      }, { status: 400 });
    }
    
    // Call the backend API to search for products
    // In production, you would use an environment variable for the API URL
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5001';
    const response = await fetch(`${backendUrl}/api/products/search?search=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Return the search results
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error searching products:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'An error occurred while searching for products' 
    }, { status: 500 });
  }
}
