import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { supabase } from '@/app/lib/supabase';
import { Card } from '@/app/components/Card';
import { StatusBadge } from '@/app/components/StatusBadge';
import { COLORS } from '@/app/constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const router = useRouter();

  const { user } = useAuth();
  const [stats, setStats] = useState({ totalProducts: 0, lowStock: 0, pendingOrders: 0, totalValue: 0 });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!user) return;

    const { data: products } = await supabase
      .from('store_products')
      .select('*, product:master_products(base_price)')
      .eq('store_id', user.assigned_store_ids?.[0] || '');

    const lowStock = products?.filter(p => p.quantity_on_hand <= (p.reorder_threshold || 0)).length || 0;
    const totalValue = products?.reduce((sum, p) => sum + (p.quantity_on_hand * (p.product?.base_price || 0)), 0) || 0;

    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'pending');

    setStats({
      totalProducts: products?.length || 0,
      lowStock,
      pendingOrders: orders?.length || 0,
      totalValue,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.greeting}>Hello, {user?.full_name || 'User'}!</Text>
        <Text style={styles.subtitle}>Here's your inventory overview</Text>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/(tabs)/products')}>
            <Card style={styles.statCardInner}>
              <Ionicons name="cube-outline" size={32} color={COLORS.primary} />
              <Text style={styles.statValue}>{stats.totalProducts}</Text>
              <Text style={styles.statLabel}>Total Products</Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/(tabs)/alerts')}>
            <Card style={styles.statCardInner}>
              <Ionicons name="alert-circle-outline" size={32} color={COLORS.danger} />
              <Text style={styles.statValue}>{stats.lowStock}</Text>
              <Text style={styles.statLabel}>Low Stock</Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/(tabs)/orders')}>
            <Card style={styles.statCardInner}>
              <Ionicons name="cart-outline" size={32} color={COLORS.accent} />
              <Text style={styles.statValue}>{stats.pendingOrders}</Text>
              <Text style={styles.statLabel}>Pending Orders</Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statCard}>
            <Card style={styles.statCardInner}>
              <Ionicons name="cash-outline" size={32} color={COLORS.success} />
              <Text style={styles.statValue}>${stats.totalValue.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Inventory Value</Text>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/product/add')}>
              <Ionicons name="add-circle" size={32} color={COLORS.primary} />
              <Text style={styles.actionText}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/scanner')}>
              <Ionicons name="barcode" size={32} color={COLORS.primary} />
              <Text style={styles.actionText}>Scan Item</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/reports/export')}>
              <Ionicons name="download" size={32} color={COLORS.primary} />
              <Text style={styles.actionText}>Export</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: 4 },
  subtitle: { fontSize: 16, color: COLORS.text.secondary, marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: { width: '48%' },
  statCardInner: { alignItems: 'center', padding: 20 },
  statValue: { fontSize: 32, fontWeight: 'bold', color: COLORS.text.primary, marginTop: 8 },
  statLabel: { fontSize: 14, color: COLORS.text.secondary, marginTop: 4 },
  quickActions: { marginTop: 8 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: 16 },
  actionsGrid: { flexDirection: 'row', gap: 12 },
  actionCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: 12, padding: 20, alignItems: 'center', gap: 8 },
  actionText: { fontSize: 14, fontWeight: '600', color: COLORS.text.primary },
});

