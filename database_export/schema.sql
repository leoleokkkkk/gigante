-- ============================================================================
-- GIGANTE'S MULTIMARCAS — ESQUEMA COMPLETO DE BANCO DE DADOS RELACIONAL (DDL)
-- Compatível com: PostgreSQL (12+), SQLite (3.30+), MySQL (8.0+) / MariaDB
-- ============================================================================

-- 1. CATEGORIAS DE PRODUTOS
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    item_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. SUBCATEGORIAS
CREATE TABLE IF NOT EXISTS subcategories (
    id VARCHAR(64) PRIMARY KEY,
    category_id VARCHAR(64) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. MARCAS PARCEIRAS
CREATE TABLE IF NOT EXISTS brands (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. PRODUTOS (CATÁLOGO MESTRE)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description TEXT,
    category_id VARCHAR(64) NOT NULL REFERENCES categories(id),
    subcategory_id VARCHAR(64) REFERENCES subcategories(id),
    brand_id VARCHAR(64) NOT NULL REFERENCES brands(id),
    base_sku VARCHAR(64) NOT NULL UNIQUE,
    barcode VARCHAR(64),
    cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    promo_price DECIMAL(10, 2),
    weight_kg DECIMAL(8, 3) DEFAULT 0.800,
    height_cm INT DEFAULT 12,
    width_cm INT DEFAULT 20,
    length_cm INT DEFAULT 30,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    is_new BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    gender VARCHAR(20) DEFAULT 'unissex',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. IMAGENS DOS PRODUTOS
CREATE TABLE IF NOT EXISTS product_images (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    is_secondary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0
);

-- 6. GRADE DE VARIAÇÕES (ESTOQUE POR TAMANHO / COR / SKU)
CREATE TABLE IF NOT EXISTS product_variants (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(64) NOT NULL UNIQUE,
    barcode VARCHAR(64),
    size VARCHAR(20) NOT NULL,
    color VARCHAR(60) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 2,
    cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    location VARCHAR(60) DEFAULT 'Prateleira A1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. CLIENTES (CRM)
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    document VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0.00,
    notes TEXT
);

-- 8. ENDEREÇOS DOS CLIENTES
CREATE TABLE IF NOT EXISTS customer_addresses (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(30) NOT NULL,
    complement VARCHAR(100),
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(10) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT TRUE
);

-- 9. SESSÕES DE CAIXA (PDV / FRENTE DE CAIXA)
CREATE TABLE IF NOT EXISTS cash_registers (
    id VARCHAR(64) PRIMARY KEY,
    opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    opened_by VARCHAR(120) NOT NULL,
    closed_by VARCHAR(120),
    initial_balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    current_balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_cash DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_credit_card DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_debit_card DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_pix DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_bleed DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_deposit DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    notes TEXT
);

-- 10. MOVIMENTAÇÕES DE CAIXA (SANGRIA / SUPRIMENTO)
CREATE TABLE IF NOT EXISTS cash_movements (
    id VARCHAR(64) PRIMARY KEY,
    cash_register_id VARCHAR(64) NOT NULL REFERENCES cash_registers(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    reason TEXT NOT NULL,
    performed_by VARCHAR(120) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. PEDIDOS E VENDAS
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(64) NOT NULL UNIQUE,
    channel VARCHAR(30) NOT NULL DEFAULT 'online',
    customer_id VARCHAR(64) REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    customer_document VARCHAR(30),
    shipping_street VARCHAR(255),
    shipping_number VARCHAR(30),
    shipping_complement VARCHAR(100),
    shipping_neighborhood VARCHAR(100),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(10),
    shipping_zip_code VARCHAR(20),
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    profit DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(40) NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(40) NOT NULL,
    payment_status VARCHAR(40) NOT NULL DEFAULT 'pending',
    installments INT DEFAULT 1,
    pix_code TEXT,
    pix_qr_code_url TEXT,
    delivery_method VARCHAR(40) NOT NULL DEFAULT 'correios_pac',
    tracking_code VARCHAR(60),
    estimated_delivery_date DATE,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cash_register_id VARCHAR(64) REFERENCES cash_registers(id),
    coupon_code VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. ITENS DO PEDIDO
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id),
    variant_id VARCHAR(64) NOT NULL REFERENCES product_variants(id),
    product_name VARCHAR(255) NOT NULL,
    size VARCHAR(20) NOT NULL,
    color VARCHAR(60) NOT NULL,
    sku VARCHAR(64) NOT NULL,
    barcode VARCHAR(64),
    image_url TEXT,
    unit_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    quantity INT NOT NULL DEFAULT 1,
    total_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

-- 13. HISTÓRICO DE RASTREAMENTO / EXPEDIÇÃO
CREATE TABLE IF NOT EXISTS order_tracking_events (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(120),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. MOVIMENTAÇÃO DE ESTOQUE (KARDEX)
CREATE TABLE IF NOT EXISTS inventory_movements (
    id VARCHAR(64) PRIMARY KEY,
    variant_id VARCHAR(64) NOT NULL REFERENCES product_variants(id),
    product_id VARCHAR(64) NOT NULL REFERENCES products(id),
    type VARCHAR(30) NOT NULL,
    quantity INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    unit_cost DECIMAL(10, 2),
    reason TEXT,
    order_id VARCHAR(64),
    created_by VARCHAR(120) NOT NULL DEFAULT 'Sistema',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. TRANSAÇÕES FINANCEIRAS (FLUXO DE CAIXA & DRE)
CREATE TABLE IF NOT EXISTS financial_transactions (
    id VARCHAR(64) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL,
    category VARCHAR(60) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'paid',
    payment_method VARCHAR(40),
    due_date DATE,
    paid_at TIMESTAMP,
    order_id VARCHAR(64) REFERENCES orders(id),
    cash_register_id VARCHAR(64) REFERENCES cash_registers(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. DEVOLUÇÕES & LOGÍSTICA REVERSA
CREATE TABLE IF NOT EXISTS returns (
    id VARCHAR(64) PRIMARY KEY,
    return_code VARCHAR(64) NOT NULL UNIQUE,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id),
    customer_id VARCHAR(64) REFERENCES customers(id),
    type VARCHAR(30) NOT NULL DEFAULT 'exchange',
    reason TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'requested',
    reverse_tracking_code VARCHAR(60),
    action_taken TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. CUPONS DE DESCONTO
CREATE TABLE IF NOT EXISTS coupons (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL DEFAULT 'percentage',
    value DECIMAL(10, 2) NOT NULL,
    min_order_value DECIMAL(10, 2) DEFAULT 0.00,
    max_discount DECIMAL(10, 2),
    usage_limit INT,
    usage_count INT DEFAULT 0,
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. BANNERS PUBLICITÁRIOS DA HOME
CREATE TABLE IF NOT EXISTS banners (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    badge_text VARCHAR(100),
    image_url TEXT NOT NULL,
    mobile_image_url TEXT,
    cta_text VARCHAR(60),
    cta_link VARCHAR(255),
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. CONFIGURAÇÕES DA LOJA & DADOS DA EMPRESA
CREATE TABLE IF NOT EXISTS store_settings (
    id VARCHAR(64) PRIMARY KEY,
    store_name VARCHAR(255) NOT NULL DEFAULT 'Gigante''s Multimarcas',
    trading_name VARCHAR(255) DEFAULT 'Gigante Multimarcas Comércio de Calçados LTDA',
    cnpj VARCHAR(30) DEFAULT '45.892.103/0001-88',
    ie VARCHAR(30),
    email VARCHAR(255) DEFAULT 'contato@gigantemultimarcas.com.br',
    phone VARCHAR(30) DEFAULT '(11) 98765-4321',
    whatsapp VARCHAR(30) DEFAULT '5511987654321',
    address_street VARCHAR(255) DEFAULT 'Av. Paulista',
    address_number VARCHAR(30) DEFAULT '1578',
    address_complement VARCHAR(100) DEFAULT 'Loja 12',
    address_neighborhood VARCHAR(100) DEFAULT 'Bela Vista',
    address_city VARCHAR(100) DEFAULT 'São Paulo',
    address_state VARCHAR(10) DEFAULT 'SP',
    address_zip VARCHAR(20) DEFAULT '01310-200',
    pix_key VARCHAR(100) DEFAULT '45892103000188',
    pix_key_type VARCHAR(30) DEFAULT 'cnpj',
    free_shipping_min_amount DECIMAL(10, 2) DEFAULT 299.00,
    correios_origin_zip VARCHAR(20) DEFAULT '01310-200',
    allow_pickup BOOLEAN DEFAULT TRUE,
    pickup_time_minutes INT DEFAULT 120,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 20. TRILHA DE AUDITORIA
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(60) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    user_name VARCHAR(120) NOT NULL,
    user_role VARCHAR(60) NOT NULL DEFAULT 'admin',
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_variants_barcode ON product_variants(barcode);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_inventory_variant ON inventory_movements(variant_id);
CREATE INDEX IF NOT EXISTS idx_financial_type ON financial_transactions(type);
