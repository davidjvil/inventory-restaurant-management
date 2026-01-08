# Restaurant Inventory SaaS - Product Specification

## Business Overview

### Master Product List
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

### Vendors
Master Vendor List includes:
- Name* (required)
- Contact
- Delivery Date* (required)
- Order Dates* (required)
- Address

Vendors assigned per product, editable per store.

### Locations
Unlimited stores, each with:
- Name (unique identifier)
- Address

### Inventory Tracking
- "Qty on Hand" per product per store
- Historical inventory checks
- Customizable reports (item, vendor, store, date)
- Standard views (daily, weekly, monthly)

### Order Calculation

**Formula 1**: Order = Minimum Order Amount – Quantity on Hand

**Formula 2**: Auto-trigger when Qty on Hand ≤ Minimum Order threshold

### User Roles

**Admin**
- Full access to all records/actions
- Manage master products/vendors
- View all stores and reports

**Store Manager**
- Manage assigned stores
- Add/edit/delete products for assigned stores
- Run reports for assigned stores

**User**
- Update Quantity on Hand only
- View assigned store inventory
- No edit access to products/vendors

### Alerts
- Low stock thresholds per product/store
- In-app notifications
- Email reports (monthly/yearly) via Resend

### Subscription Logic

**Base Tier**: $99-$199/month
- 1 Admin
- 1 Store Manager
- 1 Store
- 1 User
- 14-30 day trial with test data

**Add-ons**:
- Extra stores: $25-$50/month each
- Extra managers: $15-$25/month each
- Extra users: $10-$15/month each

## Table Structure

### organizations
- id (UUID, PK)
- name (TEXT)
- subscription_tier (TEXT)
- subscription_status (TEXT)
- trial_ends_at (TIMESTAMPTZ)
- created_at, updated_at

### users
- id (UUID, PK, FK to auth.users)
- organization_id (UUID, FK)
- email (TEXT, UNIQUE)
- full_name (TEXT)
- role (ENUM: admin, store_manager, user)
- assigned_store_ids (UUID[])
- created_at, updated_at

### stores
- id (UUID, PK)
- organization_id (UUID, FK)
- name (TEXT)
- address (TEXT)
- created_at, updated_at

### master_products
- id (UUID, PK)
- organization_id (UUID, FK)
- name (TEXT)
- sku (TEXT, UNIQUE per org)
- category (TEXT)
- vendor_id (UUID, FK)
- unit (TEXT)
- base_price (DECIMAL)
- description (TEXT)
- notes (TEXT)
- image_url (TEXT)
- created_at, updated_at

### store_products
- id (UUID, PK)
- store_id (UUID, FK)
- product_id (UUID, FK)
- quantity_on_hand (DECIMAL)
- minimum_order_amount (DECIMAL)
- delivery_days (TEXT)
- order_days (TEXT)
- reorder_threshold (DECIMAL)
- last_inventory_check (TIMESTAMPTZ)
- created_at, updated_at

### master_vendors
- id (UUID, PK)
- organization_id (UUID, FK)
- name (TEXT)
- contact (TEXT)
- delivery_date (TEXT)
- order_dates (TEXT)
- address (TEXT)
- created_at, updated_at

### store_vendors
- id (UUID, PK)
- store_id (UUID, FK)
- vendor_id (UUID, FK)
- name, contact, delivery_date, order_dates, address (overrides)
- created_at, updated_at

### inventory_checks
- id (UUID, PK)
- store_product_id (UUID, FK)
- user_id (UUID, FK)
- previous_quantity (DECIMAL)
- new_quantity (DECIMAL)
- notes (TEXT)
- checked_at (TIMESTAMPTZ)

### orders
- id (UUID, PK)
- store_id (UUID, FK)
- vendor_id (UUID, FK)
- status (TEXT)
- total_amount (DECIMAL)
- created_by (UUID, FK)
- created_at, updated_at

### order_items
- id (UUID, PK)
- order_id (UUID, FK)
- product_id (UUID, FK)
- quantity (DECIMAL)
- unit_price (DECIMAL)
- total_price (DECIMAL)

### alerts
- id (UUID, PK)
- organization_id (UUID, FK)
- store_id (UUID, FK)
- product_id (UUID, FK)
- alert_type (TEXT)
- message (TEXT)
- severity (ENUM: low, medium, high)
- is_read (BOOLEAN)
- created_at

### audit_logs
- id (UUID, PK)
- organization_id (UUID, FK)
- user_id (UUID, FK)
- action (TEXT)
- entity_type (TEXT)
- entity_id (UUID)
- changes (JSONB)
- created_at

### subscription_limits
- id (UUID, PK)
- organization_id (UUID, FK)
- max_stores (INTEGER)
- max_managers (INTEGER)
- max_users (INTEGER)
- created_at, updated_at

## Workflow Logic

### Inventory Check Flow
1. User opens product detail
2. Updates "Qty on Hand"
3. System logs previous/new quantity
4. Checks against reorder threshold
5. Creates alert if below threshold
6. Triggers order calculation if needed

### Order Calculation Flow
1. Run nightly or on-demand
2. Query all store_products
3. Apply Formula 1: Order = Min - Qty
4. Apply Formula 2: Check if Qty ≤ Threshold
5. Group by vendor
6. Create pending orders
7. Notify store managers

### Report Generation Flow
1. User selects date range, filters
2. Query inventory_checks table
3. Aggregate by product/vendor/store
4. Generate PDF/CSV
5. Email via Resend (scheduled reports)

## User Experience

### Admin Workflow
1. Dashboard: Org-wide metrics
2. Master Products: CRUD operations
3. Master Vendors: CRUD operations
4. Stores: View all, manage settings
5. Reports: Cross-store analytics
6. Settings: Subscription, users

### Store Manager Workflow
1. Dashboard: Assigned store metrics
2. Products: View master, edit store-specific
3. Inventory: Update quantities
4. Orders: Review/submit pending orders
5. Reports: Store-specific analytics

### User Workflow
1. Dashboard: Assigned store overview
2. Products: View list
3. Update Qty: Quick edit interface
4. Alerts: View notifications

## Integration Recommendations

### Website Integration
- **Onboarding Portal**: Trial signup, plan selection
- **Customer Dashboard**: Usage analytics, billing
- **Support Center**: Knowledge base, tickets
- **Admin Panel**: Manage all organizations
- **Marketing Site**: Features, pricing, testimonials

### Mobile Features
- Barcode scanning for inventory checks
- Offline mode with sync queue
- Push notifications for alerts
- Camera for product images
- Export reports to email/cloud storage

## SaaS Tier Rationale

**Base Tier ($99-$149/month)**
- Targets single-location restaurants
- Covers operational costs
- Competitive with alternatives
- 14-day trial reduces friction

**Growth Pricing**
- Per-store pricing scales with value
- Manager/user pricing covers support costs
- Encourages expansion within platform
- Volume discounts at enterprise level

## Success Metrics
- Inventory accuracy improvement
- Time saved on ordering
- Waste reduction
- User adoption rate
- Monthly recurring revenue (MRR)
- Customer lifetime value (LTV)
