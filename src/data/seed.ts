import {
  Brand,
  Category,
  Subcategory,
  Product,
  Order,
  CashRegister,
  FinancialTransaction,
  Customer,
  ReturnRequest,
  Coupon,
  Banner,
  StoreSettings,
  AuditLog,
  InventoryMovement
} from '../types';

export const initialBrands: Brand[] = [
  { id: 'b-nike', name: 'Nike', slug: 'nike', description: 'Just Do It. Líder mundial em calçados e vestuário esportivo.', active: true, logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80' },
  { id: 'b-adidas', name: 'Adidas', slug: 'adidas', description: 'The Brand with the 3 Stripes. Inovação e streetwear clássico.', active: true },
  { id: 'b-vans', name: 'Vans', slug: 'vans', description: 'Off The Wall. O clássico do skate e da cultura de rua desde 1966.', active: true },
  { id: 'b-nb', name: 'New Balance', slug: 'new-balance', description: 'Conforto inigualável, silhuetas retrô e alta durabilidade.', active: true },
  { id: 'b-puma', name: 'Puma', slug: 'puma', description: 'Forever Faster. Tradição e estilo esportivo audacioso.', active: true },
  { id: 'b-mizuno', name: 'Mizuno', slug: 'mizuno', description: 'Tecnologia japonesa de amortecimento máximo e performance.', active: true },
  { id: 'b-converse', name: 'Converse', slug: 'converse', description: 'Ícone atemporal do rock, skate e moda urbana.', active: true },
  { id: 'b-fila', name: 'Fila', slug: 'fila', description: 'Design esportivo com herança italiana e visual retrofuturista.', active: true },
  { id: 'b-olympikus', name: 'Olympikus', slug: 'olympikus', description: 'Tecnologia nacional para alta performance na corrida e dia a dia.', active: true }
];

export const initialCategories: Category[] = [
  {
    id: 'cat-tenis',
    name: 'Tênis',
    slug: 'tenis',
    description: 'Sneakers exclusivos, corrida, performance e lifestyle urbano das melhores marcas mundiais.',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    itemCount: 7
  },
  {
    id: 'cat-roupas',
    name: 'Roupas',
    slug: 'roupas',
    description: 'Camisetas oversized, moletons pesados, calças cargo e conjuntos streetwear.',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
    itemCount: 5
  },
  {
    id: 'cat-acessorios',
    name: 'Acessórios',
    slug: 'acessorios',
    description: 'Bonés exclusivos, meias cano alto, mochilas táticas e carteiras.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    itemCount: 3
  }
];

export const initialSubcategories: Subcategory[] = [
  { id: 'sub-tenis-casual', categoryId: 'cat-tenis', name: 'Casual & Lifestyle', slug: 'casual' },
  { id: 'sub-tenis-skate', categoryId: 'cat-tenis', name: 'Skate', slug: 'skate' },
  { id: 'sub-tenis-corrida', categoryId: 'cat-tenis', name: 'Corrida & Performance', slug: 'corrida' },
  { id: 'sub-roupas-camisetas', categoryId: 'cat-roupas', name: 'Camisetas & Regatas', slug: 'camisetas' },
  { id: 'sub-roupas-moletons', categoryId: 'cat-roupas', name: 'Moletons & Jaquetas', slug: 'moletons' },
  { id: 'sub-roupas-calcas', categoryId: 'cat-roupas', name: 'Calças & Bermudas', slug: 'calcas' },
  { id: 'sub-acess-meias', categoryId: 'cat-acessorios', name: 'Meias', slug: 'meias' },
  { id: 'sub-acess-bones', categoryId: 'cat-acessorios', name: 'Bonés', slug: 'bones' },
  { id: 'sub-acess-mochilas', categoryId: 'cat-acessorios', name: 'Mochilas & Bolsas', slug: 'mochilas' }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-nike-air-max-90',
    name: 'Tênis Nike Air Max 90 Infrared Classic',
    slug: 'nike-air-max-90-infrared',
    description: 'Nada mais marcante, nada mais comprovado. O Nike Air Max 90 permanece fiel às suas raízes originais com a icônica sola Waffle, sobreposições costuradas e os toques clássicos de TPU que adicionam um estilo sem esforço. Amortecimento Max Air visível desenvolvido originalmente para corrida de alta performance.',
    shortDescription: 'Ícone dos anos 90 com amortecimento Max Air visível e cabedal em couro e mesh respirável.',
    categoryId: 'cat-tenis',
    subcategoryId: 'sub-tenis-casual',
    brandId: 'b-nike',
    baseSku: 'NK-AM90-INF',
    barcode: '7891002003011',
    costPrice: 420.0,
    sellingPrice: 799.9,
    promoPrice: 699.9,
    weightKg: 0.95,
    heightCm: 14,
    widthCm: 22,
    lengthCm: 34,
    status: 'active',
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    gender: 'unissex',
    tags: ['air max', 'nike', 'streetwear', 'lifestyle', 'retro'],
    images: [
      {
        id: 'img-am90-1',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
        alt: 'Tênis Nike Air Max 90 Ângulo Lateral',
        isPrimary: true,
        isSecondary: false,
        order: 1
      },
      {
        id: 'img-am90-2',
        url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1000&q=80',
        alt: 'Tênis Nike Air Max 90 Detalhe Superior',
        isPrimary: false,
        isSecondary: true,
        order: 2
      },
      {
        id: 'img-am90-3',
        url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
        alt: 'Tênis Nike Air Max 90 Traseira e Solado',
        isPrimary: false,
        isSecondary: false,
        order: 3
      }
    ],
    variants: [
      { id: 'var-am90-38', productId: 'prod-nike-air-max-90', size: '38', color: 'Preto/Vermelho', sku: 'NK-AM90-38', barcode: '789100200381', stock: 3, minStock: 2 },
      { id: 'var-am90-39', productId: 'prod-nike-air-max-90', size: '39', color: 'Preto/Vermelho', sku: 'NK-AM90-39', barcode: '789100200391', stock: 5, minStock: 2 },
      { id: 'var-am90-40', productId: 'prod-nike-air-max-90', size: '40', color: 'Preto/Vermelho', sku: 'NK-AM90-40', barcode: '789100200401', stock: 2, minStock: 2 },
      { id: 'var-am90-41', productId: 'prod-nike-air-max-90', size: '41', color: 'Preto/Vermelho', sku: 'NK-AM90-41', barcode: '789100200411', stock: 0, minStock: 2 }, // Out of stock!
      { id: 'var-am90-42', productId: 'prod-nike-air-max-90', size: '42', color: 'Preto/Vermelho', sku: 'NK-AM90-42', barcode: '789100200421', stock: 4, minStock: 2 },
      { id: 'var-am90-43', productId: 'prod-nike-air-max-90', size: '43', color: 'Preto/Vermelho', sku: 'NK-AM90-43', barcode: '789100200431', stock: 3, minStock: 2 },
      { id: 'var-am90-44', productId: 'prod-nike-air-max-90', size: '44', color: 'Preto/Vermelho', sku: 'NK-AM90-44', barcode: '789100200441', stock: 1, minStock: 2 } // Low stock!
    ],
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-28T14:30:00Z'
  },
  {
    id: 'prod-nike-dunk-low-panda',
    name: 'Tênis Nike Dunk Low Retro Panda White/Black',
    slug: 'nike-dunk-low-retro-panda',
    description: 'Criado para as quadras, mas levado para as ruas, o ícone do basquete dos anos 80 retorna com sobreposições perfeitamente brilhantes e cores originais inspiradas nos times universitários. Cabedal em couro premium durável que envelhece com maciez perfeita.',
    shortDescription: 'O sneaker mais cobiçado da cultura streetwear contemporânea em colorway preto e branco.',
    categoryId: 'cat-tenis',
    subcategoryId: 'sub-tenis-skate',
    brandId: 'b-nike',
    baseSku: 'NK-DUNK-PANDA',
    barcode: '7891002004022',
    costPrice: 480.0,
    sellingPrice: 899.9,
    weightKg: 0.9,
    heightCm: 13,
    widthCm: 21,
    lengthCm: 33,
    status: 'active',
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    gender: 'unissex',
    tags: ['dunk', 'panda', 'nike', 'hype', 'skate'],
    images: [
      {
        id: 'img-dunk-1',
        url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80',
        alt: 'Nike Dunk Low Panda Lateral',
        isPrimary: true,
        isSecondary: false,
        order: 1
      },
      {
        id: 'img-dunk-2',
        url: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=1000&q=80',
        alt: 'Nike Dunk Low Panda Par Completo',
        isPrimary: false,
        isSecondary: true,
        order: 2
      }
    ],
    variants: [
      { id: 'var-dunk-38', productId: 'prod-nike-dunk-low-panda', size: '38', color: 'Preto/Branco', sku: 'NK-DUNK-38', stock: 2, minStock: 2 },
      { id: 'var-dunk-39', productId: 'prod-nike-dunk-low-panda', size: '39', color: 'Preto/Branco', sku: 'NK-DUNK-39', stock: 4, minStock: 2 },
      { id: 'var-dunk-40', productId: 'prod-nike-dunk-low-panda', size: '40', color: 'Preto/Branco', sku: 'NK-DUNK-40', stock: 5, minStock: 2 },
      { id: 'var-dunk-41', productId: 'prod-nike-dunk-low-panda', size: '41', color: 'Preto/Branco', sku: 'NK-DUNK-41', stock: 3, minStock: 2 },
      { id: 'var-dunk-42', productId: 'prod-nike-dunk-low-panda', size: '42', color: 'Preto/Branco', sku: 'NK-DUNK-42', stock: 2, minStock: 2 },
      { id: 'var-dunk-43', productId: 'prod-nike-dunk-low-panda', size: '43', color: 'Preto/Branco', sku: 'NK-DUNK-43', stock: 2, minStock: 2 }
    ],
    createdAt: '2026-09-05T12:00:00Z',
    updatedAt: '2026-09-29T10:00:00Z'
  },
  {
    id: 'prod-vans-old-skool',
    name: 'Tênis Vans Old Skool Black White Clássico',
    slug: 'vans-old-skool-black-white',
    description: 'O tênis clássico de skate da Vans e o primeiro a conter a icônica sidestripe na lateral. Com cano baixo, cabedal resistente de lona e camurça, biqueiras reforçadas para suportar o desgaste por atrito e colarinho acolchoado para suporte e flexibilidade.',
    shortDescription: 'O clássico indispensável do streetwear mundial com sola Waffle vulcanizada.',
    categoryId: 'cat-tenis',
    subcategoryId: 'sub-tenis-skate',
    brandId: 'b-vans',
    baseSku: 'VN-OLDSKOOL-BW',
    costPrice: 190.0,
    sellingPrice: 379.9,
    promoPrice: 329.9,
    weightKg: 0.85,
    heightCm: 12,
    widthCm: 20,
    lengthCm: 32,
    status: 'active',
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    gender: 'unissex',
    tags: ['vans', 'old skool', 'skate', 'clássico'],
    images: [
      {
        id: 'img-vans-1',
        url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=80',
        alt: 'Vans Old Skool Lateral',
        isPrimary: true,
        isSecondary: false,
        order: 1
      },
      {
        id: 'img-vans-2',
        url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80',
        alt: 'Vans Old Skool Detalhe Solado',
        isPrimary: false,
        isSecondary: true,
        order: 2
      }
    ],
    variants: [
      { id: 'var-vans-37', productId: 'prod-vans-old-skool', size: '37', color: 'Preto/Branco', sku: 'VN-OS-37', stock: 4, minStock: 2 },
      { id: 'var-vans-38', productId: 'prod-vans-old-skool', size: '38', color: 'Preto/Branco', sku: 'VN-OS-38', stock: 6, minStock: 2 },
      { id: 'var-vans-39', productId: 'prod-vans-old-skool', size: '39', color: 'Preto/Branco', sku: 'VN-OS-39', stock: 8, minStock: 2 },
      { id: 'var-vans-40', productId: 'prod-vans-old-skool', size: '40', color: 'Preto/Branco', sku: 'VN-OS-40', stock: 5, minStock: 2 },
      { id: 'var-vans-41', productId: 'prod-vans-old-skool', size: '41', color: 'Preto/Branco', sku: 'VN-OS-41', stock: 6, minStock: 2 },
      { id: 'var-vans-42', productId: 'prod-vans-old-skool', size: '42', color: 'Preto/Branco', sku: 'VN-OS-42', stock: 4, minStock: 2 }
    ],
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-09-25T11:00:00Z'
  },
  {
    id: 'prod-nb-550-green',
    name: 'Tênis New Balance 550 White Green Vintage',
    slug: 'new-balance-550-white-green',
    description: 'O retorno de uma lenda do basquete. Lançado originalmente em 1989, o 550 deixou sua marca nas quadras de basquete de costa a costa nos EUA. Silhueta de cano baixo, estrutura aerodinâmica e cabedal de couro premium com detalhes perfurados.',
    shortDescription: 'Silhueta retrô-basquete sensação no mundo da moda, conforto e presença marcante.',
    categoryId: 'cat-tenis',
    subcategoryId: 'sub-tenis-casual',
    brandId: 'b-nb',
    baseSku: 'NB-550-WGR',
    costPrice: 410.0,
    sellingPrice: 799.9,
    weightKg: 0.95,
    heightCm: 14,
    widthCm: 22,
    lengthCm: 34,
    status: 'active',
    isNew: true,
    isFeatured: true,
    isBestSeller: false,
    gender: 'unissex',
    tags: ['new balance', '550', 'vintage', 'retro'],
    images: [
      {
        id: 'img-nb-1',
        url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1000&q=80',
        alt: 'New Balance 550 Vista Lateral',
        isPrimary: true,
        isSecondary: false,
        order: 1
      },
      {
        id: 'img-nb-2',
        url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
        alt: 'New Balance 550 Superior',
        isPrimary: false,
        isSecondary: true,
        order: 2
      }
    ],
    variants: [
      { id: 'var-nb-39', productId: 'prod-nb-550-green', size: '39', color: 'Branco/Verde', sku: 'NB-550-39', stock: 2, minStock: 2 },
      { id: 'var-nb-40', productId: 'prod-nb-550-green', size: '40', color: 'Branco/Verde', sku: 'NB-550-40', stock: 4, minStock: 2 },
      { id: 'var-nb-41', productId: 'prod-nb-550-green', size: '41', color: 'Branco/Verde', sku: 'NB-550-41', stock: 3, minStock: 2 },
      { id: 'var-nb-42', productId: 'prod-nb-550-green', size: '42', color: 'Branco/Verde', sku: 'NB-550-42', stock: 2, minStock: 2 }
    ],
    createdAt: '2026-09-10T14:00:00Z',
    updatedAt: '2026-09-28T16:00:00Z'
  },
  {
    id: 'prod-mizuno-prophecy',
    name: 'Tênis Mizuno Wave Prophecy 12 Platinum',
    slug: 'mizuno-wave-prophecy-12-platinum',
    description: 'O ápice da tecnologia Mizuno. A icônica placa Wave infinita proporciona absorção de impacto incomparável, estabilidade biomecânica e um visual imponente que dominou as ruas brasileiras.',
    shortDescription: 'Amortecimento Wave supremo com placa articulada, acabamento premium espelhado.',
    categoryId: 'cat-tenis',
    subcategoryId: 'sub-tenis-corrida',
    brandId: 'b-mizuno',
    baseSku: 'MZ-PROP-12PLT',
    costPrice: 750.0,
    sellingPrice: 1399.9,
    promoPrice: 1249.9,
    weightKg: 1.1,
    heightCm: 15,
    widthCm: 23,
    lengthCm: 35,
    status: 'active',
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    gender: 'masculino',
    tags: ['mizuno', 'prophecy', 'corrida', 'performance'],
    images: [
      {
        id: 'img-miz-1',
        url: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=1000&q=80',
        alt: 'Mizuno Prophecy 12 Lateral',
        isPrimary: true,
        isSecondary: false,
        order: 1
      },
      {
        id: 'img-miz-2',
        url: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=1000&q=80',
        alt: 'Mizuno Prophecy Solado Wave',
        isPrimary: false,
        isSecondary: true,
        order: 2
      }
    ],
    variants: [
      { id: 'var-miz-39', productId: 'prod-mizuno-prophecy', size: '39', color: 'Prata/Preto', sku: 'MZ-P12-39', stock: 1, minStock: 2 },
      { id: 'var-miz-40', productId: 'prod-mizuno-prophecy', size: '40', color: 'Prata/Preto', sku: 'MZ-P12-40', stock: 3, minStock: 2 },
      { id: 'var-miz-41', productId: 'prod-mizuno-prophecy', size: '41', color: 'Prata/Preto', sku: 'MZ-P12-41', stock: 2, minStock: 2 },
      { id: 'var-miz-42', productId: 'prod-mizuno-prophecy', size: '42', color: 'Prata/Preto', sku: 'MZ-P12-42', stock: 2, minStock: 2 }
    ],
    createdAt: '2026-09-12T11:00:00Z',
    updatedAt: '2026-09-27T10:00:00Z'
  },
  {
    id: 'prod-camiseta-oversized-gigante',
    name: 'Camiseta Oversized Streetwear Gigante Heavyweight 260g',
    slug: 'camiseta-oversized-gigante-heavyweight',
    description: 'Desenvolvida com algodão penteado 100% brasileiro de altíssima gramatura (260g/m²). Gola grossa de 3cm com ribana canelada, costuras duplas reforçadas ombro a ombro e caimento quadrado streetwear contemporâneo.',
    shortDescription: 'Camiseta pesada 260g com gola alta de 3cm e caimento oversized impecável.',
    categoryId: 'cat-roupas',
    subcategoryId: 'sub-roupas-camisetas',
    brandId: 'b-nike',
    baseSku: 'GM-TSHIRT-HVY',
    costPrice: 45.0,
    sellingPrice: 129.9,
    promoPrice: 99.9,
    weightKg: 0.35,
    heightCm: 3,
    widthCm: 25,
    lengthCm: 32,
    status: 'active',
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    gender: 'unissex',
    tags: ['camiseta', 'oversized', 'streetwear', 'heavyweight'],
    images: [
      {
        id: 'img-tsh-1',
        url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
        alt: 'Camiseta Oversized Preta Frontal',
        isPrimary: true,
        isSecondary: false,
        order: 1
      },
      {
        id: 'img-tsh-2',
        url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
        alt: 'Camiseta Oversized Caimento nas Costas',
        isPrimary: false,
        isSecondary: true,
        order: 2
      }
    ],
    variants: [
      { id: 'var-tsh-p-blk', productId: 'prod-camiseta-oversized-gigante', size: 'P', color: 'Preto', sku: 'GM-TSH-P-BLK', stock: 6, minStock: 3 },
      { id: 'var-tsh-m-blk', productId: 'prod-camiseta-oversized-gigante', size: 'M', color: 'Preto', sku: 'GM-TSH-M-BLK', stock: 12, minStock: 3 },
      { id: 'var-tsh-g-blk', productId: 'prod-camiseta-oversized-gigante', size: 'G', color: 'Preto', sku: 'GM-TSH-G-BLK', stock: 9, minStock: 3 },
      { id: 'var-tsh-gg-blk', productId: 'prod-camiseta-oversized-gigante', size: 'GG', color: 'Preto', sku: 'GM-TSH-GG-BLK', stock: 4, minStock: 3 }
    ],
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-09-29T15:00:00Z'
  },
  {
    id: 'prod-moletom-canguru-fleece',
    name: 'Moletom Canguru Premium Street Fleece 400g',
    slug: 'moletom-canguru-premium-street-fleece',
    description: 'Moletom encorpado com felpa interna grossa e forro duplo no capuz. Bolso frontal espaçoso, punhos elásticos canelados e ilhós de metal escurecido com cordão robusto. Peça quente e estruturada.',
    shortDescription: 'Gramatura pesada 400g com forro quentinho e capuz duplo estruturado.',
    categoryId: 'cat-roupas',
    subcategoryId: 'sub-roupas-moletons',
    brandId: 'b-adidas',
    baseSku: 'GM-HOOD-400',
    costPrice: 90.0,
    sellingPrice: 249.9,
    promoPrice: 219.9,
    weightKg: 0.8,
    heightCm: 8,
    widthCm: 30,
    lengthCm: 38,
    status: 'active',
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    gender: 'unissex',
    tags: ['moletom', 'hoodie', 'canguru', 'fleece', 'inverno'],
    images: [
      {
        id: 'img-hood-1',
        url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
        alt: 'Moletom Canguru Preto Frontal',
        isPrimary: true,
        isSecondary: false,
        order: 1
      },
      {
        id: 'img-hood-2',
        url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80',
        alt: 'Moletom Modelo Vestindo',
        isPrimary: false,
        isSecondary: true,
        order: 2
      }
    ],
    variants: [
      { id: 'var-hood-p', productId: 'prod-moletom-canguru-fleece', size: 'P', color: 'Preto', sku: 'GM-HD-P', stock: 3, minStock: 2 },
      { id: 'var-hood-m', productId: 'prod-moletom-canguru-fleece', size: 'M', color: 'Preto', sku: 'GM-HD-M', stock: 7, minStock: 2 },
      { id: 'var-hood-g', productId: 'prod-moletom-canguru-fleece', size: 'G', color: 'Preto', sku: 'GM-HD-G', stock: 5, minStock: 2 },
      { id: 'var-hood-gg', productId: 'prod-moletom-canguru-fleece', size: 'GG', color: 'Preto', sku: 'GM-HD-GG', stock: 2, minStock: 2 }
    ],
    createdAt: '2026-08-22T10:00:00Z',
    updatedAt: '2026-09-28T12:00:00Z'
  },
  {
    id: 'prod-calca-cargo-tatica',
    name: 'Calça Cargo Streetwear Tática 6 Bolsos Ripstop',
    slug: 'calca-cargo-tatica-6-bolsos-ripstop',
    description: 'Confeccionada em tecido Ripstop militar resistente a rasgos e água. Modelagem jogger ajustável no tornozelo com elástico e zíper, 6 bolsos funcionais espaçosos com fecho em velcro reforçado e cintura com cordão embutido.',
    shortDescription: 'Tecido Ripstop militar anti-rasgo com reguladores de tornozelo e 6 bolsos.',
    categoryId: 'cat-roupas',
    subcategoryId: 'sub-roupas-calcas',
    brandId: 'b-nike',
    baseSku: 'GM-CARGO-RIP',
    costPrice: 85.0,
    sellingPrice: 219.9,
    weightKg: 0.55,
    heightCm: 5,
    widthCm: 26,
    lengthCm: 34,
    status: 'active',
    isNew: true,
    isFeatured: false,
    isBestSeller: true,
    gender: 'unissex',
    tags: ['calca', 'cargo', 'ripstop', 'tatica', 'streetwear'],
    images: [
      {
        id: 'img-crg-1',
        url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
        alt: 'Calça Cargo Streetwear Frontal',
        isPrimary: true,
        isSecondary: false,
        order: 1
      },
      {
        id: 'img-crg-2',
        url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80',
        alt: 'Calça Cargo Detalhe Bolsos',
        isPrimary: false,
        isSecondary: true,
        order: 2
      }
    ],
    variants: [
      { id: 'var-crg-38', productId: 'prod-calca-cargo-tatica', size: '38', color: 'Preto', sku: 'GM-CRG-38', stock: 4, minStock: 2 },
      { id: 'var-crg-40', productId: 'prod-calca-cargo-tatica', size: '40', color: 'Preto', sku: 'GM-CRG-40', stock: 6, minStock: 2 },
      { id: 'var-crg-42', productId: 'prod-calca-cargo-tatica', size: '42', color: 'Preto', sku: 'GM-CRG-42', stock: 5, minStock: 2 },
      { id: 'var-crg-44', productId: 'prod-calca-cargo-tatica', size: '44', color: 'Preto', sku: 'GM-CRG-44', stock: 3, minStock: 2 }
    ],
    createdAt: '2026-09-02T10:00:00Z',
    updatedAt: '2026-09-29T10:00:00Z'
  },
  {
    id: 'prod-kit-meias-cano-alto',
    name: 'Kit 3 Pares Meia Cano Alto Streetwear Gigante Confort',
    slug: 'kit-3-pares-meia-cano-alto-gigante',
    description: 'Kit com 3 pares de meias de cano alto atoalhadas no pé para máximo amortecimento e conforto ao usar sneakers pesados. Confeccionadas em algodão macio com elastano que não escorrega da panturrilha.',
    shortDescription: 'Algodão atoalhado grosso, calcanhar reforçado e cano canelado que não desce.',
    categoryId: 'cat-acessorios',
    subcategoryId: 'sub-acess-meias',
    brandId: 'b-nike',
    baseSku: 'GM-SOCKS-3PK',
    costPrice: 18.0,
    sellingPrice: 49.9,
    weightKg: 0.2,
    heightCm: 4,
    widthCm: 15,
    lengthCm: 22,
    status: 'active',
    isNew: false,
    isFeatured: false,
    isBestSeller: true,
    gender: 'unissex',
    tags: ['meias', 'cano alto', 'kit', 'acessorios'],
    images: [
      {
        id: 'img-sck-1',
        url: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=1000&q=80',
        alt: 'Kit 3 Pares de Meia Streetwear',
        isPrimary: true,
        isSecondary: false,
        order: 1
      },
      {
        id: 'img-sck-2',
        url: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=1000&q=80',
        alt: 'Meias no Tênis Estilo Urbano',
        isPrimary: false,
        isSecondary: true,
        order: 2
      }
    ],
    variants: [
      { id: 'var-sck-u-wht', productId: 'prod-kit-meias-cano-alto', size: '38-43 (Único)', color: 'Branco / Listras', sku: 'GM-SCK-WHT', stock: 25, minStock: 5 },
      { id: 'var-sck-u-blk', productId: 'prod-kit-meias-cano-alto', size: '38-43 (Único)', color: 'Preto', sku: 'GM-SCK-BLK', stock: 18, minStock: 5 }
    ],
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-09-28T09:00:00Z'
  },
  {
    id: 'prod-bone-strapback-gigante',
    name: 'Boné Strapback Aba Curva Premium Bordado Gigante',
    slug: 'bone-strapback-aba-curva-premium-gigante',
    description: 'Boné modelo Dad Hat com aba curva anatômica e costura reforçada. Fecho strapback traseiro em fita com fivela metálica de latão envelhecido, regulagem precisa e bordado frontal de alta definição.',
    shortDescription: 'Tecido sarja 100% algodão, bordado em alto relevo e fecho em fivela de latão.',
    categoryId: 'cat-acessorios',
    subcategoryId: 'sub-acess-bones',
    brandId: 'b-vans',
    baseSku: 'GM-CAP-STRAP',
    costPrice: 32.0,
    sellingPrice: 89.9,
    promoPrice: 79.9,
    weightKg: 0.15,
    heightCm: 12,
    widthCm: 18,
    lengthCm: 22,
    status: 'active',
    isNew: true,
    isFeatured: true,
    isBestSeller: false,
    gender: 'unissex',
    tags: ['bone', 'strapback', 'dad hat', 'acessorios'],
    images: [
      {
        id: 'img-cap-1',
        url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=80',
        alt: 'Boné Strapback Preto Frontal',
        isPrimary: true,
        isSecondary: false,
        order: 1
      },
      {
        id: 'img-cap-2',
        url: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=1000&q=80',
        alt: 'Boné Detalhe Fivela Traseira',
        isPrimary: false,
        isSecondary: true,
        order: 2
      }
    ],
    variants: [
      { id: 'var-cap-blk', productId: 'prod-bone-strapback-gigante', size: 'Único Regulável', color: 'Preto', sku: 'GM-CAP-BLK', stock: 14, minStock: 3 },
      { id: 'var-cap-khk', productId: 'prod-bone-strapback-gigante', size: 'Único Regulável', color: 'Cáqui', sku: 'GM-CAP-KHK', stock: 8, minStock: 3 }
    ],
    createdAt: '2026-09-08T10:00:00Z',
    updatedAt: '2026-09-29T11:00:00Z'
  },
  {
    id: 'prod-mochila-urbana-tatica',
    name: 'Mochila Urbana Tática Multifuncional Impermeável',
    slug: 'mochila-urbana-tatica-multifuncional',
    description: 'Mochila com compartimento acolchoado antichoque para notebook de até 16 polegadas. Tecido Oxford impermeável de alta densidade, passador para mala de bordo, alças ergonômicas respiráveis e bolsos laterais com trava para squeeze.',
    shortDescription: 'Tecido Oxford impermeável, compartimento seguro para notebook 16" e ergonomia de alto nível.',
    categoryId: 'cat-acessorios',
    subcategoryId: 'sub-acess-mochilas',
    brandId: 'b-puma',
    baseSku: 'GM-BCKPK-TAC',
    costPrice: 90.0,
    sellingPrice: 229.9,
    weightKg: 0.75,
    heightCm: 48,
    widthCm: 32,
    lengthCm: 18,
    status: 'active',
    isNew: false,
    isFeatured: false,
    isBestSeller: true,
    gender: 'unissex',
    tags: ['mochila', 'bolsa', 'tatica', 'notebook'],
    images: [
      {
        id: 'img-bpk-1',
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
        alt: 'Mochila Urbana Preta Frontal',
        isPrimary: true,
        isSecondary: false,
        order: 1
      },
      {
        id: 'img-bpk-2',
        url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80',
        alt: 'Mochila Detalhes Compartimentos',
        isPrimary: false,
        isSecondary: true,
        order: 2
      }
    ],
    variants: [
      { id: 'var-bpk-blk', productId: 'prod-mochila-urbana-tatica', size: '28 Litros', color: 'Preto All Black', sku: 'GM-BPK-BLK', stock: 7, minStock: 2 }
    ],
    createdAt: '2026-08-28T10:00:00Z',
    updatedAt: '2026-09-28T18:00:00Z'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'GM-000101',
    customerName: 'Lucas Oliveira Santos',
    customerCpf: '394.882.108-44',
    customerEmail: 'lucas.santos@email.com',
    customerPhone: '(11) 98122-3344',
    deliveryType: 'shipping',
    shippingAddress: {
      cep: '04538-133',
      street: 'Rua Joaquim Floriano',
      number: '466',
      complement: 'Apto 102',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP'
    },
    items: [
      {
        id: 'item-101-1',
        orderId: 'ord-101',
        productId: 'prod-nike-air-max-90',
        variantId: 'var-am90-42',
        productName: 'Tênis Nike Air Max 90 Infrared Classic',
        brandName: 'Nike',
        productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80',
        size: '42',
        color: 'Preto/Vermelho',
        sku: 'NK-AM90-42',
        unitPrice: 699.9,
        costPrice: 420.0,
        quantity: 1,
        subtotal: 699.9
      }
    ],
    subtotal: 699.9,
    shippingCost: 0.0,
    discount: 0.0,
    total: 699.9,
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    orderStatus: 'entregue',
    shipment: {
      id: 'shp-101',
      orderId: 'ord-101',
      carrier: 'Correios',
      trackingCode: 'AA123456789BR',
      serviceName: 'SEDEX',
      weightKg: 0.95,
      heightCm: 14,
      widthCm: 22,
      lengthCm: 34,
      declaredValue: 699.9,
      status: 'delivered',
      labelGeneratedAt: '2026-09-24T14:00:00Z'
    },
    timeline: [
      { id: 'tl-101-1', status: 'pago', title: 'Pagamento Confirmado', description: 'Pagamento no Pix aprovado instantaneamente.', timestamp: '2026-09-24T11:20:00Z', actor: 'Sistema' },
      { id: 'tl-101-2', status: 'em_separacao', title: 'Pedido em Separação', description: 'Produtos separados e conferidos no estoque.', timestamp: '2026-09-24T12:00:00Z', actor: 'Estoque' },
      { id: 'tl-101-3', status: 'enviado', title: 'Despachado para os Correios', description: 'Código de rastreio AA123456789BR gerado.', timestamp: '2026-09-24T14:30:00Z', actor: 'Expedição' },
      { id: 'tl-101-4', status: 'entregue', title: 'Pedido Entregue', description: 'Encomenda entregue com sucesso ao destinatário.', timestamp: '2026-09-26T16:45:00Z', actor: 'Correios' }
    ],
    createdAt: '2026-09-24T11:15:00Z',
    updatedAt: '2026-09-26T16:45:00Z'
  },
  {
    id: 'ord-102',
    orderNumber: 'GM-000102',
    customerName: 'Mariana Costa Ribeiro',
    customerCpf: '284.991.038-12',
    customerEmail: 'mariana.costa@email.com',
    customerPhone: '(21) 97233-4455',
    deliveryType: 'shipping',
    shippingAddress: {
      cep: '22041-001',
      street: 'Avenida Atlântica',
      number: '1702',
      neighborhood: 'Copacabana',
      city: 'Rio de Janeiro',
      state: 'RJ'
    },
    items: [
      {
        id: 'item-102-1',
        orderId: 'ord-102',
        productId: 'prod-nike-dunk-low-panda',
        variantId: 'var-dunk-39',
        productName: 'Tênis Nike Dunk Low Retro Panda White/Black',
        brandName: 'Nike',
        productImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=300&q=80',
        size: '39',
        color: 'Preto/Branco',
        sku: 'NK-DUNK-39',
        unitPrice: 899.9,
        costPrice: 480.0,
        quantity: 1,
        subtotal: 899.9
      }
    ],
    subtotal: 899.9,
    shippingCost: 28.5,
    discount: 50.0,
    total: 878.4,
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    orderStatus: 'em_transito',
    couponCode: 'GIGANTE10',
    shipment: {
      id: 'shp-102',
      orderId: 'ord-102',
      carrier: 'Correios',
      trackingCode: 'QB987654321BR',
      serviceName: 'SEDEX',
      weightKg: 0.9,
      heightCm: 13,
      widthCm: 21,
      lengthCm: 33,
      declaredValue: 899.9,
      status: 'shipped',
      labelGeneratedAt: '2026-09-28T10:00:00Z'
    },
    timeline: [
      { id: 'tl-102-1', status: 'pago', title: 'Pagamento Aprovado', description: 'Cartão de crédito em 6x sem juros.', timestamp: '2026-09-27T18:00:00Z', actor: 'Gateway de Pagamento' },
      { id: 'tl-102-2', status: 'em_separacao', title: 'Em Separação', description: 'Embalado com proteção anti-impacto.', timestamp: '2026-09-28T08:30:00Z', actor: 'Estoque' },
      { id: 'tl-102-3', status: 'enviado', title: 'Objeto Postado', description: 'Postado na agência dos Correios com rastreio QB987654321BR.', timestamp: '2026-09-28T10:30:00Z', actor: 'Correios' },
      { id: 'tl-102-4', status: 'em_transito', title: 'Em Trânsito', description: 'Em transferência para o Centro de Distribuição do Rio de Janeiro.', timestamp: '2026-09-29T06:15:00Z', actor: 'Correios' }
    ],
    createdAt: '2026-09-27T17:50:00Z',
    updatedAt: '2026-09-29T06:15:00Z'
  },
  {
    id: 'ord-103',
    orderNumber: 'GM-000103',
    customerName: 'Gabriel Alencar Freitas',
    customerCpf: '412.390.871-00',
    customerEmail: 'gabriel.alencar@email.com',
    customerPhone: '(11) 99455-8899',
    deliveryType: 'shipping',
    shippingAddress: {
      cep: '01414-001',
      street: 'Rua Haddock Lobo',
      number: '1307',
      neighborhood: 'Cerqueira César',
      city: 'São Paulo',
      state: 'SP'
    },
    items: [
      {
        id: 'item-103-1',
        orderId: 'ord-103',
        productId: 'prod-camiseta-oversized-gigante',
        variantId: 'var-tsh-g-blk',
        productName: 'Camiseta Oversized Streetwear Gigante Heavyweight 260g',
        brandName: 'Nike',
        productImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80',
        size: 'G',
        color: 'Preto',
        sku: 'GM-TSH-G-BLK',
        unitPrice: 99.9,
        costPrice: 45.0,
        quantity: 2,
        subtotal: 199.8
      }
    ],
    subtotal: 199.8,
    shippingCost: 15.0,
    discount: 0.0,
    total: 214.8,
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    orderStatus: 'em_separacao', // Requires owner action in "Atenção Necessária"!
    timeline: [
      { id: 'tl-103-1', status: 'pago', title: 'Pagamento Aprovado', description: 'Pix confirmado com sucesso.', timestamp: '2026-09-30T14:10:00Z', actor: 'Sistema' },
      { id: 'tl-103-2', status: 'em_separacao', title: 'Aguardando Embalagem', description: 'Pedido recebido na fila de separação do proprietário.', timestamp: '2026-09-30T14:30:00Z', actor: 'Estoque' }
    ],
    createdAt: '2026-09-30T14:05:00Z',
    updatedAt: '2026-09-30T14:30:00Z'
  },
  {
    id: 'ord-104',
    orderNumber: 'GM-000104',
    customerName: 'Renata Meirelles Silveira',
    customerCpf: '109.876.543-21',
    customerEmail: 'renata.m@email.com',
    customerPhone: '(11) 97722-1100',
    deliveryType: 'pickup',
    items: [
      {
        id: 'item-104-1',
        orderId: 'ord-104',
        productId: 'prod-bone-strapback-gigante',
        variantId: 'var-cap-blk',
        productName: 'Boné Strapback Aba Curva Premium Bordado Gigante',
        brandName: 'Vans',
        productImage: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=300&q=80',
        size: 'Único Regulável',
        color: 'Preto',
        sku: 'GM-CAP-BLK',
        unitPrice: 79.9,
        costPrice: 32.0,
        quantity: 1,
        subtotal: 79.9
      }
    ],
    subtotal: 79.9,
    shippingCost: 0.0,
    discount: 0.0,
    total: 79.9,
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    orderStatus: 'pronto_retirada',
    timeline: [
      { id: 'tl-104-1', status: 'pago', title: 'Pagamento Aprovado', description: 'Pix confirmado.', timestamp: '2026-09-30T10:00:00Z', actor: 'Sistema' },
      { id: 'tl-104-2', status: 'pronto_retirada', title: 'Pronto para Retirada', description: 'Pedido pronto na loja física Gigante Multimarcas (Av. Paulista, 1578).', timestamp: '2026-09-30T11:15:00Z', actor: 'Proprietário' }
    ],
    createdAt: '2026-09-30T09:55:00Z',
    updatedAt: '2026-09-30T11:15:00Z'
  }
];

export const initialInventoryMovements: InventoryMovement[] = [
  {
    id: 'mov-01',
    variantId: 'var-am90-42',
    productId: 'prod-nike-air-max-90',
    productName: 'Tênis Nike Air Max 90 Infrared Classic',
    variantDesc: 'Tamanho 42 - Preto/Vermelho',
    type: 'sale',
    quantity: -1,
    previousStock: 5,
    newStock: 4,
    reason: 'Venda online #GM-000101',
    orderId: 'ord-101',
    createdAt: '2026-09-24T11:20:00Z'
  },
  {
    id: 'mov-02',
    variantId: 'var-dunk-39',
    productId: 'prod-nike-dunk-low-panda',
    productName: 'Tênis Nike Dunk Low Retro Panda White/Black',
    variantDesc: 'Tamanho 39 - Preto/Branco',
    type: 'sale',
    quantity: -1,
    previousStock: 5,
    newStock: 4,
    reason: 'Venda online #GM-000102',
    orderId: 'ord-102',
    createdAt: '2026-09-27T18:00:00Z'
  },
  {
    id: 'mov-03',
    variantId: 'var-tsh-g-blk',
    productId: 'prod-camiseta-oversized-gigante',
    productName: 'Camiseta Oversized Streetwear Gigante Heavyweight 260g',
    variantDesc: 'Tamanho G - Preto',
    type: 'sale',
    quantity: -2,
    previousStock: 11,
    newStock: 9,
    reason: 'Venda online #GM-000103',
    orderId: 'ord-103',
    createdAt: '2026-09-30T14:10:00Z'
  },
  {
    id: 'mov-04',
    variantId: 'var-cap-blk',
    productId: 'prod-bone-strapback-gigante',
    productName: 'Boné Strapback Aba Curva Premium Bordado Gigante',
    variantDesc: 'Único Regulável - Preto',
    type: 'sale',
    quantity: -1,
    previousStock: 15,
    newStock: 14,
    reason: 'Venda online retirada #GM-000104',
    orderId: 'ord-104',
    createdAt: '2026-09-30T10:00:00Z'
  }
];

export const initialCashRegister: CashRegister = {
  id: 'reg-today',
  openedAt: '2026-09-30T09:00:00Z',
  operatorId: 'usr-owner-01',
  operatorName: 'Rodrigo Gigante (Proprietário)',
  openingBalance: 250.0,
  totalInflow: 379.8,
  totalOutflow: 35.0,
  expectedBalance: 594.8,
  status: 'open',
  movements: [
    {
      id: 'cm-01',
      registerId: 'reg-today',
      type: 'in',
      category: 'sale_physical',
      paymentMethod: 'pix',
      amount: 129.9,
      description: 'Venda balcão: Camiseta Oversized M Preta',
      timestamp: '2026-09-30T10:45:00Z'
    },
    {
      id: 'cm-02',
      registerId: 'reg-today',
      type: 'in',
      category: 'sale_physical',
      paymentMethod: 'credit_card',
      amount: 249.9,
      description: 'Venda balcão: Moletom Canguru G Preto',
      timestamp: '2026-09-30T12:15:00Z'
    },
    {
      id: 'cm-03',
      registerId: 'reg-today',
      type: 'out',
      category: 'expense',
      paymentMethod: 'cash',
      amount: 35.0,
      description: 'Sangria / Despesa de limpeza e sacolas da loja física',
      timestamp: '2026-09-30T13:00:00Z'
    }
  ]
};

export const initialFinancialTransactions: FinancialTransaction[] = [
  {
    id: 'ft-01',
    type: 'in',
    category: 'venda',
    amount: 699.9,
    paymentMethod: 'pix',
    date: '2026-09-24',
    description: 'Receita Pedido Online #GM-000101',
    referenceId: 'ord-101',
    referenceType: 'order'
  },
  {
    id: 'ft-02',
    type: 'in',
    category: 'venda',
    amount: 878.4,
    paymentMethod: 'credit_card',
    date: '2026-09-27',
    description: 'Receita Pedido Online #GM-000102',
    referenceId: 'ord-102',
    referenceType: 'order'
  },
  {
    id: 'ft-03',
    type: 'out',
    category: 'aluguel',
    amount: 3200.0,
    paymentMethod: 'pix',
    date: '2026-09-05',
    description: 'Aluguel do Ponto Comercial - Av. Paulista',
    observation: 'Pago via Pix com recibo fiscal'
  },
  {
    id: 'ft-04',
    type: 'out',
    category: 'energia',
    amount: 385.4,
    paymentMethod: 'pix',
    date: '2026-09-10',
    description: 'Enel Energia Elétrica Loja Física'
  },
  {
    id: 'ft-05',
    type: 'out',
    category: 'internet',
    amount: 149.9,
    paymentMethod: 'pix',
    date: '2026-09-12',
    description: 'Vivo Fibra 500MB Loja'
  },
  {
    id: 'ft-06',
    type: 'out',
    category: 'compra_estoque',
    amount: 4500.0,
    paymentMethod: 'credit_card',
    date: '2026-09-15',
    description: 'Reposição Lote Nike Sneakers Q3',
    observation: 'Nota Fiscal 48.910 - Distribuidor Autorizado'
  },
  {
    id: 'ft-07',
    type: 'in',
    category: 'venda',
    amount: 214.8,
    paymentMethod: 'pix',
    date: '2026-09-30',
    description: 'Receita Pedido Online #GM-000103',
    referenceId: 'ord-103',
    referenceType: 'order'
  },
  {
    id: 'ft-08',
    type: 'in',
    category: 'venda',
    amount: 79.9,
    paymentMethod: 'pix',
    date: '2026-09-30',
    description: 'Receita Pedido Retirada #GM-000104',
    referenceId: 'ord-104',
    referenceType: 'order'
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-01',
    name: 'Lucas Oliveira Santos',
    cpf: '394.882.108-44',
    email: 'lucas.santos@email.com',
    phone: '(11) 98122-3344',
    totalOrders: 3,
    totalSpent: 1650.0,
    lastOrderDate: '2026-09-24',
    addresses: [
      {
        cep: '04538-133',
        street: 'Rua Joaquim Floriano',
        number: '466',
        complement: 'Apto 102',
        neighborhood: 'Itaim Bibi',
        city: 'São Paulo',
        state: 'SP'
      }
    ],
    createdAt: '2026-05-10T10:00:00Z'
  },
  {
    id: 'cust-02',
    name: 'Mariana Costa Ribeiro',
    cpf: '284.991.038-12',
    email: 'mariana.costa@email.com',
    phone: '(21) 97233-4455',
    totalOrders: 2,
    totalSpent: 1220.0,
    lastOrderDate: '2026-09-27',
    addresses: [
      {
        cep: '22041-001',
        street: 'Avenida Atlântica',
        number: '1702',
        neighborhood: 'Copacabana',
        city: 'Rio de Janeiro',
        state: 'RJ'
      }
    ],
    createdAt: '2026-07-14T15:30:00Z'
  }
];

export const initialBanners: Banner[] = [
  {
    id: 'bnr-1',
    title: 'SEU ESTILO. SUA MARCA. SEU MOMENTO.',
    subtitle: 'Os tênis, roupas e acessórios mais exclusivos da cultura streetwear, com qualidade, autenticidade e as melhores marcas do mercado.',
    ctaText: 'Explorar Produtos',
    ctaLink: '/produtos',
    imageUrl: '/images/hero_banner_clean.jpg',
    badgeText: 'MODA URBANA • SNEAKERS • STREETWEAR',
    order: 1,
    active: true
  },
  {
    id: 'bnr-2',
    title: 'SNEAKERS HYPE & PERFORMANCE',
    subtitle: 'Linha completa Nike Air Max, Dunk Low, New Balance 550 e Vans com parcelamento em até 10x sem juros ou 5% OFF no Pix.',
    ctaText: 'Ver Tênis',
    ctaLink: '/produtos?categoria=tenis',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=85',
    badgeText: 'DESTAQUES DO MÊS',
    order: 2,
    active: true
  },
  {
    id: 'bnr-3',
    title: 'STREETWEAR HEAVYWEIGHT',
    subtitle: 'Camisetas 260g, moletons quentes e calças cargo com caimento autêntico e acabamento premium.',
    ctaText: 'Conferir Roupas',
    ctaLink: '/produtos?categoria=roupas',
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=85',
    badgeText: 'DROPS EXCLUSIVOS',
    order: 3,
    active: true
  }
];

export const initialCoupons: Coupon[] = [
  {
    id: 'cp-01',
    code: 'GIGANTE10',
    type: 'percentage',
    value: 10,
    minOrderValue: 150.0,
    maxUses: 500,
    currentUses: 23,
    expiresAt: '2026-12-31',
    active: true
  },
  {
    id: 'cp-02',
    code: 'BEMVINDO',
    type: 'fixed',
    value: 30.0,
    minOrderValue: 200.0,
    maxUses: 1000,
    currentUses: 87,
    expiresAt: '2026-12-31',
    active: true
  },
  {
    id: 'cp-03',
    code: 'FRETEGRATIS',
    type: 'free_shipping',
    value: 0,
    minOrderValue: 299.0,
    maxUses: 2000,
    currentUses: 142,
    expiresAt: '2026-12-31',
    active: true
  }
];

export const initialStoreSettings: StoreSettings = {
  storeName: 'Gigante Multimarcas',
  cnpj: '45.892.103/0001-88',
  email: 'contato@gigantemultimarcas.com.br',
  phone: '(11) 3288-4900',
  whatsapp: '5511987654321',
  address: {
    street: 'Avenida Paulista',
    number: '1578',
    complement: 'Loja 12 - Térreo Comercial',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    cep: '01310-200',
    mapsUrl: 'https://maps.google.com/?q=Avenida+Paulista+1578+Sao+Paulo'
  },
  openingHours: 'Segunda a Sábado: 09:00 às 20:00 | Domingo e Feriados: 12:00 às 18:00',
  socialLinks: {
    instagram: 'https://instagram.com/gigantemultimarcas',
    whatsapp: 'https://wa.me/5511987654321',
    facebook: 'https://facebook.com/gigantemultimarcas',
    tiktok: 'https://tiktok.com/@gigantemultimarcas'
  },
  shippingConfig: {
    freeShippingThreshold: 299.0,
    defaultPacPrice: 18.9,
    defaultSedexPrice: 28.5,
    pickupInstructions: 'Retire seu pedido gratuitamente na loja física Gigante Multimarcas (Av. Paulista, 1578, Loja 12, São Paulo). Disponível em até 2 horas após a confirmação do pagamento.'
  },
  paymentConfig: {
    pixDiscountPercent: 5,
    maxInstallments: 10,
    minInstallmentValue: 40.0
  }
};

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'aud-01',
    userId: 'usr-owner-01',
    userName: 'Rodrigo Gigante',
    role: 'owner',
    action: 'abertura_caixa',
    entity: 'cash_register',
    entityId: 'reg-today',
    details: 'Abertura de caixa com fundo de troco de R$ 250,00',
    timestamp: '2026-09-30T09:00:00Z'
  },
  {
    id: 'aud-02',
    userId: 'usr-owner-01',
    userName: 'Rodrigo Gigante',
    role: 'owner',
    action: 'atualizacao_status_pedido',
    entity: 'order',
    entityId: 'ord-104',
    details: 'Alterou status para Pronto para Retirada',
    timestamp: '2026-09-30T11:15:00Z'
  },
  {
    id: 'aud-03',
    userId: 'usr-owner-01',
    userName: 'Rodrigo Gigante',
    role: 'owner',
    action: 'ajuste_estoque',
    entity: 'product_variant',
    entityId: 'var-am90-41',
    details: 'Estoque do Nike Air Max 90 tamanho 41 zerado após venda',
    timestamp: '2026-09-29T18:00:00Z'
  }
];

export const initialReturnRequests: ReturnRequest[] = [
  {
    id: 'ret-01',
    orderId: 'ord-101',
    orderNumber: 'GM-000101',
    customerName: 'Lucas Oliveira Santos',
    productId: 'prod-nike-air-max-90',
    variantId: 'var-am90-42',
    productName: 'Tênis Nike Air Max 90 Infrared Classic',
    variantDesc: 'Tamanho 42 - Preto/Vermelho',
    quantity: 1,
    reason: 'Cliente solicitou troca de numeração por tamanho 43',
    condition: 'novo_com_etiqueta',
    refundAmount: 699.9,
    status: 'solicitada', // For Atenção Necessária
    requestedAt: '2026-09-30T11:00:00Z',
    notes: 'Aguardando recebimento do par na loja para conferência.'
  }
];
