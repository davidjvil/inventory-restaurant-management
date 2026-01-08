# Restaurant Inventory Management - Master Design Document

> **Status**: Consolidated Source of Truth
> **Last Updated**: January 2026

---

## 📚 TABLE OF CONTENTS

1.  [Product Specification](#1-product-specification)
2.  [Detailed Roadmap](#2-detailed-roadmap)
3.  [Database Schema & Architecture](#3-database-schema--architecture)
4.  [Authentication, Signup & Roles](#4-authentication-signup--roles)
5.  [API & Edge Functions](#5-api--edge-functions)
6.  [Sample Data Reference](#6-sample-data-reference)
7.  [Deployment & QA Checklists](#7-deployment--qa-checklists)

---

## 1. PRODUCT SPECIFICATION

### Business Overview

**Master Product List**
Admin creates all products centrally. Each product includes:
- Name, SKU, Category
- Vendor (from Master Vendor List)
- Unit of measurement
- Base price
- Description, notes, image
- Minimum order amount
- Delivery days, order days

Stores pull from master list and add:
- Quantity on hand (store-specific)
- Store-specific min order
- Store-specific delivery/order days

**Vendors**
Master Vendor List includes:
- Name* (required)
- Contact
- Delivery Date* (required)
- Order Dates* (required)
- Address
Vendors assigned per product, editable per store.

**Locations**
Unlimited stores, each with:
- Name (unique identifier)
- Address

### Inventory Tracking Logic
- "Qty on Hand" per product per store
- Historical inventory checks
- Customizable reports (item, vendor, store, date)
- Standard views (daily, weekly, monthly)

### Order Calculation
**Formula 1**: Order = Minimum Order Amount – Quantity on Hand
**Formula 2**: Auto-trigger when Qty on Hand ≤ Minimum Order threshold

### Subscription Logic
**Base Tier**: $99-$199/month
- 1 Admin, 1 Store Manager, 1 Store, 1 User
- 14-30 day trial with test data

**Add-ons**:
- Extra stores: $25-$50/month each
- Extra managers: $15-$25/month each
- Extra users: $10-$15/month each

---

## 2. DETAILED ROADMAP

### Phase 1: Foundation & Core ✅ (In Progress)
**1.1 Authentication & User Management**
- [x] User signup flow
- [x] Email/password authentication
- [x] User profile creation
- [ ] Email verification flow

**1.2 Organization Setup**
- [x] Organization creation form (Atomic)
- [x] Business type selection
- [x] Basic organization details

**1.3 Database Schema**
- [x] Users, Organizations, Stores tables
- [x] RLS Policies

### Phase 2: Inventory Management Module 📦
**2.1 Product Management**
- [ ] Add new products/items
- [ ] Product categorization & images
- [ ] SKU/barcode management
- [ ] Bulk import (CSV)

**2.2 Stock Tracking**
- [ ] Real-time stock levels
- [ ] Stock adjustments (manual)
- [ ] Location-based inventory (Offline Support Added ✅)

**2.3 Inventory Alerts**
- [ ] Low stock alerts
- [ ] Email notifications via Resend

### Phase 3: Restaurant Operations Module 🍽️
**3.1 Menu Management**
- [ ] Recipes & Ingredients
- [ ] Costing & Yields

**3.2 Orders**
- [ ] Purchase Order generation
- [ ] Receiving & Quality Checks

### Phase 4: Reporting & Analytics 📊
**4.1 Reports**
- [ ] Daily sales summary (if POS integrated)
- [ ] Inventory valuation & turnover
- [ ] COGS & Waste Tracking

### Phase 5: Advanced Features 🚀
**5.1 Mobile**
- [ ] Barcode Scanning (Camera)
- [ ] Push Notifications

**5.2 Integrations**
- [ ] Accounting software (QuickBooks)
- [ ] Vendor Portals

---

## 3. DATABASE SCHEMA & ARCHITECTURE

### Core Tables (SQL Definition)

```sql
-- 1. Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  trial_ends_at TIMESTAMP,
  invite_code TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Users
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'store_manager', 'user')),
  assigned_store_ids TEXT[], 
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Stores
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Master Products
CREATE TABLE master_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  category TEXT,
  vendor_id UUID REFERENCES master_vendors(id),
  unit TEXT,
  base_price DECIMAL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Store Products (Inventory)
CREATE TABLE store_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id),
  product_id UUID REFERENCES master_products(id),
  quantity_on_hand INTEGER DEFAULT 0,
  minimum_order_amount INTEGER,
  reorder_threshold INTEGER,
  last_inventory_check TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Master Vendors
CREATE TABLE master_vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  contact TEXT,
  delivery_date TEXT, -- e.g. "Mon, Wed, Fri"
  order_dates TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id),
  vendor_id UUID REFERENCES master_vendors(id),
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  store_id UUID REFERENCES stores(id),
  product_id UUID REFERENCES master_products(id),
  alert_type TEXT NOT NULL, -- 'low_stock'
  severity TEXT DEFAULT 'medium',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Security (RLS)
- **RLS Enabled on ALL TABLES**.
- **Policy Pattern**: `organization_id = auth.jwt().organization_id` (conceptually).
- **Users**: Can read their own organization's data.

---

## 4. AUTHENTICATION, SIGNUP & ROLES

### Signup Flow (Multi-Step)

**Step 1: Account Type**
- Create New Organization OR Join Existing.

**Step 2A: Organization Setup**
- Fields: Name, Type (Restaurant/Cafe), Phone, Address, # Locations.
- **Atomic Creation**: Uses `create_organization_and_link_user` RPC to ensure data integrity.

**Step 2B: Join Organization**
- Method: Invite Code (6-digit) or Email Request.

**Step 3: Account Creation**
- Fields: Email, Password (strong), Full Name.
- **Verification**: Auto-assigns 'admin' role if creating org, 'user' if joining.

### Role-Based Access Control (RBAC)

**1. Admin**
- **Access**: Full system access.
- ** Capabilities**: Manage Org Settings, Users, Stores, Vendors, Reports.
- **Tabs**: Dashboard, Products, Vendors, Alerts, Settings.

**2. Store Manager**
- **Access**: Assigned Stores only.
- **Capabilities**: Manage Store Inventory, Store Products, Vendors, Alerts.
- **Tabs**: Dashboard, Products, Vendors, Alerts, Settings.

**3. Staff (User)**
- **Access**: Read-only Products, Write-only Inventory Counts.
- **Capabilities**: Update 'Qty on Hand'. View basic dashboard.
- **Tabs**: Dashboard, Products, Settings. NO Vendor/Alert access.

---

## 5. API & EDGE FUNCTIONS

### 5.1 `calculate-order`
**Endpoint**: `POST /functions/v1/calculate-order`
**Purpose**: Generates order suggestions based on `Min Order - Qty on Hand`.

**Request**:
```json
{ "store_id": "uuid" }
```

**Response**:
```json
{
  "success": true,
  "orderItems": [
    {
      "product_id": "uuid",
      "product_name": "Organic Tomatoes",
      "current_qty": 15,
      "min_order": 30,
      "order_amount": 15,
      "vendor_id": "uuid"
    }
  ]
}
```

### 5.2 `send-report-email`
**Endpoint**: `POST /functions/v1/send-report-email`
**Purpose**: Sends HTML email report via Resend.

**Request**:
```json
{
  "to": "manager@restaurant.com",
  "subject": "Daily Inventory Report",
  "reportData": [ ... ]
}
```

### 5.3 Database RPCs
- **`create_organization_and_link_user`**: Creates org + links user as admin (Transaction).
- **`get_dashboard_stats`**: Returns Total Products, Low Stock Count, Pending Orders, Inventory Value.

---

## 6. SAMPLE DATA REFERENCE

### Organizations
| Field | Value |
|-------|-------|
| Name | **Demo Restaurant Group** |
| Tier | Base (Trial) |

### Vendors
| Name | Contact | Delivery Days |
|------|---------|---------------|
| **Fresh Produce Co** | John Smith (555-123-4567) | Mon, Wed, Fri |
| **Premium Meats** | Sarah Johnson | Tue, Thu |
| **Sysco Foods** | Lisa Brown | Mon, Thu |

### Master Products
| Name | SKU | Category | Unit | Price | Vendor |
|------|-----|----------|------|-------|--------|
| **Organic Tomatoes** | PROD-001 | Produce | lbs | $2.50 | Fresh Produce Co |
| **Ground Beef** | MEAT-001 | Meat | lbs | $5.50 | Premium Meats |
| **Whole Milk** | DAIRY-001 | Dairy | gal | $3.50 | Sysco Foods |
| **Olive Oil** | PANTRY-001 | Pantry | gal | $25.00 | Sysco Foods |

### Inventory (Downtown Location)
| Product | Qty | Min Order | Reorder Threshold | Status |
|---------|-----|-----------|-------------------|--------|
| Tomatoes | 15 | 30 | 20 | **LOW** |
| Ground Beef| 25 | 50 | 35 | **LOW** |
| Olive Oil | 5 | 10 | 8 | **LOW** |

---

## 7. DEPLOYMENT & QA CHECKLISTS

### Production Deployment
1.  **Supabase Setup**:
    - Project created.
    - SQL Migrations applied (`supabase_rpc_migration.sql`, `supabase_dashboard_stats.sql`).
    - Secrets set (`RESEND_API_KEY`).
2.  **Environment Variables**:
    - `EXPO_PUBLIC_SUPABASE_URL`
    - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3.  **Build**:
    - `eas build --platform ios --profile production`
    - `eas build --platform android --profile production`

### QA Testing Checklist

**Authentication**
- [ ] Login with valid/invalid credentials.
- [ ] Signup creates new account & organization successfully.
- [ ] Session persists after restart.

**Role Access**
- [ ] Admin sees all tabs.
- [ ] Staff sees limited tabs (No Vendors/Alerts).
- [ ] Protected routes redirect unauthorized users.

**Products & Inventory**
- [ ] Product list loads with images.
- [ ] Update Quantity saves to DB.
- [ ] Search/Filter by category works.
- [ ] "Add Product" (Admin only) works.

**Offline Mode**
- [ ] App loads content without internet.
- [ ] Local changes persist (if offline sync implemented).

**Performance**
- [ ] Dashboard loads < 1s (using RPC).
- [ ] No strict dependencies on non-critical data.
