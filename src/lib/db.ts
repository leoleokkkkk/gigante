import fs from 'fs';
import path from 'path';
import {
  Product,
  ProductVariant,
  Order,
  OrderStatus,
  CashRegister,
  CashMovement,
  FinancialTransaction,
  Customer,
  ReturnRequest,
  Coupon,
  Banner,
  StoreSettings,
  AuditLog,
  InventoryMovement,
  Category,
  Brand,
  Shipment,
  PaymentMethod
} from '../types';
import {
  initialBrands,
  initialCategories,
  initialProducts,
  initialOrders,
  initialCashRegister,
  initialFinancialTransactions,
  initialCustomers,
  initialBanners,
  initialCoupons,
  initialStoreSettings,
  initialAuditLogs,
  initialReturnRequests,
  initialInventoryMovements
} from '../data/seed';

export interface DatabaseSchema {
  categories: Category[];
  brands: Brand[];
  products: Product[];
  orders: Order[];
  cashRegisters: CashRegister[];
  currentCashRegister: CashRegister | null;
  financialTransactions: FinancialTransaction[];
  customers: Customer[];
  returns: ReturnRequest[];
  coupons: Coupon[];
  banners: Banner[];
  settings: StoreSettings;
  auditLogs: AuditLog[];
  inventoryMovements: InventoryMovement[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'store.json');

function ensureDataDir() {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadDatabase(): DatabaseSchema {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE_PATH)) {
    const initialData: DatabaseSchema = {
      categories: initialCategories,
      brands: initialBrands,
      products: initialProducts,
      orders: initialOrders,
      cashRegisters: [initialCashRegister],
      currentCashRegister: initialCashRegister,
      financialTransactions: initialFinancialTransactions,
      customers: initialCustomers,
      returns: initialReturnRequests,
      coupons: initialCoupons,
      banners: initialBanners,
      settings: initialStoreSettings,
      auditLogs: initialAuditLogs,
      inventoryMovements: initialInventoryMovements
    };
    saveDatabase(initialData);
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(raw) as DatabaseSchema;
  } catch (err) {
    console.error('Error reading database file, reinitializing with seed:', err);
    const initialData: DatabaseSchema = {
      categories: initialCategories,
      brands: initialBrands,
      products: initialProducts,
      orders: initialOrders,
      cashRegisters: [initialCashRegister],
      currentCashRegister: initialCashRegister,
      financialTransactions: initialFinancialTransactions,
      customers: initialCustomers,
      returns: initialReturnRequests,
      coupons: initialCoupons,
      banners: initialBanners,
      settings: initialStoreSettings,
      auditLogs: initialAuditLogs,
      inventoryMovements: initialInventoryMovements
    };
    saveDatabase(initialData);
    return initialData;
  }
}

function saveDatabase(data: DatabaseSchema): void {
  ensureDataDir();
  const tmpPath = `${DB_FILE_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpPath, DB_FILE_PATH);
}

// ----------------------------------------------------
// AUDIT HELPER
// ----------------------------------------------------
export function logAudit(
  action: string,
  entity: string,
  entityId: string,
  details: string,
  userName = 'Proprietário'
): void {
  const db = loadDatabase();
  const newLog: AuditLog = {
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId: 'usr-owner-01',
    userName,
    role: 'owner',
    action,
    entity,
    entityId,
    details,
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(newLog);
  saveDatabase(db);
}

// ----------------------------------------------------
// PRODUCTS & VARIANTS
// ----------------------------------------------------
export function getProducts(): Product[] {
  return loadDatabase().products;
}

export function getProductById(id: string): Product | undefined {
  return loadDatabase().products.find(p => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return loadDatabase().products.find(p => p.slug === slug);
}

export function saveProduct(productData: Partial<Product> & { name: string }): Product {
  const db = loadDatabase();
  const now = new Date().toISOString();
  
  if (productData.id) {
    const index = db.products.findIndex(p => p.id === productData.id);
    if (index !== -1) {
      const existing = db.products[index];
      const updated: Product = {
        ...existing,
        ...productData,
        updatedAt: now
      };
      db.products[index] = updated;
      saveDatabase(db);
      logAudit('editar_produto', 'product', updated.id, `Atualizou dados do produto: ${updated.name}`);
      return updated;
    }
  }

  // Create new product
  const id = productData.id || `prod-${Date.now()}`;
  const slug =
    productData.slug ||
    productData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const newProduct: Product = {
    id,
    name: productData.name,
    slug,
    description: productData.description || '',
    shortDescription: productData.shortDescription || '',
    categoryId: productData.categoryId || 'cat-tenis',
    subcategoryId: productData.subcategoryId,
    brandId: productData.brandId || 'b-nike',
    baseSku: productData.baseSku || `SKU-${Date.now().toString().slice(-6)}`,
    barcode: productData.barcode,
    costPrice: productData.costPrice || 0,
    sellingPrice: productData.sellingPrice || 0,
    promoPrice: productData.promoPrice,
    weightKg: productData.weightKg || 0.5,
    heightCm: productData.heightCm || 10,
    widthCm: productData.widthCm || 20,
    lengthCm: productData.lengthCm || 30,
    status: productData.status || 'active',
    isNew: productData.isNew ?? true,
    isFeatured: productData.isFeatured ?? false,
    isBestSeller: productData.isBestSeller ?? false,
    gender: productData.gender || 'unissex',
    tags: productData.tags || [],
    images: productData.images || [
      {
        id: `img-${Date.now()}-1`,
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
        alt: productData.name,
        isPrimary: true,
        isSecondary: false,
        order: 1
      }
    ],
    variants: productData.variants || [
      {
        id: `var-${Date.now()}-1`,
        productId: id,
        size: 'Único',
        color: 'Padrão',
        sku: `${productData.baseSku || 'SKU'}-U`,
        stock: 5,
        minStock: 2
      }
    ],
    createdAt: now,
    updatedAt: now
  };

  db.products.unshift(newProduct);
  saveDatabase(db);
  logAudit('criar_produto', 'product', newProduct.id, `Cadastrou novo produto: ${newProduct.name}`);
  return newProduct;
}

export function deleteProduct(id: string): boolean {
  const db = loadDatabase();
  const product = db.products.find(p => p.id === id);
  if (!product) return false;

  db.products = db.products.filter(p => p.id !== id);
  saveDatabase(db);
  logAudit('excluir_produto', 'product', id, `Excluiu o produto: ${product.name}`);
  return true;
}

// ----------------------------------------------------
// INVENTORY & STOCK MOVEMENTS
// ----------------------------------------------------
export function adjustVariantStock(
  variantId: string,
  quantityChange: number,
  type: InventoryMovement['type'],
  reason: string,
  metadata?: { orderId?: string; saleId?: string; userName?: string }
): { success: boolean; error?: string; variant?: ProductVariant } {
  const db = loadDatabase();
  let foundProduct: Product | undefined;
  let foundVariant: ProductVariant | undefined;

  for (const product of db.products) {
    const v = product.variants.find(item => item.id === variantId);
    if (v) {
      foundProduct = product;
      foundVariant = v;
      break;
    }
  }

  if (!foundProduct || !foundVariant) {
    return { success: false, error: 'Variação não encontrada no catálogo.' };
  }

  const previousStock = foundVariant.stock;
  const newStock = previousStock + quantityChange;

  if (newStock < 0) {
    return {
      success: false,
      error: `Estoque insuficiente! Disponível: ${previousStock}, Solicitado: ${Math.abs(quantityChange)}.`
    };
  }

  foundVariant.stock = newStock;
  foundProduct.updatedAt = new Date().toISOString();

  const movement: InventoryMovement = {
    id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    variantId: foundVariant.id,
    productId: foundProduct.id,
    productName: foundProduct.name,
    variantDesc: `Tam: ${foundVariant.size} | Cor: ${foundVariant.color}`,
    type,
    quantity: quantityChange,
    previousStock,
    newStock,
    reason,
    orderId: metadata?.orderId,
    saleId: metadata?.saleId,
    userName: metadata?.userName || 'Proprietário',
    createdAt: new Date().toISOString()
  };

  db.inventoryMovements.unshift(movement);
  saveDatabase(db);

  logAudit(
    'ajuste_estoque',
    'product_variant',
    foundVariant.id,
    `Movimentação de estoque (${quantityChange > 0 ? `+${quantityChange}` : quantityChange}): ${foundProduct.name} [${foundVariant.size}/${foundVariant.color}] — Novo estoque: ${newStock}. Motivo: ${reason}`
  );

  return { success: true, variant: foundVariant };
}

export function getInventoryMovements(): InventoryMovement[] {
  return loadDatabase().inventoryMovements;
}

// ----------------------------------------------------
// ORDERS & CHECKOUT
// ----------------------------------------------------
export function getOrders(): Order[] {
  return loadDatabase().orders;
}

export function getOrderById(id: string): Order | undefined {
  return loadDatabase().orders.find(o => o.id === id);
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
  const clean = orderNumber.replace('#', '').trim().toUpperCase();
  return loadDatabase().orders.find(
    o => o.orderNumber.replace('#', '').trim().toUpperCase() === clean
  );
}

export interface CreateOrderInput {
  customerName: string;
  customerCpf: string;
  customerEmail: string;
  customerPhone: string;
  deliveryType: 'shipping' | 'pickup';
  shippingAddress?: Order['shippingAddress'];
  items: Array<{
    productId: string;
    variantId: string;
    quantity: number;
  }>;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
}

export function createOrder(input: CreateOrderInput): { success: boolean; order?: Order; error?: string } {
  const db = loadDatabase();

  // Validate items and verify stocks first
  const orderItems: Order['items'] = [];
  let subtotal = 0;

  for (const itemInput of input.items) {
    const product = db.products.find(p => p.id === itemInput.productId);
    if (!product) {
      return { success: false, error: `Produto não encontrado: ${itemInput.productId}` };
    }

    const variant = product.variants.find(v => v.id === itemInput.variantId);
    if (!variant) {
      return { success: false, error: `Variação não encontrada para o produto ${product.name}` };
    }

    if (variant.stock < itemInput.quantity) {
      return {
        success: false,
        error: `Estoque insuficiente para "${product.name}" (Tam ${variant.size}). Disponível: ${variant.stock}, solicitado: ${itemInput.quantity}.`
      };
    }

    const unitPrice = product.promoPrice ?? product.sellingPrice;
    const itemSubtotal = unitPrice * itemInput.quantity;
    subtotal += itemSubtotal;

    orderItems.push({
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId: '', // populated below
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      brandName: db.brands.find(b => b.id === product.brandId)?.name || 'Gigante Multimarcas',
      productImage: product.images[0]?.url || '',
      size: variant.size,
      color: variant.color,
      sku: variant.sku,
      unitPrice,
      costPrice: product.costPrice,
      quantity: itemInput.quantity,
      subtotal: itemSubtotal
    });
  }

  // Calculate discounts
  let discount = 0;
  if (input.couponCode) {
    const coupon = db.coupons.find(
      c => c.code.toUpperCase() === input.couponCode?.toUpperCase() && c.active
    );
    if (coupon) {
      if (coupon.type === 'percentage') {
        discount = (subtotal * coupon.value) / 100;
      } else if (coupon.type === 'fixed') {
        discount = Math.min(coupon.value, subtotal);
      }
      coupon.currentUses += 1;
    }
  }

  // Shipping calculation
  let shippingCost = 0;
  if (input.deliveryType === 'shipping') {
    if (subtotal >= db.settings.shippingConfig.freeShippingThreshold) {
      shippingCost = 0;
    } else {
      shippingCost = db.settings.shippingConfig.defaultPacPrice;
    }
  }

  // Additional 5% Pix discount if applicable
  if (input.paymentMethod === 'pix' && db.settings.paymentConfig.pixDiscountPercent > 0) {
    const pixDiscount = (subtotal * db.settings.paymentConfig.pixDiscountPercent) / 100;
    discount += pixDiscount;
  }

  const total = Math.max(0, subtotal + shippingCost - discount);

  // Generate order number
  const nextNumber = (db.orders.length + 105).toString().padStart(6, '0');
  const orderNumber = `GM-${nextNumber}`;
  const orderId = `ord-${Date.now()}`;
  const now = new Date().toISOString();

  // Deduct stock for each variant and record movement
  for (const oi of orderItems) {
    oi.orderId = orderId;
    const res = adjustVariantStock(
      oi.variantId,
      -oi.quantity,
      'sale',
      `Venda Pedido #${orderNumber}`,
      { orderId, userName: input.customerName }
    );
    if (!res.success) {
      return { success: false, error: res.error };
    }
  }

  const newOrder: Order = {
    id: orderId,
    orderNumber,
    customerName: input.customerName,
    customerCpf: input.customerCpf,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    deliveryType: input.deliveryType,
    shippingAddress: input.shippingAddress,
    items: orderItems,
    subtotal,
    shippingCost,
    discount,
    total,
    paymentMethod: input.paymentMethod,
    paymentStatus: 'paid', // Real-time store order simulation
    orderStatus: input.deliveryType === 'pickup' ? 'pronto_retirada' : 'em_separacao',
    couponCode: input.couponCode,
    notes: input.notes,
    timeline: [
      {
        id: `tl-${Date.now()}-1`,
        status: 'pago',
        title: 'Pagamento Aprovado',
        description: `Pagamento via ${input.paymentMethod.toUpperCase()} confirmado com sucesso.`,
        timestamp: now,
        actor: 'Gateway de Pagamento'
      },
      {
        id: `tl-${Date.now()}-2`,
        status: input.deliveryType === 'pickup' ? 'pronto_retirada' : 'em_separacao',
        title: input.deliveryType === 'pickup' ? 'Disponível para Retirada' : 'Pedido em Separação',
        description:
          input.deliveryType === 'pickup'
            ? 'Pedido separado e aguardando retirada na loja física Gigante Multimarcas.'
            : 'Itens em conferência e embalagem para despacho.',
        timestamp: now,
        actor: 'Estoque'
      }
    ],
    createdAt: now,
    updatedAt: now
  };

  // Record financial transaction
  const ft: FinancialTransaction = {
    id: `ft-${Date.now()}`,
    type: 'in',
    category: 'venda',
    amount: total,
    paymentMethod: input.paymentMethod,
    date: now.split('T')[0],
    description: `Receita Pedido #${orderNumber} (${input.customerName})`,
    referenceId: orderId,
    referenceType: 'order'
  };
  db.financialTransactions.unshift(ft);

  // Update or create Customer
  const existingCust = db.customers.find(
    c => c.cpf === input.customerCpf || c.email.toLowerCase() === input.customerEmail.toLowerCase()
  );
  if (existingCust) {
    existingCust.totalOrders += 1;
    existingCust.totalSpent += total;
    existingCust.lastOrderDate = now.split('T')[0];
    if (input.shippingAddress) {
      existingCust.addresses.push(input.shippingAddress);
    }
  } else {
    db.customers.push({
      id: `cust-${Date.now()}`,
      name: input.customerName,
      cpf: input.customerCpf,
      email: input.customerEmail,
      phone: input.customerPhone,
      totalOrders: 1,
      totalSpent: total,
      lastOrderDate: now.split('T')[0],
      addresses: input.shippingAddress ? [input.shippingAddress] : [],
      createdAt: now
    });
  }

  db.orders.unshift(newOrder);
  saveDatabase(db);

  logAudit(
    'novo_pedido',
    'order',
    newOrder.id,
    `Pedido criado #${newOrder.orderNumber} por ${newOrder.customerName} - Total: R$ ${total.toFixed(2)}`
  );

  return { success: true, order: newOrder };
}

export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  actor = 'Proprietário',
  customTitle?: string,
  customDesc?: string
): Order | undefined {
  const db = loadDatabase();
  const order = db.orders.find(o => o.id === orderId);
  if (!order) return undefined;

  const prevStatus = order.orderStatus;
  order.orderStatus = newStatus;
  order.updatedAt = new Date().toISOString();

  // If order was cancelled and wasn't previously cancelled, restore stock safely!
  if (newStatus === 'cancelado' && prevStatus !== 'cancelado') {
    for (const item of order.items) {
      adjustVariantStock(
        item.variantId,
        item.quantity,
        'cancellation',
        `Estorno de cancelamento do Pedido #${order.orderNumber}`,
        { orderId: order.id, userName: actor }
      );
    }
  }

  // Titles dictionary for statuses
  const statusTitles: Record<OrderStatus, string> = {
    aguardando_pagamento: 'Aguardando Pagamento',
    pago: 'Pagamento Aprovado',
    em_separacao: 'Pedido em Separação',
    pronto_envio: 'Pronto para Envio',
    enviado: 'Despachado / Enviado',
    em_transito: 'Em Trânsito para Entrega',
    saiu_entrega: 'Saiu para Entrega',
    entregue: 'Pedido Entregue',
    pronto_retirada: 'Pronto para Retirada na Loja',
    retirado: 'Pedido Retirado pelo Cliente',
    cancelado: 'Pedido Cancelado',
    devolvido: 'Pedido Devolvido'
  };

  order.timeline.push({
    id: `tl-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: newStatus,
    title: customTitle || statusTitles[newStatus] || 'Atualização de Status',
    description: customDesc || `Status do pedido atualizado para ${statusTitles[newStatus]}.`,
    timestamp: new Date().toISOString(),
    actor
  });

  saveDatabase(db);
  logAudit(
    'atualizar_status_pedido',
    'order',
    order.id,
    `Pedido #${order.orderNumber} mudou de "${prevStatus}" para "${newStatus}" por ${actor}`
  );

  return order;
}

export function updateOrderShipment(
  orderId: string,
  shipmentData: Partial<Shipment>
): Order | undefined {
  const db = loadDatabase();
  const order = db.orders.find(o => o.id === orderId);
  if (!order) return undefined;

  const currentShipment: Shipment = order.shipment || {
    id: `shp-${Date.now()}`,
    orderId,
    carrier: 'Correios',
    serviceName: 'SEDEX',
    weightKg: 0.8,
    heightCm: 12,
    widthCm: 20,
    lengthCm: 32,
    declaredValue: order.total,
    status: 'shipped',
    labelGeneratedAt: new Date().toISOString()
  };

  order.shipment = {
    ...currentShipment,
    ...shipmentData,
    labelGeneratedAt: currentShipment.labelGeneratedAt || new Date().toISOString()
  };

  // If tracking code was provided and status wasn't shipped yet, auto advance
  if (shipmentData.trackingCode && order.orderStatus === 'em_separacao') {
    order.orderStatus = 'enviado';
    order.timeline.push({
      id: `tl-${Date.now()}`,
      status: 'enviado',
      title: 'Objeto Postado com Rastreamento',
      description: `Código de rastreio ${shipmentData.trackingCode} gerado via ${order.shipment.carrier} (${order.shipment.serviceName}).`,
      timestamp: new Date().toISOString(),
      actor: 'Expedição'
    });
  }

  saveDatabase(db);
  logAudit(
    'atualizar_envio',
    'shipment',
    order.id,
    `Atualizou dados de envio do Pedido #${order.orderNumber} (Rastreio: ${order.shipment.trackingCode || 'N/A'})`
  );

  return order;
}

// ----------------------------------------------------
// PHYSICAL STORE POS (VENDA BALCÃO / PRESENCIAL)
// ----------------------------------------------------
export interface CreatePhysicalSaleInput {
  items: Array<{
    productId: string;
    variantId: string;
    quantity: number;
    customPrice?: number;
  }>;
  paymentMethod: PaymentMethod;
  customerName?: string;
  customerPhone?: string;
  discount?: number;
  notes?: string;
}

export function createPhysicalSale(input: CreatePhysicalSaleInput): {
  success: boolean;
  order?: Order;
  error?: string;
} {
  const db = loadDatabase();

  if (!db.currentCashRegister || db.currentCashRegister.status !== 'open') {
    return {
      success: false,
      error: 'Não há caixa aberto no momento! Abra o caixa antes de realizar vendas presenciais.'
    };
  }

  const orderItems: Order['items'] = [];
  let subtotal = 0;

  for (const itemInput of input.items) {
    const product = db.products.find(p => p.id === itemInput.productId);
    if (!product) return { success: false, error: 'Produto não encontrado.' };

    const variant = product.variants.find(v => v.id === itemInput.variantId);
    if (!variant) return { success: false, error: 'Variação não encontrada.' };

    if (variant.stock < itemInput.quantity) {
      return {
        success: false,
        error: `Estoque insuficiente para ${product.name} Tam ${variant.size}. Disponível: ${variant.stock}.`
      };
    }

    const unitPrice = itemInput.customPrice ?? (product.promoPrice ?? product.sellingPrice);
    const itemSubtotal = unitPrice * itemInput.quantity;
    subtotal += itemSubtotal;

    orderItems.push({
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId: '',
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      brandName: db.brands.find(b => b.id === product.brandId)?.name || 'Gigante Multimarcas',
      productImage: product.images[0]?.url || '',
      size: variant.size,
      color: variant.color,
      sku: variant.sku,
      unitPrice,
      costPrice: product.costPrice,
      quantity: itemInput.quantity,
      subtotal: itemSubtotal
    });
  }

  const discount = input.discount || 0;
  const total = Math.max(0, subtotal - discount);
  const nextNumber = (db.orders.length + 105).toString().padStart(6, '0');
  const orderNumber = `GM-${nextNumber}`;
  const orderId = `ord-${Date.now()}`;
  const now = new Date().toISOString();

  // Deduct variant stock
  for (const oi of orderItems) {
    oi.orderId = orderId;
    adjustVariantStock(
      oi.variantId,
      -oi.quantity,
      'sale',
      `Venda Balcão #${orderNumber}`,
      { orderId, userName: 'Balcão / PDV' }
    );
  }

  const newOrder: Order = {
    id: orderId,
    orderNumber,
    customerName: input.customerName || 'Cliente Balcão',
    customerCpf: 'Presencial',
    customerEmail: 'balcao@gigantemultimarcas.com.br',
    customerPhone: input.customerPhone || '(11) Balcão',
    deliveryType: 'pickup',
    items: orderItems,
    subtotal,
    shippingCost: 0,
    discount,
    total,
    paymentMethod: input.paymentMethod,
    paymentStatus: 'paid',
    orderStatus: 'retirado',
    notes: input.notes,
    timeline: [
      {
        id: `tl-${Date.now()}-1`,
        status: 'pago',
        title: 'Venda Concluída no Balcão',
        description: `Venda presencial no PDV via ${input.paymentMethod.toUpperCase()}.`,
        timestamp: now,
        actor: 'Operador de Caixa'
      },
      {
        id: `tl-${Date.now()}-2`,
        status: 'retirado',
        title: 'Mercadoria Entregue',
        description: 'Produtos entregues em mãos no caixa da loja física.',
        timestamp: now,
        actor: 'Operador de Caixa'
      }
    ],
    createdAt: now,
    updatedAt: now
  };

  // Add movement into current open cash register
  const cashMovement: CashMovement = {
    id: `cm-${Date.now()}`,
    registerId: db.currentCashRegister.id,
    type: 'in',
    category: 'sale_physical',
    paymentMethod: input.paymentMethod,
    amount: total,
    description: `Venda balcão #${orderNumber} (${orderItems.map(i => `${i.quantity}x ${i.productName} Tam ${i.size}`).join(', ')})`,
    orderId,
    timestamp: now
  };

  db.currentCashRegister.movements.unshift(cashMovement);
  db.currentCashRegister.totalInflow += total;
  db.currentCashRegister.expectedBalance += total;

  // Add financial transaction
  db.financialTransactions.unshift({
    id: `ft-${Date.now()}`,
    type: 'in',
    category: 'venda',
    amount: total,
    paymentMethod: input.paymentMethod,
    date: now.split('T')[0],
    description: `Venda Presencial Balcão #${orderNumber}`,
    referenceId: orderId,
    referenceType: 'order'
  });

  db.orders.unshift(newOrder);
  saveDatabase(db);

  logAudit(
    'venda_presencial',
    'order',
    newOrder.id,
    `Realizou venda física #${newOrder.orderNumber} - R$ ${total.toFixed(2)} (${input.paymentMethod.toUpperCase()})`
  );

  return { success: true, order: newOrder };
}

// ----------------------------------------------------
// CASH REGISTER (ABERTURA E FECHAMENTO DE CAIXA)
// ----------------------------------------------------
export function getCurrentCashRegister(): CashRegister | null {
  return loadDatabase().currentCashRegister;
}

export function getCashRegistersHistory(): CashRegister[] {
  return loadDatabase().cashRegisters;
}

export function openCashRegister(operatorName: string, openingBalance: number): CashRegister {
  const db = loadDatabase();
  const now = new Date().toISOString();

  const newRegister: CashRegister = {
    id: `reg-${Date.now()}`,
    openedAt: now,
    operatorId: 'usr-owner-01',
    operatorName,
    openingBalance,
    totalInflow: 0,
    totalOutflow: 0,
    expectedBalance: openingBalance,
    status: 'open',
    movements: []
  };

  db.currentCashRegister = newRegister;
  db.cashRegisters.unshift(newRegister);
  saveDatabase(db);

  logAudit(
    'abertura_caixa',
    'cash_register',
    newRegister.id,
    `Caixa aberto por ${operatorName} com fundo de R$ ${openingBalance.toFixed(2)}`
  );

  return newRegister;
}

export function addCashMovement(
  type: 'in' | 'out',
  category: CashMovement['category'],
  paymentMethod: PaymentMethod,
  amount: number,
  description: string
): { success: boolean; movement?: CashMovement; error?: string } {
  const db = loadDatabase();
  if (!db.currentCashRegister || db.currentCashRegister.status !== 'open') {
    return { success: false, error: 'Nenhum caixa está aberto atualmente.' };
  }

  const movement: CashMovement = {
    id: `cm-${Date.now()}`,
    registerId: db.currentCashRegister.id,
    type,
    category,
    paymentMethod,
    amount,
    description,
    timestamp: new Date().toISOString()
  };

  db.currentCashRegister.movements.unshift(movement);
  if (type === 'in') {
    db.currentCashRegister.totalInflow += amount;
    db.currentCashRegister.expectedBalance += amount;
  } else {
    db.currentCashRegister.totalOutflow += amount;
    db.currentCashRegister.expectedBalance -= amount;
  }

  saveDatabase(db);
  logAudit(
    type === 'in' ? 'suprimento_caixa' : 'sangria_caixa',
    'cash_movement',
    movement.id,
    `${type === 'in' ? 'Entrada' : 'Saída'} no caixa: R$ ${amount.toFixed(2)} — ${description}`
  );

  return { success: true, movement };
}

export function closeCashRegister(
  countedBalance: number,
  discrepancyNote?: string
): { success: boolean; register?: CashRegister; error?: string } {
  const db = loadDatabase();
  if (!db.currentCashRegister || db.currentCashRegister.status !== 'open') {
    return { success: false, error: 'Não há caixa aberto para fechar.' };
  }

  const reg = db.currentCashRegister;
  const expected = reg.expectedBalance;
  const difference = countedBalance - expected;

  if (Math.abs(difference) > 0.01 && (!discrepancyNote || discrepancyNote.trim() === '')) {
    return {
      success: false,
      error: 'Existe uma diferença de valores! É obrigatório fornecer uma observação/justificativa.'
    };
  }

  reg.closedAt = new Date().toISOString();
  reg.countedBalance = countedBalance;
  reg.difference = difference;
  reg.discrepancyNote = discrepancyNote;
  reg.status = 'closed';

  // update in cashRegisters array
  const idx = db.cashRegisters.findIndex(c => c.id === reg.id);
  if (idx !== -1) {
    db.cashRegisters[idx] = reg;
  }

  db.currentCashRegister = null;
  saveDatabase(db);

  logAudit(
    'fechamento_caixa',
    'cash_register',
    reg.id,
    `Fechamento de caixa. Esperado: R$ ${expected.toFixed(2)}, Contado: R$ ${countedBalance.toFixed(2)}, Diferença: R$ ${difference.toFixed(2)}.`
  );

  return { success: true, register: reg };
}

// ----------------------------------------------------
// FINANCIAL & PROFIT (CMV & FLUXO DE CAIXA)
// ----------------------------------------------------
export function getFinancialTransactions(): FinancialTransaction[] {
  return loadDatabase().financialTransactions;
}

export function addFinancialTransaction(txData: Omit<FinancialTransaction, 'id'>): FinancialTransaction {
  const db = loadDatabase();
  const newTx: FinancialTransaction = {
    id: `ft-${Date.now()}`,
    ...txData
  };
  db.financialTransactions.unshift(newTx);
  saveDatabase(db);

  logAudit(
    'movimentacao_financeira',
    'financial_transaction',
    newTx.id,
    `${newTx.type === 'in' ? 'Receita' : 'Despesa'} de R$ ${newTx.amount.toFixed(2)} em "${newTx.category}": ${newTx.description}`
  );

  return newTx;
}

// ----------------------------------------------------
// DASHBOARD & MANAGEMENT METRICS
// ----------------------------------------------------
export function getDashboardMetrics() {
  const db = loadDatabase();
  const todayStr = new Date().toISOString().split('T')[0];
  const thisMonthStr = todayStr.substring(0, 7);

  // Revenue today & month
  let revenueToday = 0;
  let revenueMonth = 0;
  let salesCountToday = 0;
  let unitsSoldTotal = 0;
  let totalOrderRevenue = 0;
  let validOrdersCount = 0;

  // Track product sales ranking
  const productSalesMap = new Map<string, { name: string; quantity: number; revenue: number; image: string }>();

  for (const order of db.orders) {
    if (order.orderStatus === 'cancelado') continue;

    validOrdersCount++;
    totalOrderRevenue += order.total;

    const orderDate = order.createdAt.split('T')[0];
    if (orderDate === todayStr) {
      revenueToday += order.total;
      salesCountToday += 1;
    }
    if (orderDate.startsWith(thisMonthStr)) {
      revenueMonth += order.total;
    }

    for (const item of order.items) {
      unitsSoldTotal += item.quantity;
      const cur = productSalesMap.get(item.productId) || {
        name: item.productName,
        quantity: 0,
        revenue: 0,
        image: item.productImage
      };
      cur.quantity += item.quantity;
      cur.revenue += item.subtotal;
      productSalesMap.set(item.productId, cur);
    }
  }

  const averageTicket = validOrdersCount > 0 ? totalOrderRevenue / validOrdersCount : 0;

  // Stock alerts
  let lowStockCount = 0;
  let outOfStockCount = 0;
  const criticalVariants: Array<{
    productId: string;
    productName: string;
    variantId: string;
    size: string;
    color: string;
    stock: number;
    minStock: number;
  }> = [];

  for (const prod of db.products) {
    for (const v of prod.variants) {
      if (v.stock === 0) {
        outOfStockCount++;
        criticalVariants.push({
          productId: prod.id,
          productName: prod.name,
          variantId: v.id,
          size: v.size,
          color: v.color,
          stock: 0,
          minStock: v.minStock
        });
      } else if (v.stock <= v.minStock) {
        lowStockCount++;
        criticalVariants.push({
          productId: prod.id,
          productName: prod.name,
          variantId: v.id,
          size: v.size,
          color: v.color,
          stock: v.stock,
          minStock: v.minStock
        });
      }
    }
  }

  // Pending orders (in separation, awaiting shipment, pending payment)
  const pendingOrders = db.orders.filter(
    o => o.orderStatus === 'em_separacao' || o.orderStatus === 'pronto_envio' || o.orderStatus === 'aguardando_pagamento'
  );

  // Orders without tracking code that are awaiting shipping
  const missingTrackingOrders = db.orders.filter(
    o => o.deliveryType === 'shipping' && !o.shipment?.trackingCode && o.orderStatus !== 'entregue' && o.orderStatus !== 'cancelado'
  );

  // Top products ranking
  const topProducts = Array.from(productSalesMap.entries())
    .map(([id, val]) => ({ id, ...val }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Financial summary: Inflows vs Outflows & Estimated Gross Profit
  let totalInflow = 0;
  let totalOutflow = 0;
  for (const ft of db.financialTransactions) {
    if (ft.type === 'in') totalInflow += ft.amount;
    else totalOutflow += ft.amount;
  }

  // Estimated gross profit (CMV calculation: Total sold price minus product cost prices)
  let totalCostOfGoodsSold = 0;
  for (const order of db.orders) {
    if (order.orderStatus === 'cancelado') continue;
    for (const item of order.items) {
      totalCostOfGoodsSold += item.costPrice * item.quantity;
    }
  }
  const estimatedGrossProfit = totalOrderRevenue - totalCostOfGoodsSold;
  const grossMarginPercent = totalOrderRevenue > 0 ? (estimatedGrossProfit / totalOrderRevenue) * 100 : 0;

  // Daily revenue series (last 7 days)
  const last7Days: Array<{ date: string; label: string; revenue: number; sales: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;

    let dayRev = 0;
    let daySales = 0;
    for (const order of db.orders) {
      if (order.createdAt.startsWith(dateStr) && order.orderStatus !== 'cancelado') {
        dayRev += order.total;
        daySales += 1;
      }
    }
    last7Days.push({ date: dateStr, label: dayLabel, revenue: dayRev, sales: daySales });
  }

  return {
    kpis: {
      revenueToday,
      revenueMonth,
      salesCountToday,
      pendingOrdersCount: pendingOrders.length,
      unitsSoldTotal,
      averageTicket,
      lowStockCount,
      outOfStockCount,
      cashRegisterOpen: db.currentCashRegister?.status === 'open',
      cashRegisterBalance: db.currentCashRegister?.expectedBalance ?? 0
    },
    actionCenter: {
      pendingOrders,
      missingTrackingOrders,
      criticalVariants,
      pendingReturns: db.returns.filter(r => r.status === 'solicitada'),
      isCashOpen: db.currentCashRegister?.status === 'open'
    },
    topProducts,
    last7Days,
    financialSummary: {
      totalInflow,
      totalOutflow,
      balance: totalInflow - totalOutflow,
      totalOrderRevenue,
      totalCostOfGoodsSold,
      estimatedGrossProfit,
      grossMarginPercent
    }
  };
}

// ----------------------------------------------------
// CATEGORIES, BRANDS, SETTINGS, BANNERS, COUPONS, AUDIT
// ----------------------------------------------------
export function getCategories(): Category[] {
  return loadDatabase().categories;
}

export function saveCategory(category: Category): Category {
  const db = loadDatabase();
  const idx = db.categories.findIndex(c => c.id === category.id);
  if (idx !== -1) {
    db.categories[idx] = category;
  } else {
    db.categories.push(category);
  }
  saveDatabase(db);
  logAudit('salvar_categoria', 'category', category.id, `Categoria: ${category.name}`);
  return category;
}

export function getBrands(): Brand[] {
  return loadDatabase().brands;
}

export function saveBrand(brand: Brand): Brand {
  const db = loadDatabase();
  const idx = db.brands.findIndex(b => b.id === brand.id);
  if (idx !== -1) {
    db.brands[idx] = brand;
  } else {
    db.brands.push(brand);
  }
  saveDatabase(db);
  logAudit('salvar_marca', 'brand', brand.id, `Marca: ${brand.name}`);
  return brand;
}

export function getCustomers(): Customer[] {
  return loadDatabase().customers;
}

export function getCoupons(): Coupon[] {
  return loadDatabase().coupons;
}

export function saveCoupon(coupon: Coupon): Coupon {
  const db = loadDatabase();
  const idx = db.coupons.findIndex(c => c.id === coupon.id);
  if (idx !== -1) {
    db.coupons[idx] = coupon;
  } else {
    db.coupons.push(coupon);
  }
  saveDatabase(db);
  logAudit('salvar_cupom', 'coupon', coupon.id, `Cupom: ${coupon.code}`);
  return coupon;
}

export function getBanners(): Banner[] {
  return loadDatabase().banners;
}

export function saveBanner(banner: Banner): Banner {
  const db = loadDatabase();
  const idx = db.banners.findIndex(b => b.id === banner.id);
  if (idx !== -1) {
    db.banners[idx] = banner;
  } else {
    db.banners.push(banner);
  }
  saveDatabase(db);
  logAudit('salvar_banner', 'banner', banner.id, `Banner: ${banner.title}`);
  return banner;
}

export function getStoreSettings(): StoreSettings {
  return loadDatabase().settings;
}

export function updateStoreSettings(settings: StoreSettings): StoreSettings {
  const db = loadDatabase();
  db.settings = settings;
  saveDatabase(db);
  logAudit('atualizar_configuracoes', 'store_settings', 'settings', 'Atualizou configurações da loja e contatos');
  return settings;
}

export function getAuditLogs(): AuditLog[] {
  return loadDatabase().auditLogs;
}

export function getReturns(): ReturnRequest[] {
  return loadDatabase().returns;
}

export function updateReturnStatus(
  returnId: string,
  newStatus: ReturnRequest['status'],
  restock = false,
  notes?: string
): ReturnRequest | undefined {
  const db = loadDatabase();
  const ret = db.returns.find(r => r.id === returnId);
  if (!ret) return undefined;

  ret.status = newStatus;
  ret.notes = notes || ret.notes;
  ret.resolvedAt = new Date().toISOString();

  if (restock && (newStatus === 'aprovada' || newStatus === 'recebida')) {
    adjustVariantStock(
      ret.variantId,
      ret.quantity,
      'return',
      `Reintegração de devolução #${ret.orderNumber}`,
      { orderId: ret.orderId, userName: 'Controle de Devolução' }
    );
  }

  saveDatabase(db);
  logAudit('atualizar_devolucao', 'return_request', ret.id, `Status da devolução: ${newStatus}`);
  return ret;
}
