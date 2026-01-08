import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Toast } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    theme: 'light' as 'light' | 'dark' | 'auto',
    language: 'en',
  });

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        theme: user.theme_preference || 'light',
        language: user.language || 'en',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!form.full_name || !form.email) {
      toast.error('Name and email are required');
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('users')
      .update({
        full_name: form.full_name,
        phone: form.phone,
        theme_preference: form.theme,
        language: form.language,
      })
      .eq('id', user?.id);

    setLoading(false);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated successfully');
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
          label="Full Name *"
          value={form.full_name}
          onChangeText={(text) => setForm({ ...form, full_name: text })}
        />
        <Input
          label="Email *"
          value={form.email}
          editable={false}
          style={styles.disabled}
        />
        <Input
          label="Phone"
          value={form.phone}
          onChangeText={(text) => setForm({ ...form, phone: text })}
          keyboardType="phone-pad"
        />
        
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Theme</Text>
          <Picker
            selectedValue={form.theme}
            onValueChange={(val) => setForm({ ...form, theme: val })}
            style={styles.picker}
          >
            <Picker.Item label="Light" value="light" />
            <Picker.Item label="Dark" value="dark" />
            <Picker.Item label="Auto" value="auto" />
          </Picker>
        </View>

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
  disabled: { backgroundColor: COLORS.gray[100] },
  pickerContainer: { gap: 8 },
  label: { fontSize: 14, fontWeight: '500', color: COLORS.text.primary },
  picker: { backgroundColor: COLORS.white, borderRadius: 8 },
});
