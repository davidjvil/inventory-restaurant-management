import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/app/lib/supabase';
import { Input } from '@/app/components/Input';
import { Button } from '@/app/components/Button';
import { Toast } from '@/app/components/Toast';
import { useToast } from '@/app/hooks/useToast';
import { COLORS } from '@/app/constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function PasswordSettingsScreen() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: form.newPassword,
    });

    setLoading(false);

    if (error) {
      toast.error('Failed to update password');
    } else {
      toast.success('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
        <Input
          label="Current Password *"
          value={form.currentPassword}
          onChangeText={(text) => setForm({ ...form, currentPassword: text })}
          secureTextEntry
        />
        <Input
          label="New Password *"
          value={form.newPassword}
          onChangeText={(text) => setForm({ ...form, newPassword: text })}
          secureTextEntry
        />
        <Input
          label="Confirm New Password *"
          value={form.confirmPassword}
          onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
          secureTextEntry
        />
        <Button title="Update Password" onPress={handleSave} loading={loading} fullWidth />
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
});
