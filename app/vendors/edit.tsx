import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Toast } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { COLORS } from '@/constants/colors';

export default function EditVendorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    contact: '',
    delivery_date: '',
    order_dates: '',
    address: '',
  });

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const fetchVendor = async () => {
    const { data } = await supabase
      .from('master_vendors')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setForm({
        name: data.name || '',
        contact: data.contact || '',
        delivery_date: data.delivery_date || '',
        order_dates: data.order_dates || '',
        address: data.address || '',
      });
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.contact || !form.delivery_date) {
      toast.error('Name, contact, and delivery date are required');
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('master_vendors')
      .update(form)
      .eq('id', id);

    setLoading(false);

    if (error) {
      toast.error('Failed to update vendor');
    } else {
      toast.success('Vendor updated successfully');
      setTimeout(() => router.back(), 1500);
    }
  };

  return (
    <View style={styles.container}>
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={toast.hide} />
      <ScrollView contentContainerStyle={styles.content}>
        <Input label="Vendor Name *" value={form.name} onChangeText={(text) => setForm({ ...form, name: text })} />
        <Input label="Contact *" value={form.contact} onChangeText={(text) => setForm({ ...form, contact: text })} />
        <Input label="Delivery Date *" value={form.delivery_date} onChangeText={(text) => setForm({ ...form, delivery_date: text })} />
        <Input label="Order Dates" value={form.order_dates} onChangeText={(text) => setForm({ ...form, order_dates: text })} />
        <Input label="Address" value={form.address} onChangeText={(text) => setForm({ ...form, address: text })} multiline />
        <Button title="Save Changes" onPress={handleSave} loading={loading} fullWidth />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 16 },
});
