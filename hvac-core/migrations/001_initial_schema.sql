-- Create HVAC schema
CREATE SCHEMA IF NOT EXISTS hvac;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Business table
CREATE TABLE hvac.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) NOT NULL,
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
    tax_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service categories table
CREATE TABLE hvac.service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac.businesses(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE hvac.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac.businesses(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES hvac.service_categories(id) ON DELETE SET NULL,
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

-- Equipment types table
CREATE TABLE hvac.equipment_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac.businesses(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    manufacturer TEXT,
    model_number TEXT,
    specifications JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client equipment table
CREATE TABLE hvac.client_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES hvac.clients(id) ON DELETE CASCADE NOT NULL,
    equipment_type_id UUID REFERENCES hvac.equipment_types(id) ON DELETE SET NULL,
    serial_number TEXT,
    installation_date DATE,
    last_service_date DATE,
    warranty_expiry DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE hvac.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac.businesses(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES hvac.services(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES hvac.clients(id) ON DELETE CASCADE NOT NULL,
    client_equipment_id UUID REFERENCES hvac.client_equipment(id) ON DELETE SET NULL,
    scheduled_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
    notes TEXT,
    special_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work orders table
CREATE TABLE hvac.work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES hvac.bookings(id) ON DELETE CASCADE,
    business_id UUID REFERENCES hvac.businesses(id) ON DELETE CASCADE NOT NULL,
    technician_id UUID REFERENCES hvac.technicians(id) ON DELETE CASCADE,
    client_id UUID REFERENCES hvac.clients(id) ON DELETE CASCADE NOT NULL,
    client_equipment_id UUID REFERENCES hvac.client_equipment(id) ON DELETE SET NULL,
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

-- Work order photos table
CREATE TABLE hvac.work_order_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID REFERENCES hvac.work_orders(id) ON DELETE CASCADE NOT NULL,
    photo_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work order signatures table
CREATE TABLE hvac.work_order_signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID REFERENCES hvac.work_orders(id) ON DELETE CASCADE NOT NULL,
    client_signature TEXT,
    technician_signature TEXT,
    signed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Technicians table
CREATE TABLE hvac.technicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac.businesses(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
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

-- Technician schedules table
CREATE TABLE hvac.technician_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technician_id UUID REFERENCES hvac.technicians(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT CHECK (status IN ('available', 'unavailable', 'on_leave')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE hvac.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac.businesses(id) ON DELETE CASCADE NOT NULL,
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

-- Inventory categories table
CREATE TABLE hvac.inventory_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac.businesses(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory items table
CREATE TABLE hvac.inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac.businesses(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES hvac.inventory_categories(id) ON DELETE SET NULL,
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

-- Inventory movements table
CREATE TABLE hvac.inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_item_id UUID REFERENCES hvac.inventory_items(id) ON DELETE CASCADE NOT NULL,
    work_order_id UUID REFERENCES hvac.work_orders(id) ON DELETE CASCADE,
    movement_type TEXT CHECK (movement_type IN ('in', 'out', 'adjustment')),
    quantity DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Material usage table (for work orders)
CREATE TABLE hvac.material_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID REFERENCES hvac.work_orders(id) ON DELETE CASCADE NOT NULL,
    inventory_item_id UUID REFERENCES hvac.inventory_items(id) ON DELETE CASCADE NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE hvac.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES hvac.businesses(id) ON DELETE CASCADE NOT NULL,
    work_order_id UUID REFERENCES hvac.work_orders(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES hvac.clients(id) ON DELETE CASCADE NOT NULL,
    invoice_number TEXT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0.00,
    payment_method TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice items table
CREATE TABLE hvac.invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES hvac.invoices(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE hvac.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac.equipment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac.client_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac.work_order_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac.work_order_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac.technician_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac.inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac.material_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE hvac.invoice_items ENABLE ROW LEVEL SECURITY;

-- Business policies
CREATE POLICY "Business owners can manage their business"
    ON hvac.businesses
    USING (auth.uid() = owner_id);

CREATE POLICY "Business owners can manage their services"
    ON hvac.services
    USING (EXISTS (
        SELECT 1 FROM hvac.businesses
        WHERE id = business_id AND owner_id = auth.uid()
    ));

-- Similar policies for other tables...

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION hvac.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_businesses_updated_at
    BEFORE UPDATE ON hvac.businesses
    FOR EACH ROW
    EXECUTE FUNCTION hvac.update_updated_at_column();

-- Similar triggers for other tables... 