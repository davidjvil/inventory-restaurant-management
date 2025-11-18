import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { supabase } from '@/app/lib/supabase';
import { Button } from '@/app/components/Button';
import { Toast } from '@/app/components/Toast';
import { useToast } from '@/app/hooks/useToast';
import { COLORS } from '@/app/constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function BarcodeScannerScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: any) => {
    setScanned(true);
    const { data: product } = await supabase.from('master_products').select('*').eq('sku', data).single();
    
    if (product) {
      showToast(`Found: ${product.name}`, 'success');
      setTimeout(() => router.push(`/product/${product.id}`), 1500);
    } else {
      showToast('Product not found', 'error');
      setTimeout(() => setScanned(false), 2000);
    }
  };

  if (hasPermission === null) return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  if (hasPermission === false) return <View style={styles.container}><Text>No access to camera</Text></View>;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Scan Barcode</Text>
        <View style={{ width: 28 }} />
      </View>
      <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
        <Text style={styles.instruction}>Align barcode within frame</Text>
      </View>
      {scanned && <Button title="Tap to Scan Again" onPress={() => setScanned(false)} style={styles.rescanButton} />}
      <Toast {...toast} onHide={hideToast} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: COLORS.white },
  title: { fontSize: 18, fontWeight: 'bold', color: COLORS.text.primary },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  scanArea: { width: 280, height: 280, borderWidth: 3, borderColor: COLORS.white, borderRadius: 20, backgroundColor: 'transparent' },
  instruction: { marginTop: 24, fontSize: 16, color: COLORS.white, fontWeight: '600' },
  rescanButton: { position: 'absolute', bottom: 40, left: 20, right: 20 },
});
