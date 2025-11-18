# Restaurant Inventory SaaS

A comprehensive multi-tenant restaurant inventory management system built with React Native, Expo, and Supabase.

## Features

- **Multi-Tenant Architecture**: Separate organizations with isolated data
- **Role-Based Access Control**: Admin, Store Manager, and User roles
- **Master Product Catalog**: Centralized product management
- **Store-Specific Inventory**: Track quantities per location
- **Automated Order Calculations**: Two formula options for reorder triggers
- **Real-Time Alerts**: Low stock notifications
- **Comprehensive Reporting**: Email reports via Resend
- **Offline Support**: Local caching with cloud sync
- **Mobile-First Design**: Optimized for iOS and Android

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Navigation**: Expo Router
- **Email**: Resend API
- **Styling**: React Native StyleSheet

## Database Schema

### Core Tables

- `organizations` - Multi-tenant organization data
- `users` - User accounts with role-based permissions
- `stores` - Restaurant locations
- `master_products` - Central product catalog
- `store_products` - Store-specific inventory levels
- `master_vendors` - Vendor directory
- `store_vendors` - Store-specific vendor overrides
- `inventory_checks` - Audit trail of inventory updates
- `orders` - Purchase orders
- `alerts` - System notifications
- `audit_logs` - Complete activity history
- `subscription_limits` - SaaS tier restrictions

## User Roles

### Admin
- Full access to all features
- Manage organization settings
- Create/edit master products and vendors
- View all stores and reports

### Store Manager
- Manage assigned stores
- Edit store-specific product details
- Run reports for assigned locations
- Manage inventory checks

### User
- Update quantity on hand only
- View assigned store inventory
- Limited read access

## Subscription Tiers

### Base Tier ($99-$149/month)
- 1 Admin user
- 1 Store Manager
- 1 Store location
- 1 Regular user
- 14-day free trial

### Growth Tier
- Base + $25-$50 per additional store
- Base + $15-$25 per additional manager
- Base + $10-$15 per additional user

## Order Calculation Formulas

**Formula 1**: `Order Amount = Minimum Order Amount - Quantity on Hand`

**Formula 2**: Auto-trigger when `Quantity on Hand ≤ Reorder Threshold`

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure Supabase credentials in `.env`
4. Run migrations (already applied)
5. Start development server: `npx expo start`

## Environment Variables

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
RESEND_API_KEY=your_resend_key
```

## Sample Data

Demo organization with 3 stores, 12 products, and 4 vendors included.

## Edge Functions

- `calculate-order`: Automated order calculation
- `send-report-email`: Email reporting via Resend

## License

Proprietary - All rights reserved
