import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useAuth } from '@/app/contexts/AuthContext';
import { supabase } from '@/app/lib/supabase';
import { Card } from '@/app/components/Card';
import { StatusBadge } from '@/app/components/StatusBadge';
import { Button } from '@/app/components/Button';
import { COLORS } from '@/app/constants/colors';

export default function OrdersScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('orders')
      .select('*, vendor:master_vendors(name)')
      .eq('store_id', user.assigned_store_ids?.[0] || '')
      .order('created_at', { ascending: false });

    if (data) setOrders(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const renderOrder = ({ item }: { item: any }) => (
    <Card style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id.slice(0, 8)}</Text>
        <StatusBadge 
          status={item.status === 'pending' ? 'warning' : 'healthy'} 
          label={item.status.toUpperCase()} 
        />
      </View>
      <Text style={styles.vendor}>{item.vendor?.name || 'Unknown Vendor'}</Text>
      <Text style={styles.amount}>${item.total_amount?.toFixed(2) || '0.00'}</Text>
      <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
      <View style={styles.actions}>
        <Button title="View Details" onPress={() => {}} variant="outline" />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16, gap: 12 },
  orderCard: { padding: 16 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderId: { fontSize: 16, fontWeight: '600', color: COLORS.text.primary },
  vendor: { fontSize: 14, color: COLORS.text.secondary, marginBottom: 8 },
  amount: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 4 },
  date: { fontSize: 12, color: COLORS.text.secondary, marginBottom: 12 },
  actions: { marginTop: 8 },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, color: COLORS.text.secondary },
});
