import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/app/lib/supabase';
import { Input } from '@/app/components/Input';
import { Button } from '@/app/components/Button';
import { Card } from '@/app/components/Card';
import { Toast } from '@/app/components/Toast';
import { useToast } from '@/app/hooks/useToast';
import { COLORS } from '@/app/constants/colors';
import { Picker } from '@react-native-picker/picker';

export default function AddUserScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', full_name: '', role: 'staff' });
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async () => {
    if (!formData.email || !formData.full_name) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.admin.createUser({
      email: formData.email,
      email_confirm: true,
      user_metadata: { full_name: formData.full_name, role: formData.role },
    });

    setLoading(false);
    if (error) showToast(error.message, 'error');
    else {
      showToast('User invited successfully', 'success');
      setTimeout(() => router.back(), 1500);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Add Team Member</Text>
        <Card style={styles.form}>
          <Input label="Full Name *" value={formData.full_name} onChangeText={(full_name) => setFormData({ ...formData, full_name })} placeholder="John Doe" />
          <Input label="Email *" value={formData.email} onChangeText={(email) => setFormData({ ...formData, email })} placeholder="john@example.com" keyboardType="email-address" autoCapitalize="none" />
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Role *</Text>
            <Picker selectedValue={formData.role} onValueChange={(role) => setFormData({ ...formData, role })} style={styles.picker}>
              <Picker.Item label="Staff" value="staff" />
              <Picker.Item label="Manager" value="manager" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>
          </View>
          <Button title="Send Invite" onPress={handleSubmit} loading={loading} fullWidth />
        </Card>
      </ScrollView>
      <Toast {...toast} onHide={hideToast} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: 16 },
  form: { padding: 16, gap: 16 },
  pickerContainer: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text.primary },
  picker: { backgroundColor: COLORS.gray[100], borderRadius: 8 },
});
