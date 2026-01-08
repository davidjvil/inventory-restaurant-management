import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { AlertDialog } from '@/components/AlertDialog';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const isAdminOrManager = user?.role === 'admin' || user?.role === 'store_manager';

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  const SettingItem = ({ icon, title, onPress, badge }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={COLORS.primary} />
        <Text style={styles.settingTitle}>{title}</Text>
        {badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
      </View>
      <Ionicons name="chevron-forward" size={24} color={COLORS.gray[400]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.full_name || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionHeader}>Account</Text>
          <SettingItem icon="person-outline" title="Profile Settings" onPress={() => router.push('/settings/profile')} />
          <SettingItem icon="lock-closed-outline" title="Change Password" onPress={() => router.push('/settings/password')} />
          <SettingItem icon="notifications-outline" title="Notifications" onPress={() => router.push('/settings/notifications')} />
        </Card>

        {isAdminOrManager && (
          <Card style={styles.section}>
            <Text style={styles.sectionHeader}>Organization</Text>
            <SettingItem icon="business-outline" title="Organization Details" onPress={() => router.push('/settings/organization')} />
            <SettingItem icon="location-outline" title="Manage Stores" onPress={() => router.push('/stores')} />
            <SettingItem icon="people-outline" title="Team Members" onPress={() => router.push('/users')} />
          </Card>
        )}

        <Card style={styles.section}>
          <Text style={styles.sectionHeader}>Tools</Text>
          <SettingItem icon="document-text-outline" title="Export Reports" onPress={() => router.push('/reports')} />
          <SettingItem icon="barcode-outline" title="Barcode Scanner" onPress={() => router.push('/scanner')} />
        </Card>

        <Button title="Sign Out" onPress={() => setShowSignOutDialog(true)} variant="danger" fullWidth />
      </ScrollView>

      <AlertDialog
        visible={showSignOutDialog}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        type="warning"
        buttons={[
          { text: 'Cancel', onPress: () => setShowSignOutDialog(false), style: 'cancel' },
          { text: 'Sign Out', onPress: handleSignOut, style: 'destructive' },
        ]}
        onClose={() => setShowSignOutDialog(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 16 },
  profileCard: { alignItems: 'center', padding: 24 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: COLORS.white },
  name: { fontSize: 24, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: 4 },
  email: { fontSize: 14, color: COLORS.text.secondary, marginBottom: 8 },
  roleBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  roleText: { fontSize: 12, fontWeight: '600', color: COLORS.white },
  section: { padding: 0 },
  sectionHeader: { fontSize: 12, fontWeight: '600', color: COLORS.text.secondary, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, textTransform: 'uppercase' },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingTitle: { fontSize: 16, color: COLORS.text.primary },
  badge: { backgroundColor: COLORS.error, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: '600', color: COLORS.white },
});
