import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { COLORS } from '@/constants/colors';
import { StoreProduct } from '@/types';
import { Ionicons } from '@expo/vector-icons';

import { SkeletonLoader } from '@/components/SkeletonLoader';

export default function ProductsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('store_products')
        .select('*, product:master_products(*)')
        .eq('store_id', user.assigned_store_ids?.[0] || '');

      if (data) setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const getStockStatus = (item: any): { status: 'healthy' | 'warning' | 'critical', label: string } => {
    const qty = item.quantity_on_hand;
    const threshold = item.reorder_threshold || 0;
    if (qty <= threshold) return { status: 'critical', label: 'Critical' };
    if (qty <= threshold * 1.5) return { status: 'warning', label: 'Low' };
    return { status: 'healthy', label: 'Good' };
  };

  const renderProduct = ({ item }: { item: any }) => {
    const stockStatus = getStockStatus(item);

    return (
      <Card style={styles.productCard} onPress={() => router.push(`/product/${item.id}`)}>
        <View style={styles.productRow}>
          <Image source={{ uri: item.product?.image_url }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.product?.name}</Text>
            <Text style={styles.productSku}>SKU: {item.product?.sku}</Text>
            <StatusBadge status={stockStatus.status} label={stockStatus.label} />
          </View>
          <View style={styles.productQty}>
            <Text style={styles.qtyValue}>{item.quantity_on_hand}</Text>
            <Text style={styles.qtyLabel}>{item.product?.unit}</Text>
          </View>
        </View>
      </Card>
    );
  };

  if (loading && products.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.list}>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} style={styles.productCard}>
              <View style={styles.productRow}>
                <SkeletonLoader width={60} height={60} borderRadius={8} style={{ marginRight: 12 }} />
                <View style={{ flex: 1, gap: 8 }}>
                  <SkeletonLoader width="70%" height={20} />
                  <SkeletonLoader width="40%" height={16} />
                </View>
              </View>
            </Card>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/product/add')}>
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16, gap: 12 },
  productCard: { padding: 12 },
  productRow: { flexDirection: 'row', alignItems: 'center' },
  productImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: '600', color: COLORS.text.primary, marginBottom: 4 },
  productSku: { fontSize: 12, color: COLORS.text.secondary, marginBottom: 6 },
  productQty: { alignItems: 'center' },
  qtyValue: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  qtyLabel: { fontSize: 12, color: COLORS.text.secondary },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
