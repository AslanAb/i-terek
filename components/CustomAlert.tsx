import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  theme: string | undefined;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  theme,
  onClose,
  type = 'info'
}) => {
  const getThemeColors = () => {
    switch (theme) {
      case 'green':
        return {
          primary: '#477304',
          background: '#f0f9e8',
          border: '#477304',
          text: '#2d4a02'
        };
      case 'yellow':
        return {
          primary: '#9C4A1A',
          background: '#fef7e8',
          border: '#9C4A1A',
          text: '#5c2a0c'
        };
      case 'red':
        return {
          primary: '#9d0208',
          background: '#fef2f2',
          border: '#9d0208',
          text: '#5c0a0d'
        };
      default:
        return {
          primary: '#666',
          background: '#f5f5f5',
          border: '#666',
          text: '#333'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      default:
        return 'ℹ';
    }
  };

  const colors = getThemeColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}>
          {/* <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.icon}>{getIcon()}</Text>
          </View> */}

          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

          {message && (
            <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    maxWidth: scale(300),
    borderRadius: scale(16),
    padding: scale(20),
    alignItems: 'center',
    borderWidth: 2,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconContainer: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  icon: {
    fontSize: scale(24),
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: scale(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: verticalScale(8),
    fontFamily: 'Podkova-Bold',
  },
  message: {
    fontSize: scale(14),
    textAlign: 'center',
    marginBottom: verticalScale(20),
    lineHeight: scale(18),
    fontFamily: 'Podkova-Regular',
  },
  button: {
    paddingHorizontal: scale(30),
    paddingVertical: verticalScale(10),
    borderRadius: scale(8),
    minWidth: scale(80),
  },
  buttonText: {
    color: 'white',
    fontSize: scale(16),
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Podkova-Medium',
  },
});

export default CustomAlert;
