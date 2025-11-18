# Production Deployment Guide

## Prerequisites

### 1. Supabase Account Setup
1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key
4. Set up authentication providers (Email/Password enabled by default)

### 2. Resend Account Setup (for email notifications)
1. Create account at [resend.com](https://resend.com)
2. Verify your domain
3. Generate API key
4. Add to Supabase secrets: `RESEND_API_KEY`

## Database Setup

### 1. Run SQL Migrations

Execute these SQL commands in Supabase SQL Editor:

```sql
-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  trial_ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'store_manager', 'user')),
  assigned_store_ids TEXT[],
  notification_preferences JSONB,
  theme_preference TEXT DEFAULT 'light',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Stores table
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Master Vendors table
CREATE TABLE master_vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  contact TEXT,
  delivery_date TEXT,
  order_dates TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Master Products table
CREATE TABLE master_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  category TEXT,
  vendor_id UUID REFERENCES master_vendors(id),
  unit TEXT,
  base_price DECIMAL,
  description TEXT,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Store Products table
CREATE TABLE store_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id),
  product_id UUID REFERENCES master_products(id),
  quantity_on_hand INTEGER DEFAULT 0,
  minimum_order_amount INTEGER,
  delivery_days TEXT,
  order_days TEXT,
  reorder_threshold INTEGER,
  last_inventory_check TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Alerts table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id),
  store_id UUID REFERENCES stores(id),
  product_id UUID REFERENCES master_products(id),
  alert_type TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id),
  vendor_id UUID REFERENCES master_vendors(id),
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can read their own organization's data
CREATE POLICY "Users can view own org data" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  );

-- Similar policies for other tables...
```

## Environment Configuration

### 1. Update `.env` file

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Edge Function Secrets

In Supabase Dashboard > Edge Functions > Secrets, add:
- `RESEND_API_KEY`: Your Resend API key

## Build Configuration

### 1. Update `app.json`

```json
{
  "expo": {
    "name": "Restaurant Inventory",
    "slug": "restaurant-inventory",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.restaurantinventory"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.restaurantinventory"
    }
  }
}
```

### 2. Install Dependencies

```bash
npm install
```

## Testing Before Production

1. **Test Authentication:**
   - Create test accounts for each role (admin, manager, user)
   - Verify login/logout works
   - Test password reset

2. **Test Role-Based Access:**
   - Login as each role
   - Verify correct tabs are visible
   - Test restricted access

3. **Test All CRUD Operations:**
   - Products: Add, Edit, Delete
   - Vendors: Add, Edit, Delete
   - Users: Add, Edit, Delete
   - Verify all toasts and dialogs work

4. **Test on Real Devices:**
   - iOS device
   - Android device
   - Different screen sizes

## Production Build

### iOS (App Store)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

### Android (Google Play)

```bash
# Build for Android
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android
```

## Post-Deployment

### 1. Monitoring
- Set up Sentry or similar for error tracking
- Monitor Supabase dashboard for database performance
- Check Edge Function logs

### 2. Analytics
- Integrate analytics (Amplitude, Mixpanel, etc.)
- Track key user actions
- Monitor conversion funnels

### 3. Support
- Set up support email
- Create help documentation
- Prepare FAQ

### 4. Backups
- Enable Supabase automatic backups
- Set up backup schedule
- Test restore procedure

## Maintenance

### Regular Tasks
- [ ] Monitor error logs weekly
- [ ] Review user feedback
- [ ] Update dependencies monthly
- [ ] Test new OS versions
- [ ] Backup database weekly
- [ ] Review analytics monthly

### Updates
- Use EAS Update for OTA updates
- Submit new builds for major changes
- Follow semantic versioning

## Troubleshooting

### Common Issues

**Build Fails:**
- Check all dependencies are installed
- Verify app.json configuration
- Check for TypeScript errors

**Authentication Issues:**
- Verify Supabase URL and key
- Check RLS policies
- Verify email templates

**Performance Issues:**
- Optimize images
- Implement pagination
- Add caching
- Review database queries

## Support Contacts

- Supabase Support: support@supabase.io
- Expo Support: support@expo.dev
- Resend Support: support@resend.com

## Checklist Before Go-Live

- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] RLS policies enabled
- [ ] Test accounts created
- [ ] All features tested
- [ ] Performance optimized
- [ ] Error tracking configured
- [ ] Analytics configured
- [ ] App Store assets prepared
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Support email configured
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Team trained on admin features

---

**Ready to Deploy!** 🚀
