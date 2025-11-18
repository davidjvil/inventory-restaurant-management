import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/app/constants/colors';


export default function AccountTypeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.progress}>Step 1 of 3</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Get Started</Text>
        <Text style={styles.subtitle}>Choose how you'd like to set up your account</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(auth)/signup/organization')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="business" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.cardTitle}>Create New Organization</Text>
          <Text style={styles.cardDescription}>
            Set up a new restaurant or business account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/(auth)/signup/join-organization')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="people" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.cardTitle}>Join Existing Organization</Text>
          <Text style={styles.cardDescription}>
            Join your team's existing account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backButton: { marginRight: 16 },
  progress: { fontSize: 14, color: COLORS.text.secondary },
  content: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.text.secondary, marginBottom: 32 },
  card: { backgroundColor: COLORS.card, borderRadius: 12, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  iconContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.primary + '20', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 20, fontWeight: '600', color: COLORS.text.primary, marginBottom: 8 },
  cardDescription: { fontSize: 14, color: COLORS.text.secondary, lineHeight: 20 },
});

