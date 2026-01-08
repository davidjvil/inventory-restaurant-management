import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Toast } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function VendorDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const toast = useToast();
  const [vendor, setVendor] = useState<any>(null);

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const fetchVendor = async () => {
    const { data } = await supabase
      .from('master_vendors')
      .select('*')
      .eq('id', id)
      .single();

    if (data) setVendor(data);
  };

  const handleDelete = () => {
    Alert.alert('Delete Vendor', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('master_vendors').delete().eq('id', id);
          if (error) {
            toast.error('Failed to delete vendor');
          } else {
            toast.success('Vendor deleted');
            setTimeout(() => router.back(), 1500);
          }
        },
      },
    ]);
  };

  if (!vendor) return null;

  return (
    <View style={styles.container}>
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={toast.hide} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.label}>Vendor Name</Text>
          <Text style={styles.value}>{vendor.name}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.label}>Contact</Text>
          <Text style={styles.value}>{vendor.contact}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.label}>Delivery Date</Text>
          <Text style={styles.value}>{vendor.delivery_date}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.label}>Order Dates</Text>
          <Text style={styles.value}>{vendor.order_dates || 'N/A'}</Text>
        </Card>
        {vendor.address && (
          <Card style={styles.card}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{vendor.address}</Text>
          </Card>
        )}
        {user?.role === 'admin' && (
          <View style={styles.actions}>
            <Button title="Edit" onPress={() => router.push(`/vendors/edit?id=${id}`)} fullWidth />
            <Button title="Delete" onPress={handleDelete} variant="danger" fullWidth />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 12 },
  card: { padding: 16 },
  label: { fontSize: 12, color: COLORS.text.secondary, marginBottom: 4 },
  value: { fontSize: 16, color: COLORS.text.primary, fontWeight: '500' },
  actions: { gap: 12, marginTop: 8 },
});
