import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProduct } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const q = searchParams.get('q');
    const sort = searchParams.get('sort');
    const inStockOnly = searchParams.get('inStock') === 'true';

    let products = getProducts();

    if (category) {
      products = products.filter(p => p.categoryId === category || p.subcategoryId === category);
    }

    if (brand) {
      products = products.filter(p => p.brandId === brand);
    }

    if (inStockOnly) {
      products = products.filter(p => p.variants.some(v => v.stock > 0));
    }

    if (q) {
      const term = q.toLowerCase();
      products = products.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.baseSku.toLowerCase().includes(term) ||
          p.tags.some(t => t.toLowerCase().includes(term))
      );
    }

    if (sort) {
      if (sort === 'price_asc') {
        products.sort((a, b) => (a.promoPrice ?? a.sellingPrice) - (b.promoPrice ?? b.sellingPrice));
      } else if (sort === 'price_desc') {
        products.sort((a, b) => (b.promoPrice ?? b.sellingPrice) - (a.promoPrice ?? a.sellingPrice));
      } else if (sort === 'discount') {
        products.sort((a, b) => {
          const discA = a.promoPrice ? (a.sellingPrice - a.promoPrice) / a.sellingPrice : 0;
          const discB = b.promoPrice ? (b.sellingPrice - b.promoPrice) / b.sellingPrice : 0;
          return discB - discA;
        });
      } else if (sort === 'newest') {
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.sellingPrice) {
      return NextResponse.json({ error: 'Nome e Preço de Venda são obrigatórios.' }, { status: 400 });
    }
    const saved = saveProduct(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
