import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/app/contexts/AuthContext';
import { Card } from '@/app/components/Card';
import { Button } from '@/app/components/Button';
import { Toast } from '@/app/components/Toast';
import { useToast } from '@/app/hooks/useToast';
import { COLORS } from '@/app/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function ExportReportsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const exportToCSV = async (type: string) => {
    setLoading(true);
    let data: any[] = [];
    let headers = '';
    let filename = '';

    if (type === 'products') {
      const { data: products } = await supabase.from('store_products').select('*, product:master_products(*)');
      data = products || [];
      headers = 'SKU,Name,Category,Quantity,Price\n';
      filename = 'products_export.csv';
      data = data.map(p => `${p.product.sku},${p.product.name},${p.product.category},${p.quantity_on_hand},${p.product.base_price}`);
    } else if (type === 'vendors') {
      const { data: vendors } = await supabase.from('master_vendors').select('*');
      data = vendors || [];
      headers = 'Name,Contact,Email,Phone\n';
      filename = 'vendors_export.csv';
      data = data.map(v => `${v.name},${v.contact_name},${v.email},${v.phone}`);
    }

    const csv = headers + data.join('\n');
    const path = `${FileSystem.documentDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(path, csv);
    await Sharing.shareAsync(path);
    
    setLoading(false);
    showToast('Export successful', 'success');
  };

  const ExportCard = ({ title, description, icon, onPress }: any) => (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.exportCard}>
        <Ionicons name={icon} size={40} color={COLORS.primary} />
        <View style={styles.exportInfo}>
          <Text style={styles.exportTitle}>{title}</Text>
          <Text style={styles.exportDesc}>{description}</Text>
        </View>
        <Ionicons name="download-outline" size={24} color={COLORS.gray[400]} />
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Export Reports</Text>
        <ExportCard title="Products Report" description="Export all products with inventory levels" icon="cube-outline" onPress={() => exportToCSV('products')} />
        <ExportCard title="Vendors Report" description="Export vendor contact information" icon="business-outline" onPress={() => exportToCSV('vendors')} />
      </ScrollView>
      <Toast {...toast} onHide={hideToast} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: 8 },
  exportCard: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  exportInfo: { flex: 1 },
  exportTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text.primary, marginBottom: 4 },
  exportDesc: { fontSize: 14, color: COLORS.text.secondary },
});
