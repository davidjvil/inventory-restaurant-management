import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Toast } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function OrganizationSettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [org, setOrg] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    fetchOrganization();
  }, []);

  const fetchOrganization = async () => {
    if (!user?.organization_id) return;
    
    const { data } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', user.organization_id)
      .single();
    
    if (data) {
      setOrg(data);
      setForm({
        name: data.name || '',
        address: data.address || '',
        phone: data.phone || '',
      });
    }
  };

  const handleSave = async () => {
    if (!form.name) {
      toast.error('Organization name is required');
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('organizations')
      .update({
        name: form.name,
        address: form.address,
        phone: form.phone,
      })
      .eq('id', user?.organization_id);

    setLoading(false);

    if (error) {
      toast.error('Failed to update organization');
    } else {
      toast.success('Organization updated successfully');
      setTimeout(() => router.back(), 1500);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={toast.hide} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.infoCard}>
          <Text style={styles.label}>Subscription</Text>
          <Text style={styles.value}>{org?.subscription_tier || 'Free'}</Text>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{org?.subscription_status || 'Active'}</Text>
        </Card>

        <Input
          label="Organization Name *"
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />
        <Input
          label="Address"
          value={form.address}
          onChangeText={(text) => setForm({ ...form, address: text })}
          multiline
        />
        <Input
          label="Phone"
          value={form.phone}
          onChangeText={(text) => setForm({ ...form, phone: text })}
          keyboardType="phone-pad"
        />
        
        <Button title="Save Changes" onPress={handleSave} loading={loading} fullWidth />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { fontSize: 16, color: COLORS.primary, fontWeight: '600' },
  content: { padding: 16, gap: 16 },
  infoCard: { padding: 16, gap: 8 },
  label: { fontSize: 12, color: COLORS.text.secondary, fontWeight: '600' },
  value: { fontSize: 16, color: COLORS.text.primary, marginBottom: 8 },
});
