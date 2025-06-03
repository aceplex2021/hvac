-- HVAC Service Provider SQL Schema
-- All tables use the prefix hvac_*
-- Schema covers all business, customer, booking, service, inventory, communication, notification, and financial features

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Businesses
CREATE TABLE hvac_businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'US',
    timezone TEXT DEFAULT 'UTC',
    business_hours JSONB,
    service_areas JSONB,
    payment_methods TEXT[],
    default_service_duration TEXT,
    buffer_time_minutes INTEGER,
    max_daily_appointments INTEGER,
    cancellation_policy TEXT,
    tax_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients (move up for FK dependencies)
CREATE TABLE hvac_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac_businesses(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'US',
    preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'text')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Technicians (move up for FK dependencies)
CREATE TABLE hvac_technicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac_businesses(id) ON DELETE CASCADE NOT NULL,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    skills TEXT[],
    certifications TEXT[],
    hourly_rate DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    availability JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Categories
CREATE TABLE hvac_service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac_businesses(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE hvac_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac_businesses(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES hvac_service_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    requires_equipment BOOLEAN DEFAULT false,
    equipment_requirements TEXT[],
    prerequisites TEXT[],
    warranty_days INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment Types
CREATE TABLE hvac_equipment_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac_businesses(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    manufacturer TEXT,
    model_number TEXT,
    specifications JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client Equipment
CREATE TABLE hvac_client_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES hvac_clients(id) ON DELETE CASCADE NOT NULL,
    equipment_type_id UUID REFERENCES hvac_equipment_types(id) ON DELETE SET NULL,
    serial_number TEXT,
    installation_date DATE,
    last_service_date DATE,
    warranty_expiry DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE hvac_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac_businesses(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES hvac_services(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES hvac_clients(id) ON DELETE CASCADE NOT NULL,
    client_equipment_id UUID REFERENCES hvac_client_equipment(id) ON DELETE SET NULL,
    scheduled_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
    notes TEXT,
    special_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work Orders
CREATE TABLE hvac_work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES hvac_bookings(id) ON DELETE CASCADE,
    business_id UUID REFERENCES hvac_businesses(id) ON DELETE CASCADE NOT NULL,
    technician_id UUID REFERENCES hvac_technicians(id) ON DELETE CASCADE,
    client_id UUID REFERENCES hvac_clients(id) ON DELETE CASCADE NOT NULL,
    client_equipment_id UUID REFERENCES hvac_client_equipment(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
    type TEXT NOT NULL CHECK (type IN ('installation', 'repair', 'maintenance')),
    description TEXT NOT NULL,
    diagnosis TEXT,
    solution TEXT,
    notes TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    labor_hours DECIMAL(5,2),
    labor_rate DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    payment_status TEXT CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
    warranty_covered BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work Order Photos
CREATE TABLE hvac_work_order_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID REFERENCES hvac_work_orders(id) ON DELETE CASCADE NOT NULL,
    photo_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work Order Signatures
CREATE TABLE hvac_work_order_signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID REFERENCES hvac_work_orders(id) ON DELETE CASCADE NOT NULL,
    client_signature TEXT,
    technician_signature TEXT,
    signed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Technician Schedules
CREATE TABLE hvac_technician_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technician_id UUID REFERENCES hvac_technicians(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT CHECK (status IN ('available', 'unavailable', 'on_leave')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Categories
CREATE TABLE hvac_inventory_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac_businesses(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Items
CREATE TABLE hvac_inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac_businesses(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES hvac_inventory_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT,
    manufacturer TEXT,
    model_number TEXT,
    quantity DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    min_quantity DECIMAL(10,2),
    location TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Movements
CREATE TABLE hvac_inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_item_id UUID REFERENCES hvac_inventory_items(id) ON DELETE CASCADE NOT NULL,
    work_order_id UUID REFERENCES hvac_work_orders(id) ON DELETE CASCADE,
    movement_type TEXT CHECK (movement_type IN ('in', 'out', 'adjustment')),
    quantity DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Material Usage
CREATE TABLE hvac_material_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID REFERENCES hvac_work_orders(id) ON DELETE CASCADE NOT NULL,
    inventory_item_id UUID REFERENCES hvac_inventory_items(id) ON DELETE CASCADE NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE hvac_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac_businesses(id) ON DELETE CASCADE NOT NULL,
    work_order_id UUID REFERENCES hvac_work_orders(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES hvac_clients(id) ON DELETE CASCADE NOT NULL,
    invoice_number TEXT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'refunded')),
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0.00,
    payment_method TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice Items
CREATE TABLE hvac_invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES hvac_invoices(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Refunds
CREATE TABLE hvac_refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac_businesses(id) ON DELETE CASCADE NOT NULL,
    invoice_id UUID REFERENCES hvac_invoices(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'rejected')) NOT NULL,
    notes TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communications (email, sms, phone, etc.)
CREATE TABLE hvac_communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac_businesses(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES hvac_clients(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'phone', 'chat', 'system')),
    subject TEXT,
    content TEXT NOT NULL,
    status TEXT CHECK (status IN ('sent', 'received', 'failed', 'read')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents (attachments for communications, work orders, etc.)
CREATE TABLE hvac_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    communication_id UUID REFERENCES hvac_communications(id) ON DELETE CASCADE,
    work_order_id UUID REFERENCES hvac_work_orders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (chat between customer and provider)
CREATE TABLE hvac_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac_businesses(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification Settings (per business)
CREATE TABLE hvac_notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac_businesses(id) ON DELETE CASCADE NOT NULL,
    email_notifications JSONB,
    sms_notifications JSONB,
    push_notifications JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications (sent to users)
CREATE TABLE hvac_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac_businesses(id) ON DELETE CASCADE NOT NULL,
    booking_id UUID REFERENCES hvac_bookings(id) ON DELETE CASCADE,
    user_id UUID,
    type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'push', 'system')),
    status TEXT CHECK (status IN ('sent', 'delivered', 'failed', 'read')),
    recipient TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
); 