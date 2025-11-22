import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/app/lib/supabase';
import { COLORS } from '@/app/constants/colors';
import { Input } from '@/app/components/Input';
import { Button } from '@/app/components/Button';
import { useToast } from '@/app/hooks/useToast';

export default function CreateAccountScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const params = useLocalSearchParams();
  const organizationId = params.organizationId as string;
  const isNewOrg = params.isNewOrg === 'true';
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const getPasswordStrength = () => {
    const { password } = formData;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    return strength;
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      showToast('Please enter your full name', 'error');
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      showToast('Please enter a valid email', 'error');
      return false;
    }
    if (getPasswordStrength() < 4) {
      showToast('Password must be 8+ chars with uppercase, number, and special character', 'error');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return false;
    }
    if (!formData.termsAccepted) {
      showToast('Please accept the terms and conditions', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');


      // User profile is automatically created by database trigger
      // No manual profile creation needed
      showToast('Account created successfully!', 'success');
      router.push('/signup/organization');    } catch (error: any) {
      showToast(error.message || 'Failed to create account', 'error');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();
  const strengthColor = strength <= 1 ? '#ef4444' : strength === 2 ? '#f59e0b' : strength === 3 ? '#eab308' : '#22c55e';
  const strengthText = strength <= 1 ? 'Weak' : strength === 2 ? 'Fair' : strength === 3 ? 'Good' : 'Strong';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.progress}>Step 3 of 3</Text>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>You'll be the {isNewOrg ? 'admin' : 'team member'}</Text>

        <Input label="First Name" placeholder="John" value={formData.firstName} onChangeText={(text) => setFormData({ ...formData, firstName: text })} />
        <Input label="Last Name" placeholder="Smith" value={formData.lastName} onChangeText={(text) => setFormData({ ...formData, lastName: text })} />
        <Input label="Email" placeholder="john@company.com" value={formData.email} onChangeText={(text) => setFormData({ ...formData, email: text })} keyboardType="email-address" autoCapitalize="none" />
        <Input label="Phone (Optional)" placeholder="(555) 987-6543" value={formData.phone} onChangeText={(text) => setFormData({ ...formData, phone: text })} keyboardType="phone-pad" />
        <Input label="Password" placeholder="••••••••" value={formData.password} onChangeText={(text) => setFormData({ ...formData, password: text })} secureTextEntry />
        {formData.password.length > 0 && (
          <View style={styles.strengthContainer}>
            <View style={[styles.strengthBar, { width: `${(strength / 4) * 100}%`, backgroundColor: strengthColor }]} />
            <Text style={[styles.strengthText, { color: strengthColor }]}>{strengthText}</Text>
          </View>
        )}
        <Input label="Confirm Password" placeholder="••••••••" value={formData.confirmPassword} onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })} secureTextEntry />

        <TouchableOpacity style={styles.checkboxRow} onPress={() => setFormData({ ...formData, termsAccepted: !formData.termsAccepted })}>
          <Ionicons name={formData.termsAccepted ? 'checkbox' : 'square-outline'} size={24} color={COLORS.primary} />
          <Text style={styles.checkboxText}>I accept the Terms and Conditions</Text>
        </TouchableOpacity>

        <Button title={loading ? 'Creating Account...' : 'Create Account'} onPress={handleSubmit} disabled={loading} style={{ marginTop: 24 }} />
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
  strengthContainer: { marginTop: 8, marginBottom: 16 },
  strengthBar: { height: 4, borderRadius: 2, marginBottom: 4 },
  strengthText: { fontSize: 12, fontWeight: '600' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 12 },
  checkboxText: { fontSize: 14, color: COLORS.text.primary, flex: 1 },
});

