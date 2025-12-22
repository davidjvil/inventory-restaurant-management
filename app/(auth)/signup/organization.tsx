import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '@/app/lib/supabase';
import { COLORS } from '@/app/constants/colors';
import { Input } from '@/app/components/Input';
import { Button } from '@/app/components/Button';
import { useToast } from '@/app/hooks/useToast';


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
    if (!validateForm()) return;
    
    try {

    setLoading(true);
      const { data, error } = await supabase.from('organizations').insert({
        name: formData.name,
        business_type: formData.businessType,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        subscription_tier: 'trial',
      }).select().single();

      if (error) throw error;

        // Get authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
                throw new Error('User not authenticated');
              }

          const { error: updateError } = await supabase
            .from('users')
            .update({ 
                        organization_id: data.id,
              
              role: 'admin' 
            })
            .eq('id', user.id);

          if (updateError) {
            console.error('Failed to link user to organization:', updateError);
            throw new Error('Failed to link user to organization');
                }
      showToast('Organization created successfully!', 'success');
                  router.push('/(tabs)');  // Route to main app

  

      } catch (error) {
      console.error('Organization creation error:', error);
          console.error('Full error object:', JSON.stringify(error, null, 2));
          console.error('Error name:', error?.name);
          console.error('Error message:', error?.message);
          console.error('Error stack:', error?.stack);
      showToast(
        error instanceof Error ? error.message : 'Failed to create organization',
        'error'
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
        <Input label="Zip Code" placeholder="32801" value={formData.zipCode} onChangeText={(text) => setFormData({ ...formData, zipCode: text })} keyboardType="number-pad" maxLength={5} />

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
  pickerContainer: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, backgroundColor: COLORS.card , minHeight: 56},
});


