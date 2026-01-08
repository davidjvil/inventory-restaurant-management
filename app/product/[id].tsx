import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { logAction } from '@/lib/audit';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { COLORS } from '@/constants/colors';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('store_products')
      .select('*, product:master_products(*), store:stores(*)')
      .eq('id', id)
      .single();

    if (data) {
      setProduct(data);
      setQuantity(data.quantity_on_hand?.toString() || '0');
    }
  };

  const handleUpdateQuantity = async () => {
    if (!product) return;

    setLoading(true);
    try {
      const newQty = parseFloat(quantity);
      const oldQty = product.quantity_on_hand;

      // Update quantity
      await supabase
        .from('store_products')
        .update({
          quantity_on_hand: newQty,
          last_inventory_check: new Date().toISOString()
        })
        .eq('id', product.id);

      // Log inventory check (Legacy table, keep for now)
      await supabase.from('inventory_checks').insert({
        store_product_id: product.id,
        user_id: user?.id,
        previous_quantity: oldQty,
        new_quantity: newQty,
      });

      // [NEW] Audit Log
      await logAction({
        action: 'update_inventory',
        entityType: 'store_product',
        entityId: product.id,
        changes: {
          previous_quantity: oldQty,
          new_quantity: newQty,
          product_name: product.product?.name
        }
      });

      // Check if alert needed
      if (newQty <= (product.reorder_threshold || 0)) {
        await supabase.from('alerts').insert({
          organization_id: user?.organization_id,
          store_id: product.store_id,
          product_id: product.product_id,
          alert_type: 'low_stock',
          message: `Low stock: ${product.product?.name} at ${product.store?.name}`,
          severity: 'high',
        });
      }

      Alert.alert('Success', 'Quantity updated successfully');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <Image source={{ uri: product.product?.image_url }} style={styles.image} />
        <Text style={styles.name}>{product.product?.name}</Text>
        <Text style={styles.sku}>SKU: {product.product?.sku}</Text>
        <StatusBadge
          status={product.quantity_on_hand <= (product.reorder_threshold || 0) ? 'critical' : 'healthy'}
          label={product.quantity_on_hand <= (product.reorder_threshold || 0) ? 'Low Stock' : 'In Stock'}
        />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Inventory Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Current Quantity:</Text>
          <Text style={styles.value}>{product.quantity_on_hand} {product.product?.unit}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Reorder Threshold:</Text>
          <Text style={styles.value}>{product.reorder_threshold || 0} {product.product?.unit}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Min Order Amount:</Text>
          <Text style={styles.value}>{product.minimum_order_amount || 0} {product.product?.unit}</Text>
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Update Quantity</Text>
        <Input
          label="New Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="Enter quantity"
        />
        <Button title="Update Quantity" onPress={handleUpdateQuantity} loading={loading} fullWidth />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 16 },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 16 },
  name: { fontSize: 24, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: 4 },
  sku: { fontSize: 14, color: COLORS.text.secondary, marginBottom: 12 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text.primary, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: 14, color: COLORS.text.secondary },
  value: { fontSize: 14, fontWeight: '600', color: COLORS.text.primary },
});
