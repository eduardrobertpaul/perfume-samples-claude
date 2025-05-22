-- Perfume Samples Database Schema
-- PostgreSQL Schema for Bucharest Perfume Samples Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table (fragrances)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    description TEXT,
    ai_generated_description TEXT,
    
    -- Fragrance notes
    top_notes TEXT[],
    middle_notes TEXT[],
    base_notes TEXT[],
    
    -- Pricing for different sizes
    price_2ml DECIMAL(8,2),
    price_5ml DECIMAL(8,2),
    price_10ml DECIMAL(8,2),
    
    -- Stock and availability
    in_stock BOOLEAN DEFAULT true,
    bottle_size_owned INTEGER, -- ml of the bottle we own
    
    -- SEO and display
    slug VARCHAR(255) UNIQUE,
    image_url VARCHAR(500),
    category VARCHAR(50), -- designer, niche, fresh, oriental
    gender VARCHAR(20), -- unisex, masculine, feminine
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory tracking
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    
    -- Volume tracking
    bottle_size_ml INTEGER NOT NULL,
    total_volume DECIMAL(8,2) NOT NULL, -- total ml we have
    used_volume DECIMAL(8,2) DEFAULT 0, -- ml already used
    remaining_volume DECIMAL(8,2) GENERATED ALWAYS AS (total_volume - used_volume) STORED,
    
    -- Cost tracking
    cost_per_ml DECIMAL(8,4), -- how much we paid per ml
    purchase_date DATE,
    supplier VARCHAR(100),
    
    -- Alerts
    low_stock_threshold DECIMAL(8,2) DEFAULT 10, -- alert when below this
    low_stock_alert BOOLEAN GENERATED ALWAYS AS (remaining_volume <= low_stock_threshold) STORED,
    
    -- Metadata
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL, -- human-readable order number
    
    -- Customer info
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    customer_name VARCHAR(100),
    
    -- Shipping
    shipping_address_line1 VARCHAR(255) NOT NULL,
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100) NOT NULL DEFAULT 'Bucharest',
    shipping_postal_code VARCHAR(20),
    shipping_country VARCHAR(50) DEFAULT 'Romania',
    
    -- Order details
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(8,2) DEFAULT 0,
    tax_amount DECIMAL(8,2) DEFAULT 0,
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
    payment_method VARCHAR(20), -- stripe, cash_on_delivery
    stripe_payment_intent_id VARCHAR(255),
    
    -- Delivery
    delivery_type VARCHAR(20) DEFAULT 'standard', -- standard, same_day
    delivery_date DATE,
    tracking_number VARCHAR(100),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Order items (individual samples in each order)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    
    -- Item details
    size_ml INTEGER NOT NULL, -- 2, 5, or 10
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(8,2) NOT NULL,
    total_price DECIMAL(8,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    
    -- Custom options
    custom_notes TEXT,
    gift_message TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Discovery sets (curated collections)
CREATE TABLE discovery_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    theme VARCHAR(100), -- summer, winter, niche, designer
    
    price DECIMAL(8,2) NOT NULL,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products included in discovery sets
CREATE TABLE discovery_set_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discovery_set_id UUID REFERENCES discovery_sets(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    size_ml INTEGER NOT NULL DEFAULT 2,
    
    UNIQUE(discovery_set_id, product_id)
);

-- Customer reviews (for future use)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id), -- to verify purchase
    
    customer_email VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    
    is_verified BOOLEAN DEFAULT false, -- verified purchase
    is_published BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics and tracking
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL, -- page_view, product_view, add_to_cart, purchase
    product_id UUID REFERENCES products(id),
    order_id UUID REFERENCES orders(id),
    
    -- Event data
    customer_email VARCHAR(255),
    session_id VARCHAR(255),
    user_agent TEXT,
    ip_address INET,
    
    -- Additional data (JSON)
    event_data JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_in_stock ON products(in_stock);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_order_number ON orders(order_number);

CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_inventory_low_stock ON inventory(low_stock_alert);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_published ON reviews(is_published);

CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);

-- Functions for automatic order number generation
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'PS' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || LPAD(EXTRACT(EPOCH FROM NOW())::INTEGER % 10000, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order numbers
CREATE TRIGGER trigger_generate_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- Function to update inventory when order items are created
CREATE OR REPLACE FUNCTION update_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE inventory 
    SET used_volume = used_volume + (NEW.size_ml * NEW.quantity),
        last_updated = CURRENT_TIMESTAMP
    WHERE product_id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update inventory when samples are ordered
CREATE TRIGGER trigger_update_inventory
    AFTER INSERT ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_on_order();

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_discovery_sets_updated_at
    BEFORE UPDATE ON discovery_sets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing
INSERT INTO products (name, brand, description, top_notes, middle_notes, base_notes, price_2ml, price_5ml, price_10ml, category, gender, slug) VALUES
('Bleu de Chanel', 'Chanel', 'A fresh and modern fragrance with citrus and woody notes', ARRAY['Lemon', 'Bergamot', 'Mint'], ARRAY['Jasmine', 'Melon', 'Nutmeg'], ARRAY['Cedar', 'Sandalwood', 'Vetiver'], 12.00, 25.00, 40.00, 'designer', 'masculine', 'bleu-de-chanel'),
('Black Opium', 'Yves Saint Laurent', 'A modern interpretation of oriental fragrance', ARRAY['Pear', 'Pink Pepper', 'Orange Blossom'], ARRAY['Coffee', 'Jasmine', 'Bitter Almond'], ARRAY['Vanilla', 'Patchouli', 'Cedar'], 10.00, 22.00, 35.00, 'designer', 'feminine', 'black-opium'),
('Aventus', 'Creed', 'A sophisticated blend of fruit and smoke', ARRAY['Blackcurrant', 'Apple', 'Pineapple', 'Bergamot'], ARRAY['Jasmine', 'Rose', 'Patchouli'], ARRAY['Musk', 'Oak Moss', 'Ambergris'], 18.00, 45.00, 80.00, 'niche', 'masculine', 'aventus'),
('Light Blue', 'Dolce & Gabbana', 'A fresh Mediterranean fragrance', ARRAY['Lemon', 'Apple', 'Cedar'], ARRAY['Bamboo', 'Jasmine', 'White Rose'], ARRAY['Cedar', 'Musk', 'Amber'], 9.00, 20.00, 32.00, 'designer', 'feminine', 'light-blue'),
('Tom Ford Oud Wood', 'Tom Ford', 'A smooth and creamy oud fragrance', ARRAY['Rosewood', 'Cardamom', 'Chinese Pepper'], ARRAY['Oud', 'Sandalwood', 'Palisander Rosewood'], ARRAY['Vanilla', 'Amber', 'Tonka Bean'], 25.00, 55.00, 95.00, 'niche', 'unisex', 'tom-ford-oud-wood');

-- Insert sample inventory
INSERT INTO inventory (product_id, bottle_size_ml, total_volume, cost_per_ml, purchase_date, supplier) 
SELECT id, 100, 100.00, 0.80, CURRENT_DATE, 'FragranceX' FROM products WHERE slug = 'bleu-de-chanel';

INSERT INTO inventory (product_id, bottle_size_ml, total_volume, cost_per_ml, purchase_date, supplier) 
SELECT id, 90, 90.00, 0.70, CURRENT_DATE, 'FragranceX' FROM products WHERE slug = 'black-opium';

INSERT INTO inventory (product_id, bottle_size_ml, total_volume, cost_per_ml, purchase_date, supplier) 
SELECT id, 120, 120.00, 2.50, CURRENT_DATE, 'Creed Boutique' FROM products WHERE slug = 'aventus';

INSERT INTO inventory (product_id, bottle_size_ml, total_volume, cost_per_ml, purchase_date, supplier) 
SELECT id, 100, 100.00, 0.65, CURRENT_DATE, 'FragranceX' FROM products WHERE slug = 'light-blue';

INSERT INTO inventory (product_id, bottle_size_ml, total_volume, cost_per_ml, purchase_date, supplier) 
SELECT id, 50, 50.00, 4.20, CURRENT_DATE, 'Tom Ford Boutique' FROM products WHERE slug = 'tom-ford-oud-wood';