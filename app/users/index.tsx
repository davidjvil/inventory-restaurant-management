import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { Toast } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function UsersScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    if (user?.role === 'admin') fetchUsers();
    else showToast('Access denied', 'error');
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error) showToast('Failed to load users', 'error');
    else setUsers(data || []);
    setLoading(false);
  };

  const renderUser = ({ item }: any) => (
    <Card style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.full_name?.[0]?.toUpperCase() || 'U'}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.full_name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
      </View>
      <View style={styles.userMeta}>
        <StatusBadge status={item.role} />
        <TouchableOpacity onPress={() => router.push(`/users/${item.id}`)}>
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray[400]} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.title}>Team Members</Text>
        <Button title="Add User" onPress={() => router.push('/users/add')} icon="add" />
      </View>
      
      <FlatList 
        data={users} 
        renderItem={renderUser} 
        keyExtractor={(item) => item.id} 
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchUsers}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { fontSize: 16, color: COLORS.primary, fontWeight: '600' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text.primary },
  list: { padding: 16, gap: 12 },
  userCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: COLORS.white },
  userDetails: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '600', color: COLORS.text.primary },
  userEmail: { fontSize: 14, color: COLORS.text.secondary, marginTop: 2 },
  userMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});

