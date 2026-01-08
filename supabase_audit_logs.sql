-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    action TEXT NOT NULL, -- e.g., 'update_inventory', 'create_product', 'delete_vendor'
    entity_type TEXT NOT NULL, -- e.g., 'store_product', 'master_product', 'master_vendor'
    entity_id UUID NOT NULL,
    changes JSONB, -- Stores 'before' and 'after' states or description of change
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert logs (for their actions)
CREATE POLICY "Users can insert audit logs" ON audit_logs
    FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM users WHERE id = auth.uid()
        )
    );

-- Policy: Users can view audit logs for their organization
CREATE POLICY "Users can view audit logs for their organization" ON audit_logs
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM users WHERE id = auth.uid()
        )
    );

-- Index for faster querying by org and date
CREATE INDEX idx_audit_logs_org_date ON audit_logs (organization_id, created_at DESC);
