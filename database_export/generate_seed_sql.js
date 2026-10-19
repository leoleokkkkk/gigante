const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  return `'${String(val).replace(/'/g, "''")}'`;
}

let sql = `-- ============================================================================
-- GIGANTE'S MULTIMARCAS — DADOS COMPLETOS (SEED SQL)
-- Compatível com: PostgreSQL, SQLite3, MySQL / MariaDB
-- ============================================================================

`;

// 1. Categories
if (data.categories && data.categories.length) {
  sql += `-- 1. CATEGORIAS\n`;
  data.categories.forEach(c => {
    sql += `INSERT INTO categories (id, name, slug, description, image, item_count) VALUES (${esc(c.id)}, ${esc(c.name)}, ${esc(c.slug)}, ${esc(c.description)}, ${esc(c.image)}, ${esc(c.itemCount || 0)});\n`;
  });
  sql += `\n`;
}

// 2. Subcategories
const subcategories = [
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
sql += `-- 2. SUBCATEGORIAS\n`;
subcategories.forEach(s => {
  sql += `INSERT INTO subcategories (id, category_id, name, slug) VALUES (${esc(s.id)}, ${esc(s.categoryId)}, ${esc(s.name)}, ${esc(s.slug)});\n`;
});
sql += `\n`;

// 3. Brands
if (data.brands && data.brands.length) {
  sql += `-- 3. MARCAS\n`;
  data.brands.forEach(b => {
    sql += `INSERT INTO brands (id, name, slug, description, logo_url, active) VALUES (${esc(b.id)}, ${esc(b.name)}, ${esc(b.slug)}, ${esc(b.description)}, ${esc(b.logoUrl)}, ${esc(b.active)});\n`;
  });
  sql += `\n`;
}

// 4. Products, Variants & Images
if (data.products && data.products.length) {
  sql += `-- 4. PRODUTOS, IMAGENS E VARIANTES (GRADE)\n`;
  data.products.forEach(p => {
    sql += `INSERT INTO products (id, name, slug, description, short_description, category_id, subcategory_id, brand_id, base_sku, barcode, cost_price, selling_price, promo_price, weight_kg, height_cm, width_cm, length_cm, status, is_new, is_featured, is_best_seller, gender) VALUES (${esc(p.id)}, ${esc(p.name)}, ${esc(p.slug)}, ${esc(p.description)}, ${esc(p.shortDescription)}, ${esc(p.categoryId)}, ${esc(p.subcategoryId)}, ${esc(p.brandId)}, ${esc(p.baseSku)}, ${esc(p.barcode)}, ${esc(p.costPrice || 0)}, ${esc(p.sellingPrice || 0)}, ${esc(p.promoPrice)}, ${esc(p.weightKg || 0.8)}, ${esc(p.heightCm || 12)}, ${esc(p.widthCm || 20)}, ${esc(p.lengthCm || 30)}, ${esc(p.status || 'active')}, ${esc(p.isNew || false)}, ${esc(p.isFeatured || false)}, ${esc(p.isBestSeller || false)}, ${esc(p.gender || 'unissex')});\n`;

    if (p.images && p.images.length) {
      p.images.forEach((img, i) => {
        sql += `  INSERT INTO product_images (id, product_id, url, alt, is_primary, is_secondary, sort_order) VALUES (${esc(img.id || `${p.id}-img-${i+1}`)}, ${esc(p.id)}, ${esc(img.url)}, ${esc(img.alt || p.name)}, ${esc(img.isPrimary || false)}, ${esc(img.isSecondary || false)}, ${esc(img.sortOrder || i)});\n`;
      });
    }

    if (p.variants && p.variants.length) {
      p.variants.forEach(v => {
        const cost = v.costPrice ?? p.costPrice ?? 0;
        const selling = v.sellingPrice ?? p.sellingPrice ?? 0;
        const loc = v.location || 'Estoque Central';
        const bar = v.barcode || p.barcode || (v.sku ? '789' + v.sku.replace(/[^0-9]/g, '').padEnd(10, '0') : null);
        sql += `  INSERT INTO product_variants (id, product_id, sku, barcode, size, color, stock, min_stock, cost_price, selling_price, location) VALUES (${esc(v.id)}, ${esc(p.id)}, ${esc(v.sku)}, ${esc(bar)}, ${esc(v.size)}, ${esc(v.color || 'Padrão')}, ${esc(v.stock || 0)}, ${esc(v.minStock || 2)}, ${esc(cost)}, ${esc(selling)}, ${esc(loc)});\n`;
      });
    }
  });
  sql += `\n`;
}

// 5. Customers
if (data.customers && data.customers.length) {
  sql += `-- 5. CLIENTES (CRM)\n`;
  data.customers.forEach(c => {
    sql += `INSERT INTO customers (id, name, email, phone, document, total_orders, total_spent, notes) VALUES (${esc(c.id)}, ${esc(c.name)}, ${esc(c.email)}, ${esc(c.phone)}, ${esc(c.document)}, ${esc(c.totalOrders || 0)}, ${esc(c.totalSpent || 0)}, ${esc(c.notes)});\n`;
    if (c.address) {
      sql += `  INSERT INTO customer_addresses (id, customer_id, street, number, complement, neighborhood, city, state, zip_code, is_default) VALUES (${esc(c.id + '-addr')}, ${esc(c.id)}, ${esc(c.address.street)}, ${esc(c.address.number)}, ${esc(c.address.complement)}, ${esc(c.address.neighborhood)}, ${esc(c.address.city)}, ${esc(c.address.state)}, ${esc(c.address.zipCode)}, TRUE);\n`;
    }
  });
  sql += `\n`;
}

// 6. Cash Registers
if (data.cashRegisters && data.cashRegisters.length) {
  sql += `-- 6. SESSÕES DE CAIXA\n`;
  data.cashRegisters.forEach(cr => {
    const openedBy = cr.openedBy || cr.operatorName || 'Rodrigo Gigante (Proprietário)';
    const initBal = cr.initialBalance ?? cr.openingBalance ?? 0;
    const curBal = cr.currentBalance ?? cr.expectedBalance ?? 0;
    sql += `INSERT INTO cash_registers (id, opened_at, closed_at, opened_by, closed_by, initial_balance, current_balance, total_cash, total_credit_card, total_debit_card, total_pix, total_bleed, total_deposit, status, notes) VALUES (${esc(cr.id)}, ${esc(cr.openedAt)}, ${esc(cr.closedAt)}, ${esc(openedBy)}, ${esc(cr.closedBy)}, ${esc(initBal)}, ${esc(curBal)}, ${esc(cr.totalCash || 0)}, ${esc(cr.totalCreditCard || 0)}, ${esc(cr.totalDebitCard || 0)}, ${esc(cr.totalPix || 0)}, ${esc(cr.totalBleed || cr.totalOutflow || 0)}, ${esc(cr.totalDeposit || cr.totalInflow || 0)}, ${esc(cr.status || 'open')}, ${esc(cr.notes)});\n`;

    if (cr.movements && cr.movements.length) {
      cr.movements.forEach((mv, idx) => {
        sql += `  INSERT INTO cash_movements (id, cash_register_id, type, amount, reason, performed_by, created_at) VALUES (${esc(mv.id || `${cr.id}-mv-${idx+1}`)}, ${esc(cr.id)}, ${esc(mv.type)}, ${esc(mv.amount || 0)}, ${esc(mv.reason || mv.description || 'Movimentação')}, ${esc(mv.performedBy || openedBy)}, ${esc(mv.createdAt || mv.timestamp || cr.openedAt)});\n`;
      });
    }
  });
  sql += `\n`;
}

// 7. Orders & Items
if (data.orders && data.orders.length) {
  sql += `-- 7. PEDIDOS E ITENS\n`;
  data.orders.forEach(o => {
    const addr = o.shippingAddress || {};
    sql += `INSERT INTO orders (id, order_number, channel, customer_id, customer_name, customer_email, customer_phone, customer_document, shipping_street, shipping_number, shipping_complement, shipping_neighborhood, shipping_city, shipping_state, shipping_zip_code, subtotal, discount, shipping_cost, total, total_cost, profit, status, payment_method, payment_status, installments, pix_code, delivery_method, tracking_code, created_at) VALUES (${esc(o.id)}, ${esc(o.orderNumber)}, ${esc(o.channel || 'online')}, ${esc(o.customerId)}, ${esc(o.customer?.name || o.customerName || 'Cliente')}, ${esc(o.customer?.email || o.customerEmail || 'contato@cliente.com')}, ${esc(o.customer?.phone || o.customerPhone || '')}, ${esc(o.customer?.document || o.customerDocument || '')}, ${esc(addr.street)}, ${esc(addr.number)}, ${esc(addr.complement)}, ${esc(addr.neighborhood)}, ${esc(addr.city)}, ${esc(addr.state)}, ${esc(addr.zipCode)}, ${esc(o.subtotal || 0)}, ${esc(o.discount || 0)}, ${esc(o.shippingCost || 0)}, ${esc(o.total || 0)}, ${esc(o.totalCost || 0)}, ${esc(o.profit || 0)}, ${esc(o.status || 'pending')}, ${esc(o.paymentMethod || 'pix')}, ${esc(o.paymentStatus || 'pending')}, ${esc(o.installments || 1)}, ${esc(o.pixCode)}, ${esc(o.deliveryMethod || 'correios_pac')}, ${esc(o.trackingCode)}, ${esc(o.createdAt)});\n`;

    if (o.items && o.items.length) {
      o.items.forEach(it => {
        sql += `  INSERT INTO order_items (id, order_id, product_id, variant_id, product_name, size, color, sku, barcode, image_url, unit_cost, unit_price, quantity, total_cost, total_price) VALUES (${esc(it.id || o.id + '-' + it.variantId)}, ${esc(o.id)}, ${esc(it.productId)}, ${esc(it.variantId)}, ${esc(it.productName || it.name)}, ${esc(it.size)}, ${esc(it.color || 'Padrão')}, ${esc(it.sku || '')}, ${esc(it.barcode || '')}, ${esc(it.imageUrl)}, ${esc(it.unitCost || 0)}, ${esc(it.unitPrice || it.price || 0)}, ${esc(it.quantity || 1)}, ${esc((it.unitCost || 0) * (it.quantity || 1))}, ${esc((it.unitPrice || it.price || 0) * (it.quantity || 1))});\n`;
      });
    }
  });
  sql += `\n`;
}

// 8. Financial Transactions
if (data.financialTransactions && data.financialTransactions.length) {
  sql += `-- 8. TRANSAÇÕES FINANCEIRAS\n`;
  data.financialTransactions.forEach(ft => {
    sql += `INSERT INTO financial_transactions (id, description, type, category, amount, status, payment_method, due_date, paid_at, order_id, cash_register_id, notes, created_at) VALUES (${esc(ft.id)}, ${esc(ft.description)}, ${esc(ft.type)}, ${esc(ft.category)}, ${esc(ft.amount || 0)}, ${esc(ft.status || 'paid')}, ${esc(ft.paymentMethod)}, ${esc(ft.dueDate)}, ${esc(ft.paidAt)}, ${esc(ft.orderId)}, ${esc(ft.cashRegisterId)}, ${esc(ft.notes)}, ${esc(ft.createdAt)});\n`;
  });
  sql += `\n`;
}

// 9. Coupons
if (data.coupons && data.coupons.length) {
  sql += `-- 9. CUPONS DE DESCONTO\n`;
  data.coupons.forEach(cp => {
    sql += `INSERT INTO coupons (id, code, type, value, min_order_value, max_discount, usage_limit, usage_count, valid_from, valid_until, active) VALUES (${esc(cp.id)}, ${esc(cp.code)}, ${esc(cp.type || 'percentage')}, ${esc(cp.value || 0)}, ${esc(cp.minOrderValue || 0)}, ${esc(cp.maxDiscount)}, ${esc(cp.usageLimit)}, ${esc(cp.usageCount || 0)}, ${esc(cp.validFrom)}, ${esc(cp.validUntil)}, ${esc(cp.active !== false)});\n`;
  });
  sql += `\n`;
}

// 10. Banners
if (data.banners && data.banners.length) {
  sql += `-- 10. BANNERS\n`;
  data.banners.forEach(bn => {
    sql += `INSERT INTO banners (id, title, subtitle, badge_text, image_url, cta_text, cta_link, sort_order, active) VALUES (${esc(bn.id)}, ${esc(bn.title)}, ${esc(bn.subtitle)}, ${esc(bn.badgeText)}, ${esc(bn.imageUrl)}, ${esc(bn.ctaText)}, ${esc(bn.ctaLink)}, ${esc(bn.sortOrder || 0)}, ${esc(bn.active !== false)});\n`;
  });
  sql += `\n`;
}

// 11. Settings
if (data.settings) {
  const s = data.settings;
  sql += `-- 11. CONFIGURAÇÕES DA LOJA\n`;
  sql += `INSERT INTO store_settings (id, store_name, trading_name, cnpj, email, phone, whatsapp, address_street, address_number, address_complement, address_neighborhood, address_city, address_state, address_zip, pix_key, pix_key_type, free_shipping_min_amount) VALUES ('store-default', ${esc(s.storeName)}, ${esc(s.tradingName)}, ${esc(s.cnpj)}, ${esc(s.email)}, ${esc(s.phone)}, ${esc(s.whatsapp)}, ${esc(s.addressStreet)}, ${esc(s.addressNumber)}, ${esc(s.addressComplement)}, ${esc(s.addressNeighborhood)}, ${esc(s.addressCity)}, ${esc(s.addressState)}, ${esc(s.addressZip)}, ${esc(s.pixKey)}, ${esc(s.pixKeyType)}, ${esc(s.freeShippingMinAmount || 299)});\n\n`;
}

// 12. Audit Logs
if (data.auditLogs && data.auditLogs.length) {
  sql += `-- 12. TRILHA DE AUDITORIA\n`;
  data.auditLogs.forEach(al => {
    sql += `INSERT INTO audit_logs (id, action, entity_type, entity_id, user_name, user_role, details, created_at) VALUES (${esc(al.id)}, ${esc(al.action)}, ${esc(al.entityType || al.entity || "general")}, ${esc(al.entityId)}, ${esc(al.userName)}, ${esc(al.userRole || al.role || "admin")}, ${esc(typeof al.details === 'object' ? JSON.stringify(al.details) : al.details)}, ${esc(al.createdAt || al.timestamp || "2026-10-15T00:00:00Z")});\n`;
  });
  sql += `\n`;
}

fs.writeFileSync(path.join(__dirname, 'seed.sql'), sql, 'utf8');
console.log('Seed SQL generated successfully! Bytes:', sql.length);
