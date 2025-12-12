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
  const [department, setDepartment] = useState('');
  const [vendor, setVendor] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [threshold, setThreshold] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert('Error', 'Product Name is required');
      return;
    }

    setLoading(true);
    try {
      if (user?.role === 'admin' || user?.role === 'shop_manager') {
        const { data: masterProduct, error: masterError } = await supabase
          .from('master_products')
          .insert({
            organization_id: user.organization_id,
            name,
            sku,
            category,
            department,
            vendor,
            unit,
            base_price: parseFloat(price) || 0,
          })
          .select()
          .single();

        if (masterError) throw masterError;

        await supabase.from('store_products').insert({
          store_id: user.assigned_store_ids?.[0],
          product_id: masterProduct.id,
          quantity_on_hand: 0,
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

      <Input
        label="Product Name*"
        value={name}
        onChangeText={setName}
        placeholder="e.g., Organic Tomatoes"
      />

      <Input
        label="Vendor"
        value={vendor}
        onChangeText={setVendor}
        placeholder="e.g., Local Farms Inc"
      />

      <Input
        label="Unit"
        value={unit}
        onChangeText={setUnit}
        placeholder="e.g., lbs, gallons"
      />

      <Input
        label="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="0.00"
      />

      <Input
        label="Reorder Threshold"
        value={threshold}
        onChangeText={setThreshold}
        keyboardType="numeric"
        placeholder="0"
      />

      <Input
        label="Category"
        value={category}
        onChangeText={setCategory}
        placeholder="e.g., Produce"
      />

      <Input
        label="Department"
        value={department}
        onChangeText={setDepartment}
        placeholder="e.g., Kitchen"
      />

      <Input
        label="SKU"
        value={sku}
        onChangeText={setSku}
        placeholder="e.g., PROD-001"
      />

      <Button title="Add Product" onPress={handleSubmit} loading={loading} />
      <Button title="Cancel" onPress={() => router.back()} variant="secondary" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24, paddingTop: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text_primary, marginBottom: 16 },
});
