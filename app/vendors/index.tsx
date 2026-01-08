import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/Card';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function VendorsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [vendors, setVendors] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('master_vendors')
      .select('*')
      .eq('organization_id', user.organization_id)
      .order('name');

    if (data) setVendors(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVendors();
    setRefreshing(false);
  };

  const renderVendor = ({ item }: { item: any }) => (
    <Card style={styles.vendorCard} onPress={() => router.push(`/vendors/${item.id}`)}>
      <View style={styles.vendorHeader}>
        <Ionicons name="business" size={24} color={COLORS.primary} />
        <View style={styles.vendorInfo}>
          <Text style={styles.vendorName}>{item.name}</Text>
          <Text style={styles.vendorContact}>{item.contact}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={COLORS.gray[400]} />
      </View>
      <View style={styles.vendorDetails}>
        <Text style={styles.detailText}>Delivery: {item.delivery_date || 'N/A'}</Text>
        <Text style={styles.detailText}>Order Days: {item.order_dates || 'N/A'}</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={vendors}
        renderItem={renderVendor}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No vendors yet</Text>
          </View>
        }
      />
      {user?.role === 'admin' && (
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/vendors/add')}>
          <Ionicons name="add" size={28} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16, gap: 12 },
  vendorCard: { padding: 16 },
  vendorHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  vendorInfo: { flex: 1, marginLeft: 12 },
  vendorName: { fontSize: 16, fontWeight: '600', color: COLORS.text.primary, marginBottom: 4 },
  vendorContact: { fontSize: 14, color: COLORS.text.secondary },
  vendorDetails: { gap: 4 },
  detailText: { fontSize: 12, color: COLORS.text.secondary },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, color: COLORS.text.secondary },
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
