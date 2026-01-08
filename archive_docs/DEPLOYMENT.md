# Deployment Guide

## Overview

This guide covers deploying the Restaurant Inventory SaaS to production for iOS, Android, and web platforms.

## Prerequisites

- EAS (Expo Application Services) account
- Apple Developer account (for iOS)
- Google Play Console account (for Android)
- Supabase production project
- Resend production API key

## 1. Production Environment Setup

### Supabase Production

1. Create production Supabase project
2. Run database migrations:
   ```sql
   -- Copy all SQL from the initial setup
   -- Available in the Supabase dashboard
   ```

3. Configure RLS policies (already included in schema)

4. Set up Edge Functions:
   ```bash
   supabase functions deploy calculate-order
   supabase functions deploy send-report-email
   ```

5. Add secrets:
   ```bash
   supabase secrets set RESEND_API_KEY=your_production_key
   ```

### Environment Variables

Create `.env.production`:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_prod_anon_key
```

## 2. Mobile App Deployment

### Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

### Configure EAS

```bash
eas build:configure
```

This creates `eas.json`:
```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "your_prod_url",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your_prod_key"
      }
    }
  }
}
```

### Build for iOS

```bash
# Development build
eas build --platform ios --profile development

# Production build
eas build --platform ios --profile production
```

**iOS Requirements:**
- Apple Developer account ($99/year)
- App Store Connect setup
- Provisioning profiles
- App icons and screenshots

### Build for Android

```bash
# Development build
eas build --platform android --profile development

# Production build
eas build --platform android --profile production
```

**Android Requirements:**
- Google Play Console account ($25 one-time)
- Keystore for signing
- App icons and screenshots
- Privacy policy URL

### Submit to App Stores

```bash
# iOS
eas submit --platform ios

# Android
eas submit --platform android
```

## 3. Web Deployment

### Build for Web

```bash
npx expo export --platform web
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 4. Database Backups

### Automated Backups (Supabase)

Supabase Pro plan includes:
- Daily backups (retained 7 days)
- Point-in-time recovery

### Manual Backup

```bash
# Export schema
pg_dump -h db.your-project.supabase.co -U postgres -s > schema.sql

# Export data
pg_dump -h db.your-project.supabase.co -U postgres -a > data.sql
```

## 5. Monitoring & Analytics

### Supabase Dashboard

Monitor:
- Database performance
- API usage
- Edge function logs
- Storage usage

### Sentry Integration (Optional)

```bash
npm install @sentry/react-native
```

Configure in `app/_layout.tsx`:
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: 'production',
});
```

### Analytics (Optional)

Consider:
- Mixpanel
- Amplitude
- Google Analytics for Firebase

## 6. CI/CD Pipeline

### GitHub Actions Example

`.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: eas build --platform all --non-interactive
```

## 7. Production Checklist

### Security
- ✓ Environment variables secured
- ✓ RLS policies enabled
- ✓ API keys rotated
- ✓ HTTPS enforced
- ✓ Rate limiting configured

### Performance
- ✓ Database indexes created
- ✓ Image optimization enabled
- ✓ Caching configured
- ✓ CDN setup for assets

### Compliance
- ✓ Privacy policy published
- ✓ Terms of service published
- ✓ GDPR compliance (if EU users)
- ✓ Data retention policies

### Monitoring
- ✓ Error tracking enabled
- ✓ Performance monitoring
- ✓ Uptime monitoring
- ✓ Database backups verified

## 8. Post-Launch

### User Onboarding
1. Create demo organization
2. Populate sample data
3. Test trial signup flow
4. Verify email delivery

### Support Setup
1. Create help documentation
2. Set up support email
3. Configure in-app chat (optional)
4. Create FAQ section

### Marketing
1. Launch landing page
2. Set up analytics
3. Configure payment processing
4. Enable subscription management

## 9. Scaling Considerations

### Database
- Upgrade Supabase plan as needed
- Monitor query performance
- Add read replicas if needed
- Consider connection pooling

### Edge Functions
- Monitor execution time
- Optimize cold starts
- Add caching where appropriate
- Scale concurrent executions

### Storage
- Implement CDN for images
- Compress uploads
- Set up lifecycle policies
- Monitor bandwidth usage

## 10. Maintenance

### Regular Tasks
- Weekly: Review error logs
- Monthly: Check performance metrics
- Quarterly: Security audit
- Annually: Dependency updates

### Updates
```bash
# Update dependencies
npm update

# Rebuild and deploy
eas build --platform all --profile production
```

## Support

For deployment issues:
- Check Expo documentation
- Review Supabase logs
- Contact support team
- Join community forums
