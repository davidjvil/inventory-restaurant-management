-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- Function to calculate dashboard statistics on the server side
-- This avoids fetching thousands of records to the phone just to count them.

CREATE OR REPLACE FUNCTION get_dashboard_stats(target_store_id UUID)
RETURNS TABLE (
  total_products BIGINT,
  low_stock BIGINT,
  pending_orders BIGINT,
  total_value NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY SELECT
    -- 1. Total Products Count
    (SELECT count(*) FROM store_products WHERE store_id = target_store_id),
    
    -- 2. Low Stock Count
    (SELECT count(*) FROM store_products WHERE store_id = target_store_id AND quantity_on_hand <= COALESCE(reorder_threshold, 0)),
    
    -- 3. Pending Orders (Adjust filter if orders needs store_id)
    -- Assuming Orders are filtered by RLS, but if you have a store_id column, uncomment the AND below:
    (SELECT count(*) FROM orders WHERE status = 'pending' /* AND store_id = target_store_id */),
    
    -- 4. Total Value Calculation
    (SELECT COALESCE(SUM(sp.quantity_on_hand * mp.base_price), 0)
     FROM store_products sp
     JOIN master_products mp ON sp.master_product_id = mp.id
     WHERE sp.store_id = target_store_id);
END;
$$;
