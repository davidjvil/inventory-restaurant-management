import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/app/constants/colors';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  onHide: () => void;
  duration?: number;
}

export function Toast({ visible, message, type = 'info', onHide, duration = 4000 }: ToastProps) {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-100)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 65, friction: 8 }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -100, duration: 300, useNativeDriver: true }),
        ]).start(() => onHide());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const icons = { success: 'checkmark-circle', error: 'close-circle', warning: 'warning', info: 'information-circle' };
  const colors = { success: COLORS.success, error: COLORS.error, warning: COLORS.warning, info: COLORS.primary };

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }], top: insets.top + 10, backgroundColor: colors[type] }]}>
      <Ionicons name={icons[type]} size={28} color={COLORS.white} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 14,
    gap: 14,
    zIndex: 9999,
    elevation: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    minHeight: 70,
  },
  message: { flex: 1, color: COLORS.white, fontSize: 15, fontWeight: '600', lineHeight: 20 },
});
