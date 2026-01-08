import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { COLORS } from '@/constants/colors';
import { IMAGES } from '@/constants/images';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    console.log('[Login] Button pressed');
    if (!email || !password) {
      console.log('[Login] Validation failed - empty fields');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    console.log('[Login] Calling Supabase with email:', email);
    setLoading(true);
    try {
      // SECURITY FIX: Capture auth response and validate before routing
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      console.log('[Login] Supabase response:', { data, error });

      // CRITICAL: Check if authentication succeeded
      if (error) {
        throw error;
      }
      
      // CRITICAL: Verify we have a valid session and user
      if (!data.session || !data.user) {
        throw new Error('Authentication failed - no session created');
      }
      
      console.log('[Login] SUCCESS! Navigating to tabs...');
      // Only navigate to main app if authentication succeeded
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('[Login] ERROR:', error);
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: IMAGES.logo }} style={styles.logo} />
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to manage your inventory</Text>

      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          keyboardType="email-address"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />

        <Button title="Sign In" onPress={handleLogin} loading={loading} fullWidth />
        <Button 
          title="Create Account" 
          onPress={() => router.push('/(auth)/signup')} 
          variant="outline" 
          fullWidth 
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24, alignItems: 'center' },
  logo: { width: 100, height: 100, marginTop: 40, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.text.secondary, marginBottom: 32 },
  form: { width: '100%', gap: 16 },
});
