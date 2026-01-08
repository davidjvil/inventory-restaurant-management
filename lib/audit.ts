import { supabase } from './supabase';

interface AuditLogParams {
    action: string;
    entityType: string;
    entityId: string;
    changes?: Record<string, any>;
}

/**
 * Logs a user action to the audit_logs table.
 * 
 * @param params AuditLogParams
 * @returns Promise<{ error: any }>
 */
export async function logAction({ action, entityType, entityId, changes }: AuditLogParams) {
    try {
        // 1. Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.warn('Audit Log Skipped: No authenticated user found.');
            return { error: 'No user' };
        }

        // 2. Get user's profile to retrieve organization_id
        // Optimally, this should be cached or available in context, but for safety we fetch or check metadata
        // For now, we'll query the users table briefly. 
        // Optimization: If you have user metadata with org_id, use that.

        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('organization_id')
            .eq('id', user.id)
            .single();

        if (profileError || !userProfile?.organization_id) {
            console.warn('Audit Log Skipped: User has no organization linked.');
            return { error: 'No organization' };
        }

        // 3. Insert log
        const { error: insertError } = await supabase
            .from('audit_logs')
            .insert({
                organization_id: userProfile.organization_id,
                user_id: user.id,
                action,
                entity_type: entityType,
                entity_id: entityId,
                changes
            });

        if (insertError) {
            console.error('Audit Log Failed:', insertError);
            return { error: insertError };
        }

        return { error: null };

    } catch (err) {
        console.error('Audit Log Exception:', err);
        return { error: err };
    }
}
