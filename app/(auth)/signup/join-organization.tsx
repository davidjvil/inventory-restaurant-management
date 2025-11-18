import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/app/lib/supabase';
import { COLORS } from '@/app/constants/colors';
import { Input } from '@/app/components/Input';
import { Button } from '@/app/components/Button';
import { useToast } from '@/app/hooks/useToast';

export default function JoinOrganizationScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const handleJoin = async () => {
    if (!inviteCode || inviteCode.length < 6) {
      showToast('Please enter a valid invite code', 'error');
      return;
    }

    setLoading(true);
    try {
      // Query organizations table for invite code
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (error || !data) {
        showToast('Invalid invite code. Please check and try again.', 'error');
        setLoading(false);
        return;
      }

      showToast(`Found organization: ${data.name}`, 'success');
      router.push({
        pathname: '/(auth)/signup/create-account',
        params: { organizationId: data.id, isNewOrg: 'false' },
      });
    } catch (error: any) {
      showToast(error.message || 'Failed to verify invite code', 'error');
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
        <Text style={styles.progress}>Step 2 of 3</Text>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Join Organization</Text>
        <Text style={styles.subtitle}>Enter your organization's invite code</Text>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Ask your manager or admin for the organization invite code
          </Text>
        </View>

        <Input
          label="Invite Code"
          placeholder="ABC123"
          value={inviteCode}
          onChangeText={setInviteCode}
          autoCapitalize="characters"
          maxLength={10}
        />

        <Button
          title={loading ? 'Verifying...' : 'Continue'}
          onPress={handleJoin}
          disabled={loading}
          style={{ marginTop: 24 }}
        />

        <TouchableOpacity style={styles.helpButton} onPress={() => showToast('Contact your organization admin for an invite code', 'info')}>
          <Text style={styles.helpText}>Don't have an invite code?</Text>
        </TouchableOpacity>
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
  infoBox: { flexDirection: 'row', backgroundColor: COLORS.primary + '15', padding: 16, borderRadius: 8, marginBottom: 24, gap: 12 },
  infoText: { flex: 1, fontSize: 14, color: COLORS.text.secondary, lineHeight: 20 },
  helpButton: { marginTop: 16, alignItems: 'center' },
  helpText: { fontSize: 14, color: COLORS.primary, textDecorationLine: 'underline' },
});

