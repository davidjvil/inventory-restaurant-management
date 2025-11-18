import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/app/constants/colors';

interface StatusBadgeProps {
  status: 'healthy' | 'warning' | 'critical' | 'low' | 'medium' | 'high';
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const getColor = () => {
    switch (status) {
      case 'healthy': return COLORS.success;
      case 'warning': return COLORS.warning;
      case 'critical': return COLORS.danger;
      case 'low': return COLORS.success;
      case 'medium': return COLORS.warning;
      case 'high': return COLORS.danger;
      default: return COLORS.gray[400];
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: `${getColor()}20` }]}>
      <Text style={[styles.text, { color: getColor() }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
