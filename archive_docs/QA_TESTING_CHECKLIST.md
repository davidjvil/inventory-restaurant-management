# QA Testing Checklist - Restaurant Inventory Management App

## 1. Authentication & Authorization ✓

### Login/Signup
- [ ] Login with valid credentials works
- [ ] Login with invalid credentials shows error
- [ ] Signup creates new account
- [ ] Password reset flow works
- [ ] Session persists after app restart
- [ ] Auto-logout after token expiration

### Role-Based Access
- [ ] Admin sees all tabs (Dashboard, Products, Vendors, Alerts, Settings)
- [ ] Manager sees all tabs (Dashboard, Products, Vendors, Alerts, Settings)
- [ ] Staff sees limited tabs (Dashboard, Products, Settings)
- [ ] Attempting to access restricted routes redirects appropriately
- [ ] Role badge displays correctly in Settings

## 2. Navigation & UI Responsiveness ✓

### Bottom Tab Navigation
- [ ] All tabs navigate correctly
- [ ] Tab icons display properly
- [ ] Active tab is highlighted
- [ ] Tab bar adapts to different screen sizes
- [ ] Safe area insets work on notched devices

### Back Navigation
- [ ] Back button works on all Settings subpages
- [ ] Router.back() returns to previous screen
- [ ] Navigation stack maintains history
- [ ] Deep links work correctly

### Screen Sizes
- [ ] iPhone SE (small screen) - no overflow
- [ ] iPhone 14 Pro (standard) - proper spacing
- [ ] iPhone 14 Pro Max (large) - no gaps
- [ ] iPad (tablet) - responsive layout
- [ ] Landscape orientation works
- [ ] Portrait orientation works

## 3. Products Management ✓

### View Products
- [ ] Products list loads correctly
- [ ] Product cards display all info (name, SKU, price, quantity)
- [ ] Status badges show correct colors
- [ ] Images load properly
- [ ] Pull-to-refresh works
- [ ] Empty state shows when no products

### Add Product
- [ ] Form validation works (required fields)
- [ ] Image picker works
- [ ] Category dropdown works
- [ ] Vendor selection works
- [ ] Success toast shows after save
- [ ] New product appears in list
- [ ] Form resets after successful save

### Edit Product
- [ ] Form pre-fills with existing data
- [ ] Changes save correctly
- [ ] Success toast shows
- [ ] List updates immediately
- [ ] Cancel button discards changes

### Delete Product
- [ ] Confirmation dialog appears
- [ ] Delete removes product from list
- [ ] Success toast shows
- [ ] Cancel keeps product

### Search & Filter
- [ ] Search bar filters products in real-time
- [ ] Category filter works
- [ ] Status filter works
- [ ] Multiple filters work together
- [ ] Clear filters resets view

## 4. Vendors Management (Admin/Manager Only) ✓

### View Vendors
- [ ] Vendors list loads correctly
- [ ] Vendor cards show all info
- [ ] Pull-to-refresh works
- [ ] Empty state shows when no vendors

### Add Vendor
- [ ] Form validation works
- [ ] All fields save correctly
- [ ] Success toast shows
- [ ] New vendor appears in list

### Edit Vendor
- [ ] Form pre-fills correctly
- [ ] Changes save
- [ ] Success toast shows

### Delete Vendor
- [ ] Confirmation dialog appears
- [ ] Delete works
- [ ] Success toast shows

## 5. Alerts (Admin/Manager Only) ✓

### View Alerts
- [ ] Alerts list loads
- [ ] Severity badges show correct colors (low/medium/high)
- [ ] Unread alerts are highlighted
- [ ] Pull-to-refresh works

### Mark as Read
- [ ] Clicking alert marks as read
- [ ] Visual state updates
- [ ] Count badge updates

### Delete Alert
- [ ] Confirmation dialog appears
- [ ] Delete works
- [ ] Success toast shows

## 6. Settings ✓

### Profile Settings
- [ ] Back button works
- [ ] Form pre-fills with user data
- [ ] Name field is editable
- [ ] Email field is read-only
- [ ] Phone field works
- [ ] Theme selector works (Light/Dark/Auto)
- [ ] Changes save correctly
- [ ] Success toast shows
- [ ] Updates reflect in main Settings screen

### Password Settings
- [ ] Back button works
- [ ] All password fields work
- [ ] Validation checks:
  - [ ] All fields required
  - [ ] Passwords match
  - [ ] Minimum 6 characters
- [ ] Success toast shows
- [ ] Form clears after success

### Notification Settings
- [ ] Back button works
- [ ] All toggles work
- [ ] Settings save correctly
- [ ] Success toast shows
- [ ] Preferences persist after restart

### Organization Settings (Admin/Manager Only)
- [ ] Back button works
- [ ] Organization info displays
- [ ] Subscription tier shows
- [ ] Form fields are editable
- [ ] Changes save correctly
- [ ] Success toast shows

### Stores Management
- [ ] Back button works
- [ ] Stores list loads
- [ ] Store cards display correctly
- [ ] Pull-to-refresh works

### Team Members (Admin/Manager Only)
- [ ] User list loads
- [ ] Role badges display
- [ ] Add user form works
- [ ] Email validation works
- [ ] Role selection works
- [ ] Invite sends successfully

## 7. Dashboard ✓

### Metrics Display
- [ ] All stat cards load
- [ ] Numbers display correctly
- [ ] Icons show properly
- [ ] Cards are clickable
- [ ] Navigation from cards works

### Quick Actions
- [ ] All action buttons work
- [ ] Icons display correctly
- [ ] Navigation works

### Responsive Layout
- [ ] Grid adapts to screen size
- [ ] No overflow on small screens
- [ ] Proper spacing on large screens

## 8. Barcode Scanner ✓

### Scanner Functionality
- [ ] Camera permission requested
- [ ] Camera preview shows
- [ ] Barcode scanning works
- [ ] Product lookup works
- [ ] Manual entry works
- [ ] Success toast shows
- [ ] Error handling works

## 9. Export Reports ✓

### CSV Export
- [ ] Products export works
- [ ] Vendors export works
- [ ] File saves correctly
- [ ] Share sheet appears
- [ ] Success toast shows
- [ ] Error handling works

## 10. In-App Notifications ✓

### Toast Notifications
- [ ] Success toasts show (green)
- [ ] Error toasts show (red)
- [ ] Warning toasts show (yellow)
- [ ] Info toasts show (blue)
- [ ] Auto-dismiss after 3 seconds
- [ ] Manual dismiss works
- [ ] Multiple toasts queue properly
- [ ] Toasts appear within safe area
- [ ] Animation is smooth

### Alert Dialogs
- [ ] Confirmation dialogs show
- [ ] Warning dialogs show
- [ ] Buttons work correctly
- [ ] Cancel dismisses dialog
- [ ] Confirm executes action
- [ ] Backdrop dismisses dialog

## 11. Accessibility ✓

### Text & Contrast
- [ ] All text is readable
- [ ] Sufficient color contrast
- [ ] Font sizes are appropriate
- [ ] Text doesn't overflow

### Touch Targets
- [ ] All buttons are at least 44x44 points
- [ ] Touch targets don't overlap
- [ ] Buttons have visual feedback

### Screen Reader
- [ ] Labels are descriptive
- [ ] Navigation is logical
- [ ] Buttons announce correctly

## 12. Performance ✓

### Load Times
- [ ] Initial app load < 3 seconds
- [ ] Screen transitions are smooth
- [ ] List scrolling is smooth
- [ ] Images load progressively
- [ ] No memory leaks

### Data Management
- [ ] Pagination works for large lists
- [ ] Pull-to-refresh updates data
- [ ] Offline mode shows appropriate message
- [ ] Data caches appropriately

## 13. Error Handling ✓

### Network Errors
- [ ] No internet shows error toast
- [ ] Failed requests show error toast
- [ ] Retry mechanism works
- [ ] Timeout handling works

### Form Errors
- [ ] Validation errors show clearly
- [ ] Required fields are marked
- [ ] Error messages are helpful
- [ ] Errors clear on input change

### Edge Cases
- [ ] Empty states show properly
- [ ] Loading states show
- [ ] Error states show
- [ ] No data states show

## 14. Security ✓

### Data Protection
- [ ] Passwords are hidden
- [ ] Sensitive data is not logged
- [ ] API keys are not exposed
- [ ] Session tokens are secure

### Authorization
- [ ] Protected routes require auth
- [ ] Role checks work correctly
- [ ] Unauthorized access is blocked
- [ ] Session expiration works

## Device Testing Matrix

### iOS Devices
- [ ] iPhone SE (2nd gen) - iOS 15
- [ ] iPhone 12 - iOS 16
- [ ] iPhone 14 Pro - iOS 17
- [ ] iPad Air - iOS 16
- [ ] iPad Pro 12.9" - iOS 17

### Android Devices
- [ ] Samsung Galaxy S21 - Android 12
- [ ] Google Pixel 6 - Android 13
- [ ] OnePlus 9 - Android 12
- [ ] Samsung Galaxy Tab S7 - Android 12

### Orientations
- [ ] Portrait mode
- [ ] Landscape mode
- [ ] Rotation transitions smoothly

## Pre-Production Checklist

- [ ] All critical bugs fixed
- [ ] All features tested on real devices
- [ ] Performance is acceptable
- [ ] No console errors or warnings
- [ ] App Store screenshots prepared
- [ ] App Store description written
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] Support email configured
- [ ] Analytics configured
- [ ] Crash reporting configured
- [ ] Push notifications configured (if applicable)
- [ ] Deep linking configured (if applicable)
- [ ] App icon finalized
- [ ] Splash screen finalized
- [ ] Version number set
- [ ] Build number incremented

## Sign-Off

- [ ] QA Lead Approval
- [ ] Product Manager Approval
- [ ] Development Lead Approval
- [ ] Stakeholder Approval

---

**Testing Notes:**
- Test on actual devices, not just simulators
- Test with different network conditions (WiFi, 4G, 3G, offline)
- Test with different data volumes (empty, few items, many items)
- Test edge cases and error scenarios
- Document any bugs found with screenshots and steps to reproduce
