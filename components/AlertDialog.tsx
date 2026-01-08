import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal as RNModal } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface AlertDialogProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
  buttons: Array<{
    text: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>;
  onClose: () => void;
}

export function AlertDialog({ visible, title, message, type = 'info', buttons, onClose }: AlertDialogProps) {
  const icons = { info: 'information-circle', warning: 'warning', danger: 'alert-circle', success: 'checkmark-circle' };
  const iconColors = { info: COLORS.primary, warning: COLORS.warning, danger: COLORS.error, success: COLORS.success };

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Ionicons name={icons[type]} size={48} color={iconColors[type]} style={styles.icon} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === 'destructive' && styles.destructiveButton,
                  button.style === 'cancel' && styles.cancelButton,
                ]}
                onPress={() => { button.onPress(); onClose(); }}
              >
                <Text style={[styles.buttonText, button.style === 'destructive' && styles.destructiveText]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  dialog: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, width: '100%', maxWidth: 400, alignItems: 'center' },
  icon: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: 12, textAlign: 'center' },
  message: { fontSize: 15, color: COLORS.text.secondary, marginBottom: 24, textAlign: 'center', lineHeight: 22 },
  buttonContainer: { flexDirection: 'row', gap: 12, width: '100%' },
  button: { flex: 1, backgroundColor: COLORS.primary, padding: 14, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: COLORS.gray[200] },
  destructiveButton: { backgroundColor: COLORS.error },
  buttonText: { fontSize: 16, fontWeight: '600', color: COLORS.white },
  destructiveText: { color: COLORS.white },
});
