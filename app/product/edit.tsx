import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/app/lib/supabase';
import { Input } from '@/app/components/Input';
import { Button } from '@/app/components/Button';
import { Toast } from '@/app/components/Toast';
import { useToast } from '@/app/hooks/useToast';
import { COLORS } from '@/app/constants/colors';

export default function EditProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    quantity_on_hand: '',
    reorder_threshold: '',
    min_order_amount: '',
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('store_products')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setForm({
        quantity_on_hand: data.quantity_on_hand?.toString() || '',
        reorder_threshold: data.reorder_threshold?.toString() || '',
        min_order_amount: data.min_order_amount?.toString() || '',
      });
    }
  };

  const handleSave = async () => {
    if (!form.quantity_on_hand) {
      toast.error('Quantity is required');
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('store_products')
      .update({
        quantity_on_hand: parseFloat(form.quantity_on_hand),
        reorder_threshold: parseFloat(form.reorder_threshold) || null,
        min_order_amount: parseFloat(form.min_order_amount) || null,
      })
      .eq('id', id);

    setLoading(false);

    if (error) {
      toast.error('Failed to update product');
    } else {
      toast.success('Product updated successfully');
      setTimeout(() => router.back(), 1500);
    }
  };

  return (
    <View style={styles.container}>
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={toast.hide} />
      <ScrollView contentContainerStyle={styles.content}>
        <Input
          label="Quantity on Hand *"
          value={form.quantity_on_hand}
          onChangeText={(text) => setForm({ ...form, quantity_on_hand: text })}
          keyboardType="numeric"
        />
        <Input
          label="Reorder Threshold"
          value={form.reorder_threshold}
          onChangeText={(text) => setForm({ ...form, reorder_threshold: text })}
          keyboardType="numeric"
        />
        <Input
          label="Minimum Order Amount"
          value={form.min_order_amount}
          onChangeText={(text) => setForm({ ...form, min_order_amount: text })}
          keyboardType="numeric"
        />
        <Button title="Save Changes" onPress={handleSave} loading={loading} fullWidth />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 16 },
});
