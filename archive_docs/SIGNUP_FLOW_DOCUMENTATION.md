# Multi-Step Signup Flow Documentation

## Overview
The Restaurant Inventory Management app now features a comprehensive 3-step signup process designed for multi-tenant SaaS architecture.

## Signup Flow Steps

### Step 1: Account Type Selection
**File:** `app/(auth)/signup/account-type.tsx`

Users choose between:
- **Create New Organization**: For business owners starting fresh
- **Join Existing Organization**: For team members joining an existing account

### Step 2A: Organization Setup (New Organization)
**File:** `app/(auth)/signup/organization.tsx`

Collects business information:
- Organization Name (2-100 characters)
- Business Type (Bakery, Restaurant, Cafe, etc.)
- Contact Phone (validated format)
- Business Address (minimum 10 characters)
- Number of Locations (1, 2-5, 6-10, 10+)

### Step 2B: Join Organization (Existing)
**File:** `app/(auth)/signup/join-organization.tsx`

Two methods to join:
- **Invite Code**: Enter 6-digit code from admin
- **Request Invite**: Submit email to request access

### Step 3: Create Account
**File:** `app/(auth)/signup/create-account.tsx`

Personal account creation:
- First Name & Last Name
- Email (validated, globally unique)
- Phone Number
- Password with strength indicator:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one number
  - At least one special character (!@#$%^&*)
- Confirm Password
- Terms & Conditions acceptance

## Database Schema

### Organizations Table
```sql
- id (UUID, primary key)
- name (TEXT)
- business_type (TEXT)
- contact_phone (TEXT)
- business_address (TEXT)
- number_of_locations (TEXT)
- subscription_tier (TEXT, default: 'free')
- subscription_status (TEXT, default: 'active')
- created_at, updated_at (TIMESTAMPTZ)
```

### Users Table
```sql
- id (UUID, references auth.users)
- organization_id (UUID, references organizations)
- email (TEXT, unique)
- full_name (TEXT)
- phone (TEXT)
- role (TEXT: 'admin', 'manager', 'staff')
- theme_preference (TEXT, default: 'auto')
- notification_preferences (JSONB)
- language (TEXT, default: 'en')
- email_verified (BOOLEAN)
- terms_accepted (BOOLEAN)
- terms_accepted_at (TIMESTAMPTZ)
- created_at, updated_at (TIMESTAMPTZ)
```

## Role Assignment Logic

- **First user of organization**: Automatically assigned 'admin' role
- **Subsequent users**: Assigned 'staff' role by default
- **Admins/Managers can**: Promote users to manager or admin roles

## Edge Function: signup-organization

Handles the complete signup process:
1. Creates organization record
2. Creates auth user via Supabase Admin API
3. Creates user profile with appropriate role
4. Sends verification email via Resend API
5. Returns organization and user data

## Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only access data within their organization
- Email verification required for full access
- Password strength validation
- Terms acceptance tracking with timestamp

## Testing Checklist

- [ ] Step 1: Both buttons navigate correctly
- [ ] Step 2A: All form validations work
- [ ] Step 2B: Invite code verification
- [ ] Step 3: Password strength indicator updates
- [ ] Step 3: Form validation catches all errors
- [ ] Database: Organization created successfully
- [ ] Database: User created with correct role
- [ ] Email: Verification email sent
- [ ] Navigation: Back buttons work on all screens
- [ ] UI: Responsive on all device sizes
- [ ] Accessibility: All inputs have labels

## Future Enhancements

- Email verification link handling
- Organization invite system with codes
- Social login options (Google, Apple)
- Multi-language support
- Custom branding per organization
