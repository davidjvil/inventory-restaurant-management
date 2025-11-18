# API Documentation

## Overview

This document covers all API endpoints, database queries, and edge functions for the Restaurant Inventory SaaS.

## Authentication

All requests require authentication via Supabase Auth.

### Headers
```
Authorization: Bearer <access_token>
apikey: <supabase_anon_key>
```

## Database Tables

### Organizations

**Table:** `organizations`

**Columns:**
- `id` (UUID, PK)
- `name` (TEXT)
- `subscription_tier` (TEXT)
- `subscription_status` (TEXT)
- `trial_ends_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

**Example Query:**
```typescript
const { data, error } = await supabase
  .from('organizations')
  .select('*')
  .eq('id', organizationId)
  .single();
```

### Users

**Table:** `users`

**Columns:**
- `id` (UUID, PK, FK to auth.users)
- `organization_id` (UUID, FK)
- `email` (TEXT, UNIQUE)
- `full_name` (TEXT)
- `role` (ENUM: admin, store_manager, user)
- `assigned_store_ids` (UUID[])
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

**Example Query:**
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();
```

### Stores

**Table:** `stores`

**Example Query:**
```typescript
const { data, error } = await supabase
  .from('stores')
  .select('*')
  .eq('organization_id', organizationId)
  .order('name');
```

### Master Products

**Table:** `master_products`

**Example Query:**
```typescript
const { data, error } = await supabase
  .from('master_products')
  .select('*, vendor:master_vendors(*)')
  .eq('organization_id', organizationId);
```

### Store Products

**Table:** `store_products`

**Example Query:**
```typescript
const { data, error } = await supabase
  .from('store_products')
  .select('*, product:master_products(*)')
  .eq('store_id', storeId);
```

**Update Quantity:**
```typescript
const { error } = await supabase
  .from('store_products')
  .update({ 
    quantity_on_hand: newQuantity,
    last_inventory_check: new Date().toISOString()
  })
  .eq('id', productId);
```

### Inventory Checks

**Table:** `inventory_checks`

**Log Check:**
```typescript
const { error } = await supabase
  .from('inventory_checks')
  .insert({
    store_product_id: productId,
    user_id: userId,
    previous_quantity: oldQty,
    new_quantity: newQty,
    notes: 'Manual update'
  });
```

**Get History:**
```typescript
const { data, error } = await supabase
  .from('inventory_checks')
  .select('*, user:users(full_name)')
  .eq('store_product_id', productId)
  .order('checked_at', { ascending: false })
  .limit(50);
```

### Orders

**Table:** `orders`

**Create Order:**
```typescript
const { data, error } = await supabase
  .from('orders')
  .insert({
    store_id: storeId,
    vendor_id: vendorId,
    status: 'pending',
    total_amount: totalAmount,
    created_by: userId
  })
  .select()
  .single();
```

**Get Orders:**
```typescript
const { data, error } = await supabase
  .from('orders')
  .select('*, vendor:master_vendors(name), items:order_items(*)')
  .eq('store_id', storeId)
  .order('created_at', { ascending: false });
```

### Alerts

**Table:** `alerts`

**Create Alert:**
```typescript
const { error } = await supabase
  .from('alerts')
  .insert({
    organization_id: orgId,
    store_id: storeId,
    product_id: productId,
    alert_type: 'low_stock',
    message: 'Low stock alert',
    severity: 'high'
  });
```

**Get Unread Alerts:**
```typescript
const { data, error } = await supabase
  .from('alerts')
  .select('*')
  .eq('organization_id', orgId)
  .eq('is_read', false)
  .order('created_at', { ascending: false });
```

**Mark as Read:**
```typescript
const { error } = await supabase
  .from('alerts')
  .update({ is_read: true })
  .eq('id', alertId);
```

## Edge Functions

### calculate-order

**Endpoint:** `https://your-project.supabase.co/functions/v1/calculate-order`

**Method:** POST

**Request Body:**
```json
{
  "store_id": "uuid"
}
```

**Response:**
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

**Usage:**
```typescript
const { data, error } = await supabase.functions.invoke('calculate-order', {
  body: { store_id: storeId }
});
```

### send-report-email

**Endpoint:** `https://your-project.supabase.co/functions/v1/send-report-email`

**Method:** POST

**Request Body:**
```json
{
  "to": "user@example.com",
  "subject": "Daily Inventory Report",
  "reportData": [
    {
      "name": "Product Name",
      "sku": "SKU-001",
      "quantity": 15,
      "status": "Low"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "email-id"
  }
}
```

**Usage:**
```typescript
const { data, error } = await supabase.functions.invoke('send-report-email', {
  body: {
    to: userEmail,
    subject: 'Report Title',
    reportData: products
  }
});
```

## Real-time Subscriptions

### Subscribe to Alerts

```typescript
const subscription = supabase
  .channel('alerts')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'alerts',
      filter: `organization_id=eq.${orgId}`
    },
    (payload) => {
      console.log('New alert:', payload.new);
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

### Subscribe to Inventory Changes

```typescript
const subscription = supabase
  .channel('inventory')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'store_products',
      filter: `store_id=eq.${storeId}`
    },
    (payload) => {
      console.log('Inventory updated:', payload.new);
    }
  )
  .subscribe();
```

## Common Queries

### Dashboard Statistics

```typescript
// Total products
const { count: totalProducts } = await supabase
  .from('store_products')
  .select('*', { count: 'exact', head: true })
  .eq('store_id', storeId);

// Low stock count
const { count: lowStock } = await supabase
  .from('store_products')
  .select('*', { count: 'exact', head: true })
  .eq('store_id', storeId)
  .lte('quantity_on_hand', 'reorder_threshold');

// Total inventory value
const { data: products } = await supabase
  .from('store_products')
  .select('quantity_on_hand, product:master_products(base_price)')
  .eq('store_id', storeId);

const totalValue = products?.reduce(
  (sum, p) => sum + (p.quantity_on_hand * (p.product?.base_price || 0)),
  0
);
```

### Products by Category

```typescript
const { data, error } = await supabase
  .from('store_products')
  .select('*, product:master_products(*)')
  .eq('store_id', storeId)
  .eq('product.category', category);
```

### Products by Vendor

```typescript
const { data, error } = await supabase
  .from('store_products')
  .select('*, product:master_products(*, vendor:master_vendors(*))')
  .eq('store_id', storeId)
  .eq('product.vendor_id', vendorId);
```

### Inventory History

```typescript
const { data, error } = await supabase
  .from('inventory_checks')
  .select(`
    *,
    store_product:store_products(
      *,
      product:master_products(name, sku)
    ),
    user:users(full_name)
  `)
  .gte('checked_at', startDate)
  .lte('checked_at', endDate)
  .order('checked_at', { ascending: false });
```

## Error Handling

### Common Errors

**Authentication Error:**
```typescript
{
  code: 'PGRST301',
  message: 'JWT expired'
}
```

**RLS Policy Error:**
```typescript
{
  code: '42501',
  message: 'new row violates row-level security policy'
}
```

**Unique Constraint:**
```typescript
{
  code: '23505',
  message: 'duplicate key value violates unique constraint'
}
```

### Error Handling Pattern

```typescript
try {
  const { data, error } = await supabase
    .from('table')
    .select('*');
  
  if (error) throw error;
  
  return data;
} catch (error: any) {
  console.error('Database error:', error.message);
  // Handle specific error codes
  if (error.code === '23505') {
    // Handle duplicate
  }
  throw error;
}
```

## Rate Limits

### Supabase Limits

- **Free Tier:**
  - 500 MB database
  - 1 GB file storage
  - 2 GB bandwidth
  - 50,000 monthly active users

- **Pro Tier:**
  - 8 GB database
  - 100 GB file storage
  - 250 GB bandwidth
  - 100,000 monthly active users

### Edge Function Limits

- **Execution time:** 150 seconds
- **Memory:** 150 MB
- **Concurrent executions:** 10 (Free), 100 (Pro)

## Best Practices

1. **Use select() with specific columns** to reduce data transfer
2. **Implement pagination** for large datasets
3. **Use indexes** on frequently queried columns
4. **Cache frequently accessed data** on the client
5. **Batch operations** when possible
6. **Handle errors gracefully** with user-friendly messages
7. **Use real-time subscriptions** sparingly to avoid performance issues
8. **Implement retry logic** for transient failures
