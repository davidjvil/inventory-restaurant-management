-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- Function to create organization and link the current user in a single transaction
CREATE OR REPLACE FUNCTION create_organization_and_link_user(
  org_name TEXT,
  business_type TEXT,
  phone TEXT,
  address TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- 1. Create Organization
  INSERT INTO organizations (name, business_type, phone, address, subscription_tier)
  VALUES (org_name, business_type, phone, address, 'trial')
  RETURNING id INTO new_org_id;

  -- 2. Link the current authenticated user to this organization
  UPDATE users
  SET 
    organization_id = new_org_id,
    role = 'admin'
  WHERE id = auth.uid();

  -- 3. Return the new organization ID
  RETURN new_org_id;
END;
$$;
