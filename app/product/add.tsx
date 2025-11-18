import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/app/contexts/AuthContext';
import { Input } from '@/app/components/Input';
import { Button } from '@/app/components/Button';
import { COLORS } from '@/app/constants/colors';

export default function AddProductScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [threshold, setThreshold] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !sku) {
      Alert.alert('Error', 'Name and SKU are required');
      return;
    }

    setLoading(true);
    try {
      // Create master product (admin only)
      if (user?.role === 'admin') {
        const { data: masterProduct, error: masterError } = await supabase
          .from('master_products')
          .insert({
            organization_id: user.organization_id,
            name,
            sku,
            category,
            unit,
            base_price: parseFloat(basePrice) || 0,
          })
          .select()
          .single();

        if (masterError) throw masterError;

        // Add to store
        await supabase.from('store_products').insert({
          store_id: user.assigned_store_ids?.[0],
          product_id: masterProduct.id,
          quantity_on_hand: 0,
          minimum_order_amount: parseFloat(minOrder) || 0,
          reorder_threshold: parseFloat(threshold) || 0,
        });
      }

      Alert.alert('Success', 'Product added successfully');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Add New Product</Text>

      <Input label="Product Name*" value={name} onChangeText={setName} placeholder="e.g., Organic Tomatoes" />
      <Input label="SKU*" value={sku} onChangeText={setSku} placeholder="e.g., PROD-001" />
      <Input label="Category" value={category} onChangeText={setCategory} placeholder="e.g., Produce" />
      <Input label="Unit" value={unit} onChangeText={setUnit} placeholder="e.g., lbs, gallons" />
      <Input label="Base Price" value={basePrice} onChangeText={setBasePrice} keyboardType="numeric" placeholder="0.00" />
      <Input label="Min Order Amount" value={minOrder} onChangeText={setMinOrder} keyboardType="numeric" placeholder="0" />
      <Input label="Reorder Threshold" value={threshold} onChangeText={setThreshold} keyboardType="numeric" placeholder="0" />

      <Button title="Add Product" onPress={handleSubmit} loading={loading} fullWidth />
      <Button title="Cancel" onPress={() => router.back()} variant="outline" fullWidth />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: 16 },
});
