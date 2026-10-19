import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getBrands, getCategories } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').trim().toLowerCase();

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [], products: [], brands: [], categories: [] });
    }

    const products = getProducts();
    const brands = getBrands();
    const categories = getCategories();

    // Matching products
    const matchedProducts = products
      .filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.baseSku.toLowerCase().includes(query) ||
          p.tags.some(t => t.toLowerCase().includes(query))
      )
      .slice(0, 6)
      .map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        sellingPrice: p.sellingPrice,
        promoPrice: p.promoPrice,
        image: p.images[0]?.url || '',
        category: p.categoryId,
        brandId: p.brandId
      }));

    // Matching brands
    const matchedBrands = brands
      .filter(b => b.name.toLowerCase().includes(query))
      .slice(0, 4)
      .map(b => ({ id: b.id, name: b.name, slug: b.slug }));

    // Matching categories
    const matchedCategories = categories
      .filter(c => c.name.toLowerCase().includes(query))
      .slice(0, 3)
      .map(c => ({ id: c.id, name: c.name, slug: c.slug }));

    // Text suggestions
    const suggestionSet = new Set<string>();
    matchedProducts.forEach(p => suggestionSet.add(p.name));
    matchedBrands.forEach(b => suggestionSet.add(`Marca: ${b.name}`));
    matchedCategories.forEach(c => suggestionSet.add(`Categoria: ${c.name}`));

    return NextResponse.json({
      suggestions: Array.from(suggestionSet).slice(0, 8),
      products: matchedProducts,
      brands: matchedBrands,
      categories: matchedCategories
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
