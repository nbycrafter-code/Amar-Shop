// app/api/products/search/route.ts
import { searchProducts } from '@/queries/products';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // Convert slug to normal text if needed
    let searchText = null;
    if (search) {
      searchText = search.replace(/-/g, ' ');
    }
    
    const products = await searchProducts(category, searchText);
    
    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
      filters: {
        category: category || null,
        search: searchText || null
      }
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}