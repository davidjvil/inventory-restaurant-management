# Role-Based Access Control (RBAC) Implementation

## User Roles

### 1. Admin
- **Full Access** to all features
- Can manage organization settings
- Can add/edit/delete users
- Can manage all stores
- Can view all vendors
- Can access all reports and analytics
- Can configure system settings

### 2. Store Manager
- Can manage assigned stores
- Can add/edit/delete products
- Can manage vendors
- Can view and manage alerts
- Can access reports for their stores
- Can manage inventory for assigned stores
- Limited user management (can invite staff)

### 3. Standard User (Staff)
- **Limited Access**
- Can view products
- Can update inventory quantities
- Can view dashboard (limited metrics)
- Can access basic settings (profile, password, notifications)
- **Cannot** access:
  - Vendors tab
  - Alerts tab
  - User management
  - Organization settings
  - Store management

## Navigation Menu by Role

### Admin/Store Manager Bottom Tabs:
1. Dashboard
2. Products
3. Vendors (via Orders tab)
4. Alerts
5. Settings

### Standard User Bottom Tabs:
1. Dashboard (limited view)
2. Products
3. Settings

## Implementation Details

### Tab Layout (`app/(tabs)/_layout.tsx`)
- Uses `useAuth()` hook to get current user role
- Conditionally renders tabs based on role
- Hides Vendors and Alerts tabs for standard users using `href: null`

### Settings Screen (`app/(tabs)/settings.tsx`)
- Shows role badge in profile card
- Conditionally renders "Organization" section only for Admin/Manager
- All users can access: Profile, Password, Notifications
- Admin/Manager can access: Organization, Stores, Team Members

### Database Schema
Users table should include:
```sql
- id (uuid, primary key)
- organization_id (uuid, foreign key)
- email (text)
- full_name (text)
- phone (text)
- role (text: 'admin' | 'store_manager' | 'user')
- assigned_store_ids (text[])
- notification_preferences (jsonb)
- theme_preference (text)
- language (text)
- created_at (timestamp)
- updated_at (timestamp)
```

## Testing Role-Based Access

1. **Create Test Users:**
   - Admin: admin@test.com
   - Manager: manager@test.com
   - Staff: staff@test.com

2. **Verify Navigation:**
   - Login as each role
   - Confirm correct tabs are visible
   - Attempt to access restricted routes

3. **Verify Settings:**
   - Check Settings screen shows appropriate sections
   - Confirm restricted settings are hidden for staff

4. **Verify Functionality:**
   - Test CRUD operations for each role
   - Confirm staff cannot access vendor/user management
   - Verify managers can access assigned stores only

## Security Considerations

1. **Frontend Protection:** Tab visibility and UI elements
2. **Backend Protection:** Implement Row Level Security (RLS) in Supabase
3. **API Protection:** Edge functions should verify user role
4. **Route Guards:** Protected routes should check authentication and authorization

## Next Steps

1. Implement RLS policies in Supabase
2. Add role checks in edge functions
3. Create audit logs for sensitive operations
4. Add permission-based feature flags
5. Implement store-specific access control for managers
