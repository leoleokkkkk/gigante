export type Role = 'customer' | 'owner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount?: number;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  active: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  isSecondary: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  model?: string;
  sku: string;
  barcode?: string;
  stock: number;
  minStock: number;
  priceOverride?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  subcategoryId?: string;
  brandId: string;
  baseSku: string;
  barcode?: string;
  costPrice: number;
  sellingPrice: number;
  promoPrice?: number;
  weightKg: number;
  heightCm: number;
  widthCm: number;
  lengthCm: number;
  status: 'active' | 'archived' | 'draft';
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  gender: 'masculino' | 'feminino' | 'unissex' | 'infantil';
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export type InventoryMovementType = 
  | 'purchase' 
  | 'sale' 
  | 'restock' 
  | 'adjustment' 
  | 'return' 
  | 'cancellation';

export interface InventoryMovement {
  id: string;
  variantId: string;
  productId: string;
  productName: string;
  variantDesc: string;
  type: InventoryMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  orderId?: string;
  saleId?: string;
  userId?: string;
  userName?: string;
  createdAt: string;
}

export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type OrderStatus =
  | 'aguardando_pagamento'
  | 'pago'
  | 'em_separacao'
  | 'pronto_envio'
  | 'enviado'
  | 'em_transito'
  | 'saiu_entrega'
  | 'entregue'
  | 'pronto_retirada'
  | 'retirado'
  | 'cancelado'
  | 'devolvido';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  brandName: string;
  productImage: string;
  size: string;
  color: string;
  sku: string;
  unitPrice: number;
  costPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  carrier: string;
  trackingCode?: string;
  serviceName: string;
  weightKg: number;
  heightCm: number;
  widthCm: number;
  lengthCm: number;
  declaredValue: number;
  status: 'pending' | 'shipped' | 'delivered' | 'returned';
  notes?: string;
  labelGeneratedAt?: string;
}

export interface OrderAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerCpf: string;
  customerEmail: string;
  customerPhone: string;
  deliveryType: 'shipping' | 'pickup';
  shippingAddress?: OrderAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  couponCode?: string;
  notes?: string;
  shipment?: Shipment;
  timeline: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CashMovement {
  id: string;
  registerId: string;
  type: 'in' | 'out';
  category: 'sale_physical' | 'sale_online' | 'supply' | 'bleeding' | 'expense' | 'other';
  paymentMethod: PaymentMethod;
  amount: number;
  description: string;
  orderId?: string;
  saleId?: string;
  timestamp: string;
}

export interface CashRegister {
  id: string;
  openedAt: string;
  closedAt?: string;
  operatorId: string;
  operatorName: string;
  openingBalance: number;
  totalInflow: number;
  totalOutflow: number;
  expectedBalance: number;
  countedBalance?: number;
  difference?: number;
  discrepancyNote?: string;
  status: 'open' | 'closed';
  movements: CashMovement[];
}

export interface FinancialTransaction {
  id: string;
  type: 'in' | 'out';
  category:
    | 'venda'
    | 'fornecedor'
    | 'aluguel'
    | 'energia'
    | 'internet'
    | 'funcionario'
    | 'compra_estoque'
    | 'transporte'
    | 'marketing'
    | 'taxas'
    | 'outros';
  amount: number;
  paymentMethod: string;
  date: string;
  description: string;
  observation?: string;
  referenceId?: string;
  referenceType?: 'order' | 'cash_movement' | 'manual';
}

export interface Customer {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  addresses: OrderAddress[];
  createdAt: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  productId: string;
  variantId: string;
  productName: string;
  variantDesc: string;
  quantity: number;
  reason: string;
  condition: 'novo_com_etiqueta' | 'usado' | 'danificado' | 'defeito_fabricacao';
  refundAmount: number;
  status: 'solicitada' | 'aprovada' | 'recebida' | 'reembolsada' | 'recusada';
  requestedAt: string;
  resolvedAt?: string;
  notes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrderValue: number;
  maxUses: number;
  currentUses: number;
  expiresAt?: string;
  active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  mobileImageUrl?: string;
  badgeText?: string;
  order: number;
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  cnpj: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
    mapsUrl: string;
  };
  openingHours: string;
  socialLinks: {
    instagram: string;
    whatsapp: string;
    facebook: string;
    tiktok: string;
  };
  shippingConfig: {
    freeShippingThreshold: number;
    defaultPacPrice: number;
    defaultSedexPrice: number;
    pickupInstructions: string;
  };
  paymentConfig: {
    pixDiscountPercent: number;
    maxInstallments: number;
    minInstallmentValue: number;
  };
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
}
