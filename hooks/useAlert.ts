import { useState } from 'react';

interface AlertConfig {
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'info';
}

export const useAlert = () => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showAlert = (config: AlertConfig) => {
    setAlertConfig(config);
    setIsVisible(true);
  };

  const hideAlert = () => {
    setIsVisible(false);
    setAlertConfig(null);
  };

  const showSuccess = (title: string, message?: string) => {
    showAlert({ title, message, type: 'success' });
  };

  const showError = (title: string, message?: string) => {
    showAlert({ title, message, type: 'error' });
  };

  const showInfo = (title: string, message?: string) => {
    showAlert({ title, message, type: 'info' });
  };

  return {
    isVisible,
    alertConfig,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showInfo
  };
};
