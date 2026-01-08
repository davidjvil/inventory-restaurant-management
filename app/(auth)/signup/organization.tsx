import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '@/lib/supabase';
import { COLORS } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useToast } from '@/hooks/useToast';


export default function OrganizationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orgType = params.orgType as string;
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessType: 'restaurant',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    numberOfLocations: '1',
  });

  const validateForm = () => {
    if (!formData.name || formData.name.length < 2) {
      showToast('Organization name must be at least 2 characters', 'error');
      Alert.alert('Validation Error', 'Organization name must be at least 2 characters');
      return false;
    }
    if (!formData.phone || formData.phone.length < 10) {
      showToast('Please enter a valid phone number', 'error');
      return false;
    }
    if (!formData.address || formData.address.length < 5) {
      showToast('Please enter a valid address', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    console.log('🔥 handleSubmit function called');
    if (!validateForm()) return;

    // Check for duplicate organization name
    try {
      const { data: existingOrg, error: checkError } = await supabase
        .from('organizations')
        .select('id')
        .eq('name', formData.name)
        .single();

      if (existingOrg) {
        showToast('Organization name already exists', 'error');
        Alert.alert(
          'Duplicate Organization',
          'An organization with this name already exists. Please choose a different name.'
        );
        return;
      }
    } catch (error: any) {
      // If error is PGRST116 (no rows), that's good - means name is unique
      if (error?.code !== 'PGRST116') {
        console.error('Error checking for duplicate organization:', error);
      }
    }

    try {
      console.log('🔥 handleSubmit called! Form data:', formData);
      setLoading(true);

      // Call the atomic RPC function
      // This creates the organization AND links the user in a single transaction
      const { data: orgId, error } = await supabase.rpc('create_organization_and_link_user', {
        org_name: formData.name,
        business_type: formData.businessType,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
      });

      if (error) {
        console.error('RPC Error:', error);
        throw error;
      }

      showToast('Organization created successfully!', 'success');
      // Force a session refresh to ensure the new claims (organization_id) are present
      await supabase.auth.refreshSession();
      router.push('/(tabs)');  // Route to main app

    } catch (err: any) {
      console.error('Organization creation error:', err);
      console.error('Full error object:', JSON.stringify(err, null, 2));
      console.error('Error name:', err?.name);
      console.error('Error message:', err?.message);
      console.error('Error stack:', err?.stack);
      showToast(
        err instanceof Error ? err.message : 'Failed to create organization',
        'error'
      );
      Alert.alert(
        'Organization Creation Failed',
        err instanceof Error ? err.message : 'Failed to create organization. Please check console for details.'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.progress}>Step 3 of 3</Text>      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Organization Details</Text>
        <Text style={styles.subtitle}>Tell us about your business</Text>

        <Input label="Organization Name" placeholder="e.g., Parlor Doughnuts" value={formData.name} onChangeText={(text) => setFormData({ ...formData, name: text })} />

        <Text style={styles.label}>Business Type</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
            <Picker.Item label="Restaurant" value="restaurant" />
            <Picker.Item label="Cafe" value="cafe" />
            <Picker.Item label="Bar" value="bar" />
            <Picker.Item label="Food Truck" value="food_truck" />
            <Picker.Item label="Catering" value="catering" />
            <Picker.Item label="Bakery" value="bakery" />
          </Picker>
        </View>

        <Input label="Phone" placeholder="(555) 123-4567" value={formData.phone} onChangeText={(text) => setFormData({ ...formData, phone: text })} keyboardType="phone-pad" />
        <Input label="Address" placeholder="123 Main St" value={formData.address} onChangeText={(text) => setFormData({ ...formData, address: text })} />
        <Input label="City" placeholder="Orlando" value={formData.city} onChangeText={(text) => setFormData({ ...formData, city: text })} />
        <Input label="State" placeholder="FL" value={formData.state} onChangeText={(text) => setFormData({ ...formData, state: text })} maxLength={2} autoCapitalize="characters" />
        <Input label="Zip Code" placeholder="32801" value={formData.zipCode} onChangeText={(text) => setFormData({ ...formData, zipCode: text })} keyboardType="numeric" maxLength={5} />

        <Button title={loading ? 'Creating...' : 'Create Organization'} onPress={handleSubmit} disabled={loading} style={{ marginTop: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  progress: { fontSize: 14, color: COLORS.text.secondary },
  content: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.text.secondary, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text.primary, marginBottom: 8, marginTop: 16 },
  pickerContainer: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, backgroundColor: COLORS.card, minHeight: 56 },
});


