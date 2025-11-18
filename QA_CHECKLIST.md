# Restaurant Inventory Management - QA & Testing Checklist

## 🎯 Pre-Deployment Setup

### Supabase Configuration
- [ ] Create Supabase project at https://supabase.com
- [ ] Copy project URL and anon key to `app/lib/supabase.ts`
- [ ] Run all SQL migrations from `SETUP_GUIDE.md`
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Add RESEND_API_KEY to Supabase Edge Function Secrets

### Environment Setup
- [ ] Install dependencies: `npm install`
- [ ] Install additional packages: `npx expo install expo-barcode-scanner expo-file-system expo-sharing @react-native-picker/picker`
- [ ] Test on iOS simulator: `npx expo start --ios`
- [ ] Test on Android emulator: `npx expo start --android`

## 📱 Device Compatibility Testing

### Screen Sizes
- [ ] iPhone SE (small screen - 375x667)
- [ ] iPhone 14 Pro (standard - 393x852)
- [ ] iPhone 14 Pro Max (large - 430x932)
- [ ] iPad (tablet - 768x1024)
- [ ] Android small (360x640)
- [ ] Android large (412x915)

### Orientations
- [ ] Portrait mode (all screens)
- [ ] Landscape mode (tablets)
- [ ] SafeAreaView working on notched devices
- [ ] No content cutoff at bottom or top

## 🔐 Authentication & User Roles

### Login/Signup
- [ ] Login with valid credentials
- [ ] Login error handling (wrong password)
- [ ] Signup with new account
- [ ] Email validation
- [ ] Password requirements
- [ ] In-app Toast notifications (no native alerts)

### Role-Based Access
- [ ] Admin: Full access to all features
- [ ] Manager: Access to assigned stores
- [ ] Staff: Limited to inventory updates
- [ ] Proper permission checks on all screens

## 🏠 Dashboard

### Stats Display
- [ ] Total Products count accurate
- [ ] Low Stock count correct
- [ ] Pending Orders count
- [ ] Inventory Value calculation
- [ ] Pull-to-refresh functionality
- [ ] Responsive grid layout (2 columns)

### Quick Actions
- [ ] "Add Product" navigates correctly
- [ ] "Scan Item" opens barcode scanner
- [ ] "Export" opens export screen
- [ ] All icons display properly
- [ ] Touch targets minimum 44x44pt

## 📦 Products Management

### Product List
- [ ] All products load correctly
- [ ] Search functionality works
- [ ] Filter by category
- [ ] Sort options functional
- [ ] Product images display
- [ ] Quantity on hand visible
- [ ] Low stock badges appear

### Add Product
- [ ] Form validation (required fields)
- [ ] SKU uniqueness check
- [ ] Image upload (if implemented)
- [ ] Category picker works
- [ ] Vendor selection
- [ ] Success toast notification
- [ ] Navigate back after save

### Edit Product
- [ ] Form pre-populated with data
- [ ] All fields editable
- [ ] Save changes successful
- [ ] Toast confirmation
- [ ] Data persists after refresh

### Delete Product
- [ ] In-app AlertDialog appears
- [ ] Cancel button works
- [ ] Delete button removes product
- [ ] Success toast shown
- [ ] List updates immediately

## 🏪 Vendors Management

### Vendor List
- [ ] All vendors display
- [ ] Contact information visible
- [ ] Add vendor button works
- [ ] Edit vendor navigation

### Add/Edit Vendor
- [ ] Form validation
- [ ] Required fields marked
- [ ] Save successful
- [ ] Toast notifications
- [ ] Data persistence

### Delete Vendor
- [ ] AlertDialog confirmation
- [ ] Successful deletion
- [ ] Toast notification
- [ ] List refresh

## 👥 User Management (Admin Only)

### User List
- [ ] All team members display
- [ ] Role badges visible
- [ ] Avatar initials correct
- [ ] Add user button (admin only)
- [ ] Access denied for non-admins

### Add User
- [ ] Email validation
- [ ] Role picker works
- [ ] Invite sent successfully
- [ ] Toast confirmation
- [ ] Email received (via Resend)

## 📊 Orders & Alerts

### Orders Screen
- [ ] Pending orders list
- [ ] Order calculation correct
- [ ] Formula 1: Min Order - Qty on Hand
- [ ] Formula 2: Threshold trigger
- [ ] Status badges
- [ ] Create order functionality

### Alerts Screen
- [ ] Low stock alerts display
- [ ] Alert thresholds working
- [ ] In-app notifications only
- [ ] Mark as read functionality
- [ ] Alert count badge

## 🔍 Barcode Scanner

### Scanner Functionality
- [ ] Camera permission requested
- [ ] Camera view displays
- [ ] Barcode detection works
- [ ] Product found: navigates to detail
- [ ] Product not found: error toast
- [ ] Scan again button works
- [ ] Close button returns to previous screen

### Supported Formats
- [ ] UPC-A
- [ ] EAN-13
- [ ] Code 128
- [ ] QR codes (if applicable)

## 📥 Export Reports

### CSV Export
- [ ] Products export generates file
- [ ] Vendors export generates file
- [ ] File contains correct data
- [ ] Share dialog appears
- [ ] File can be opened in Excel/Sheets
- [ ] Success toast notification

### Report Types
- [ ] Inventory report
- [ ] Low stock report
- [ ] Vendor contact list
- [ ] Order history (if implemented)

## ⚙️ Settings

### Profile Settings
- [ ] Current info displayed
- [ ] Edit full name
- [ ] Edit email
- [ ] Save changes successful
- [ ] Toast confirmation
- [ ] Data persists

### Change Password
- [ ] Current password validation
- [ ] New password requirements
- [ ] Confirm password match
- [ ] Success toast
- [ ] Error handling

### Notifications Settings
- [ ] Low stock alerts toggle
- [ ] Email notifications toggle
- [ ] Push notifications (if implemented)
- [ ] Settings save successfully
- [ ] Toast confirmation

### Sign Out
- [ ] AlertDialog confirmation
- [ ] Cancel button works
- [ ] Sign out successful
- [ ] Navigate to login
- [ ] Session cleared

## 🎨 UI/UX Polish

### In-App Notifications
- [ ] Toast appears at top with SafeArea
- [ ] Success toasts (green)
- [ ] Error toasts (red)
- [ ] Warning toasts (yellow)
- [ ] Info toasts (blue)
- [ ] Auto-dismiss after 4 seconds
- [ ] Readable text (white on color)
- [ ] No native OS alerts used

### AlertDialog Component
- [ ] Modal overlay dims background
- [ ] Dialog centered on screen
- [ ] Icon matches type (info/warning/danger)
- [ ] Buttons clearly labeled
- [ ] Cancel vs destructive styling
- [ ] Touch outside to close (optional)
- [ ] Responsive on all screen sizes

### Responsive Layouts
- [ ] No horizontal scrolling
- [ ] No content cutoff
- [ ] Proper spacing on small screens
- [ ] Touch targets adequate size
- [ ] Text readable (min 14px)
- [ ] Images scale properly
- [ ] Forms fit on screen

### Accessibility
- [ ] Color contrast ratio >4.5:1
- [ ] Touch targets >44x44pt
- [ ] Text scalable
- [ ] Screen reader support (if implemented)
- [ ] Focus indicators visible
- [ ] Error messages clear

## 🚀 Performance

### Loading States
- [ ] Skeleton screens or spinners
- [ ] Loading indicators on buttons
- [ ] Pull-to-refresh works smoothly
- [ ] No frozen UI during operations

### Data Management
- [ ] Efficient queries (no over-fetching)
- [ ] Pagination for long lists
- [ ] Debounced search
- [ ] Optimistic UI updates
- [ ] Error recovery

## 🔒 Security

### Authentication
- [ ] JWT tokens secure
- [ ] Session persistence
- [ ] Auto-logout on token expiry
- [ ] Protected routes work

### Data Access
- [ ] RLS policies enforced
- [ ] Users see only their stores
- [ ] Admin-only features protected
- [ ] No unauthorized API access

## 📱 App Store Readiness

### iOS
- [ ] App builds successfully
- [ ] No console errors
- [ ] App icon set
- [ ] Splash screen configured
- [ ] Privacy policy link
- [ ] Terms of service link

### Android
- [ ] APK builds successfully
- [ ] Permissions declared in manifest
- [ ] App icon set (all sizes)
- [ ] Splash screen configured
- [ ] Privacy policy link
- [ ] Terms of service link

## 📝 Documentation

- [ ] README.md complete
- [ ] SETUP_GUIDE.md accurate
- [ ] API_DOCUMENTATION.md updated
- [ ] DEPLOYMENT.md clear
- [ ] Sample data scripts work
- [ ] Environment variables documented

## ✅ Final Checks

- [ ] All features tested on real devices
- [ ] No critical bugs remaining
- [ ] Performance acceptable
- [ ] User feedback incorporated
- [ ] Ready for beta testing
- [ ] Ready for production deployment

---

## 🐛 Known Issues

Document any known issues or limitations here:

1. 
2. 
3. 

## 📞 Support

For issues or questions:
- Check documentation in `/docs`
- Review Supabase logs
- Test with sample data
- Verify environment variables
