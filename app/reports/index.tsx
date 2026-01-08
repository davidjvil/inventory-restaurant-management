import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function ReportsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const generateReport = async (type: string) => {
    setLoading(true);
    try {
      const { data: products } = await supabase
        .from('store_products')
        .select('*, product:master_products(*)')
        .eq('store_id', user?.assigned_store_ids?.[0] || '');

      const reportData = products?.map(p => ({
        name: p.product?.name,
        sku: p.product?.sku,
        quantity: p.quantity_on_hand,
        status: p.quantity_on_hand <= (p.reorder_threshold || 0) ? 'Low' : 'Good',
      })) || [];

      // Call edge function to send email
      const { data, error } = await supabase.functions.invoke('send-report-email', {
        body: {
          to: user?.email,
          subject: `${type} Inventory Report`,
          reportData,
        },
      });

      if (error) throw error;

      Alert.alert('Success', 'Report sent to your email');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const ReportCard = ({ title, description, icon, type }: any) => (
    <Card style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <Ionicons name={icon} size={32} color={COLORS.primary} />
        <View style={styles.reportInfo}>
          <Text style={styles.reportTitle}>{title}</Text>
          <Text style={styles.reportDesc}>{description}</Text>
        </View>
      </View>
      <Button 
        title="Generate Report" 
        onPress={() => generateReport(type)} 
        loading={loading}
        variant="outline"
      />
    </Card>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Inventory Reports</Text>
      <Text style={styles.subtitle}>Generate and email detailed reports</Text>

      <ReportCard
        title="Daily Report"
        description="Current inventory levels for today"
        icon="today"
        type="Daily"
      />

      <ReportCard
        title="Weekly Report"
        description="Inventory changes over the past week"
        icon="calendar"
        type="Weekly"
      />

      <ReportCard
        title="Monthly Report"
        description="Comprehensive monthly inventory analysis"
        icon="stats-chart"
        type="Monthly"
      />

      <ReportCard
        title="Low Stock Report"
        description="Products below reorder threshold"
        icon="alert-circle"
        type="Low Stock"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text.primary },
  subtitle: { fontSize: 16, color: COLORS.text.secondary, marginBottom: 8 },
  reportCard: { padding: 16 },
  reportHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  reportInfo: { flex: 1, marginLeft: 12 },
  reportTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text.primary, marginBottom: 4 },
  reportDesc: { fontSize: 14, color: COLORS.text.secondary },
});
