import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Toast } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Store } from '@/types';

export default function StoresScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('organization_id', user?.organization_id)
      .order('name');

    if (error) {
      toast.error('Failed to load stores');
    } else {
      setStores(data || []);
    }
    setLoading(false);
  };

  const renderStore = ({ item }: { item: Store }) => (
    <Card style={styles.storeCard}>
      <View style={styles.storeHeader}>
        <Ionicons name="location" size={24} color={COLORS.primary} />
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{item.name}</Text>
          {item.address && <Text style={styles.storeAddress}>{item.address}</Text>}
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={toast.hide} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Stores</Text>
      </View>

      <FlatList
        data={stores}
        renderItem={renderStore}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchStores}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="location-outline" size={64} color={COLORS.gray[300]} />
            <Text style={styles.emptyText}>No stores found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  backText: { fontSize: 16, color: COLORS.primary, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text.primary },
  list: { padding: 16, gap: 12 },
  storeCard: { padding: 16 },
  storeHeader: { flexDirection: 'row', gap: 12 },
  storeInfo: { flex: 1 },
  storeName: { fontSize: 18, fontWeight: '600', color: COLORS.text.primary, marginBottom: 4 },
  storeAddress: { fontSize: 14, color: COLORS.text.secondary },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 64 },
  emptyText: { fontSize: 16, color: COLORS.text.secondary, marginTop: 16 },
});
