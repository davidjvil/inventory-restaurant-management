# Sample Data Documentation

## Organizations

| Field | Value |
|-------|-------|
| Name | Demo Restaurant Group |
| Subscription Tier | base |
| Subscription Status | trial |
| Trial Ends | 14 days from creation |

## Stores

| Name | Address |
|------|---------|
| Downtown Location | 123 Main St, City, ST 12345 |
| Uptown Branch | 456 Oak Ave, City, ST 12346 |
| Westside Kitchen | 789 Elm Blvd, City, ST 12347 |

## Vendors

| Name | Contact | Delivery Days | Order Days |
|------|---------|---------------|------------|
| Fresh Produce Co | John Smith - (555) 123-4567 | Mon, Wed, Fri | Sun, Tue, Thu |
| Premium Meats Supply | Sarah Johnson - (555) 234-5678 | Tue, Thu | Mon, Wed |
| Dairy Direct | Mike Davis - (555) 345-6789 | Daily | Daily |
| Sysco Foods | Lisa Brown - (555) 456-7890 | Mon, Thu | Fri, Sun |

## Master Products

| Name | SKU | Category | Unit | Base Price | Vendor |
|------|-----|----------|------|------------|--------|
| Organic Tomatoes | PROD-001 | Produce | lbs | $2.50 | Fresh Produce Co |
| Romaine Lettuce | PROD-002 | Produce | heads | $1.75 | Fresh Produce Co |
| Yellow Onions | PROD-003 | Produce | lbs | $1.25 | Fresh Produce Co |
| Bell Peppers | PROD-004 | Produce | lbs | $3.00 | Fresh Produce Co |
| Ground Beef | MEAT-001 | Meat | lbs | $5.50 | Premium Meats Supply |
| Chicken Breast | MEAT-002 | Meat | lbs | $4.25 | Premium Meats Supply |
| Pork Chops | MEAT-003 | Meat | lbs | $6.00 | Premium Meats Supply |
| Whole Milk | DAIRY-001 | Dairy | gallons | $3.50 | Dairy Direct |
| Cheddar Cheese | DAIRY-002 | Dairy | lbs | $7.25 | Dairy Direct |
| Butter | DAIRY-003 | Dairy | lbs | $4.50 | Dairy Direct |
| Olive Oil | PANTRY-001 | Pantry | gallons | $25.00 | Sysco Foods |
| All-Purpose Flour | PANTRY-002 | Pantry | lbs | $0.75 | Sysco Foods |

## Store Products (Downtown Location)

| Product | Qty on Hand | Min Order | Reorder Threshold | Status |
|---------|-------------|-----------|-------------------|--------|
| Organic Tomatoes | 15 lbs | 30 lbs | 20 lbs | Low |
| Romaine Lettuce | 15 heads | 30 heads | 20 heads | Low |
| Yellow Onions | 15 lbs | 30 lbs | 20 lbs | Low |
| Bell Peppers | 15 lbs | 30 lbs | 20 lbs | Low |
| Ground Beef | 25 lbs | 50 lbs | 35 lbs | Low |
| Chicken Breast | 25 lbs | 50 lbs | 35 lbs | Low |
| Pork Chops | 25 lbs | 50 lbs | 35 lbs | Low |
| Whole Milk | 10 gallons | 20 gallons | 15 gallons | Low |
| Cheddar Cheese | 10 lbs | 20 lbs | 15 lbs | Low |
| Butter | 10 lbs | 20 lbs | 15 lbs | Low |
| Olive Oil | 5 gallons | 10 gallons | 8 gallons | Low |
| All-Purpose Flour | 5 lbs | 10 lbs | 8 lbs | Low |

## Sample Alerts

| Type | Message | Severity |
|------|---------|----------|
| low_stock | Low stock alert: Organic Tomatoes is below reorder threshold | high |
| low_stock | Low stock alert: Romaine Lettuce is below reorder threshold | high |
| low_stock | Low stock alert: Yellow Onions is below reorder threshold | high |

## Order Calculation Examples

### Formula 1: Order = Min Order - Qty on Hand

**Example: Organic Tomatoes**
- Min Order: 30 lbs
- Qty on Hand: 15 lbs
- **Order Amount: 15 lbs**

**Example: Ground Beef**
- Min Order: 50 lbs
- Qty on Hand: 25 lbs
- **Order Amount: 25 lbs**

### Formula 2: Auto-trigger when Qty ≤ Threshold

**Example: Organic Tomatoes**
- Qty on Hand: 15 lbs
- Reorder Threshold: 20 lbs
- **Status: TRIGGER ORDER** (15 ≤ 20)

**Example: Chicken Breast**
- Qty on Hand: 25 lbs
- Reorder Threshold: 35 lbs
- **Status: TRIGGER ORDER** (25 ≤ 35)

## User Roles & Permissions

### Admin
- ✓ Create/edit master products
- ✓ Create/edit master vendors
- ✓ Manage all stores
- ✓ View all reports
- ✓ Manage users
- ✓ Configure subscription

### Store Manager
- ✓ View master products
- ✓ Edit store-specific product details
- ✓ Update inventory quantities
- ✓ Create orders
- ✓ View store reports
- ✗ Cannot edit master data

### User
- ✓ View products
- ✓ Update quantities only
- ✗ Cannot edit products
- ✗ Cannot create orders
- ✗ Limited reporting

## Subscription Limits

| Tier | Max Stores | Max Managers | Max Users | Price |
|------|------------|--------------|-----------|-------|
| Base | 1 | 1 | 1 | $99-$149/mo |
| + Store | +1 per add-on | - | - | +$25-$50/mo |
| + Manager | - | +1 per add-on | - | +$15-$25/mo |
| + User | - | - | +1 per add-on | +$10-$15/mo |

## API Endpoints (Edge Functions)

### calculate-order
**Input:**
```json
{
  "store_id": "uuid"
}
```

**Output:**
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

### send-report-email
**Input:**
```json
{
  "to": "user@example.com",
  "subject": "Daily Inventory Report",
  "reportData": [
    {
      "name": "Organic Tomatoes",
      "sku": "PROD-001",
      "quantity": 15,
      "status": "Low"
    }
  ]
}
```

**Output:**
```json
{
  "success": true,
  "data": { "id": "email-id" }
}
```
