import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { supabase } from '@/app/lib/supabase';
import { Card } from '@/app/components/Card';
import { Button } from '@/app/components/Button';
import { Toast } from '@/app/components/Toast';
import { useToast } from '@/app/hooks/useToast';
import { COLORS } from '@/app/constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    lowStockAlerts: true,
    orderReminders: true,
    weeklyReports: false,
    monthlyReports: true,
    emailNotifications: true,
    pushNotifications: true,
  });

  useEffect(() => {
    if (user?.notification_preferences) {
      setSettings({ ...settings, ...user.notification_preferences });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    
    const { error } = await supabase
      .from('users')
      .update({ notification_preferences: settings })
      .eq('id', user?.id);

    setLoading(false);

    if (error) {
      toast.error('Failed to update settings');
    } else {
      toast.success('Settings updated successfully');
      setTimeout(() => router.back(), 1500);
    }
  };

  const SettingRow = ({ label, value, onValueChange }: any) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.gray[300], true: COLORS.primary }}
        thumbColor={COLORS.white}
      />
    </View>
  );

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
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Alerts</Text>
          <SettingRow
            label="Low Stock Alerts"
            value={settings.lowStockAlerts}
            onValueChange={(val: boolean) => setSettings({ ...settings, lowStockAlerts: val })}
          />
          <SettingRow
            label="Order Reminders"
            value={settings.orderReminders}
            onValueChange={(val: boolean) => setSettings({ ...settings, orderReminders: val })}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Reports</Text>
          <SettingRow
            label="Weekly Reports"
            value={settings.weeklyReports}
            onValueChange={(val: boolean) => setSettings({ ...settings, weeklyReports: val })}
          />
          <SettingRow
            label="Monthly Reports"
            value={settings.monthlyReports}
            onValueChange={(val: boolean) => setSettings({ ...settings, monthlyReports: val })}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery Methods</Text>
          <SettingRow
            label="Email Notifications"
            value={settings.emailNotifications}
            onValueChange={(val: boolean) => setSettings({ ...settings, emailNotifications: val })}
          />
          <SettingRow
            label="Push Notifications"
            value={settings.pushNotifications}
            onValueChange={(val: boolean) => setSettings({ ...settings, pushNotifications: val })}
          />
        </Card>

        <Button title="Save Preferences" onPress={handleSave} loading={loading} fullWidth />
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
  card: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text.primary, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  label: { fontSize: 14, color: COLORS.text.primary },
});
