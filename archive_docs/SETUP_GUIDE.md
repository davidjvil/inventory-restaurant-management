# Setup Guide - Restaurant Inventory SaaS

## Prerequisites

- Node.js 18+ installed
- Expo CLI installed (`npm install -g expo-cli`)
- Supabase account
- Resend account (for email reports)

## Step 1: Clone and Install

```bash
git clone <repository-url>
cd restaurant-inventory
npm install
```

## Step 2: Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. The database schema has already been applied
3. Copy your project URL and anon key

## Step 3: Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## Step 4: Resend Setup (Optional)

1. Sign up at https://resend.com
2. Get your API key
3. In Supabase Dashboard → Edge Functions → Secrets, add:
   ```
   RESEND_API_KEY=your_resend_key
   ```

## Step 5: Run the App

```bash
# Start development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Run on physical device
# Scan QR code with Expo Go app
```

## Step 6: Test with Demo Data

The database already includes sample data:
- Organization: "Demo Restaurant Group"
- 3 Stores
- 12 Products
- 4 Vendors

## Default Test Account

You'll need to create an account through the signup screen. After signup:

1. Check your email for verification
2. Sign in with your credentials
3. You'll be assigned to the demo organization

## Features to Test

### Dashboard
- View inventory metrics
- Check low stock alerts
- Monitor total inventory value

### Products
- Browse product list
- Update quantities
- View stock status
- Add new products (admin only)

### Orders
- View pending orders
- Calculate order amounts
- Submit orders to vendors

### Alerts
- Low stock notifications
- Mark alerts as read
- Filter by severity

### Reports
- Generate daily/weekly/monthly reports
- Email reports to your address
- Export inventory data

### Settings
- View profile
- Manage organization
- Sign out

## Troubleshooting

### "Supabase client not initialized"
- Check your `.env` file has correct credentials
- Restart the development server

### "Email not sending"
- Verify RESEND_API_KEY is set in Supabase Edge Functions secrets
- Check Resend dashboard for API limits

### "RLS Policy Error"
- Ensure you're signed in
- Check user has correct role assignment
- Verify organization_id is set

## Production Deployment

### Mobile Apps

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Edge Functions

Edge functions are already deployed. To update:

```bash
supabase functions deploy calculate-order
supabase functions deploy send-report-email
```

## Support

For issues or questions:
- Check documentation in `/docs`
- Review PRODUCT_SPEC.md for feature details
- Contact support team

## Next Steps

1. Customize branding (colors, logo)
2. Add your organization data
3. Invite team members
4. Configure subscription tiers
5. Set up payment processing
6. Launch to production
