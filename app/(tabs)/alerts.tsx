import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function AlertsScreen() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('alerts')
      .select('*')
      .eq('organization_id', user.organization_id)
      .order('created_at', { ascending: false });

    if (data) setAlerts(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  const markAsRead = async (alertId: string) => {
    await supabase.from('alerts').update({ is_read: true }).eq('id', alertId);
    fetchAlerts();
  };

  const renderAlert = ({ item }: { item: any }) => (
    <Card style={[styles.alertCard, !item.is_read && styles.unread]} onPress={() => markAsRead(item.id)}>
      <View style={styles.alertHeader}>
        <Ionicons 
          name={item.alert_type === 'low_stock' ? 'alert-circle' : 'information-circle'} 
          size={24} 
          color={item.severity === 'high' ? COLORS.danger : COLORS.warning} 
        />
        <StatusBadge status={item.severity} label={item.severity.toUpperCase()} />
      </View>
      <Text style={styles.alertMessage}>{item.message}</Text>
      <Text style={styles.alertDate}>{new Date(item.created_at).toLocaleString()}</Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="checkmark-circle" size={64} color={COLORS.success} />
            <Text style={styles.emptyText}>No alerts</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16, gap: 12 },
  alertCard: { padding: 16 },
  unread: { borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  alertMessage: { fontSize: 14, color: COLORS.text.primary, marginBottom: 8 },
  alertDate: { fontSize: 12, color: COLORS.text.secondary },
  empty: { padding: 60, alignItems: 'center' },
  emptyText: { fontSize: 16, color: COLORS.text.secondary, marginTop: 16 },
});
