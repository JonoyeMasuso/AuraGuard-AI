import { useState, useCallback } from 'react';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return 'denied';
    }

    const currentPermission = await Notification.requestPermission();
    setPermission(currentPermission);
    return currentPermission;
  }, []);

  const simulatePushNotification = useCallback((title: string, body: string) => {
    if (permission !== 'granted') {
      console.log('Notification permission not granted.');
      return;
    }

    navigator.serviceWorker.ready.then(registration => {
      // Fix: Removed 'vibrate' property as it was causing a TypeScript type error.
      registration.showNotification(title, {
        body,
        icon: '/logo192.png',
      });
    });
  }, [permission]);

  return { requestNotificationPermission, simulatePushNotification, permission };
};
