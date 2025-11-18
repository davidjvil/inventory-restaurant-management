export type UserRole = 'admin' | 'store_manager' | 'user';

export interface User {
  id: string;
  organization_id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: UserRole;
  assigned_store_ids?: string[];
  notification_preferences?: any;
  theme_preference?: 'light' | 'dark' | 'auto';
  language?: string;
  created_at: string;
  updated_at: string;
}


export interface Organization {
  id: string;
  name: string;
  business_type?: string;
  phone?: string;
  address?: string;
  invite_code?: string;
  number_of_locations?: string;
  subscription_tier: string;
  subscription_status: string;
  trial_ends_at?: string;
  created_at: string;
  updated_at: string;
}


export interface Store {
  id: string;
  organization_id: string;
  name: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface MasterVendor {
  id: string;
  organization_id: string;
  name: string;
  contact?: string;
  delivery_date?: string;
  order_dates?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface MasterProduct {
  id: string;
  organization_id: string;
  name: string;
  sku: string;
  category?: string;
  vendor_id?: string;
  unit?: string;
  base_price?: number;
  description?: string;
  notes?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface StoreProduct {
  id: string;
  store_id: string;
  product_id: string;
  quantity_on_hand: number;
  minimum_order_amount?: number;
  delivery_days?: string;
  order_days?: string;
  reorder_threshold?: number;
  last_inventory_check?: string;
  created_at: string;
  updated_at: string;
  product?: MasterProduct;
}

export interface Alert {
  id: string;
  organization_id: string;
  store_id?: string;
  product_id?: string;
  alert_type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  is_read: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  store_id: string;
  vendor_id?: string;
  status: string;
  total_amount?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}
