import { useState } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export function useToast() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');

  const show = (msg: string, toastType: ToastType = 'info') => {
    setMessage(msg);
    setType(toastType);
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  return {
    visible,
    message,
    type,
    show,
    hide,
    success: (msg: string) => show(msg, 'success'),
    error: (msg: string) => show(msg, 'error'),
    warning: (msg: string) => show(msg, 'warning'),
    info: (msg: string) => show(msg, 'info'),
  };
}
