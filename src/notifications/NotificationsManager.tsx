import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useAppContext } from '../app/AppContext';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const NotificationsManager = () => {
    const { settings } = useAppContext();

    useEffect(() => {
        // Request notification permissions
        requestPermissions();
        // Schedule the notification when the component mounts
        scheduleDailyNotification();
    }, [settings.notificationTime]);

    const requestPermissions = async () => {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            vibrationPattern: [0, 250, 250, 250],
            importance: Notifications.AndroidImportance.MAX,
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            bypassDnd: true,
        });

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        // Ask for permission if it hasn't been granted yet
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return;
        }
    };

    const scheduleDailyNotification = async () => {
        // Cancel all previously scheduled notifications (optional)
        await Notifications.cancelAllScheduledNotificationsAsync();

        // Schedule the notification
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "subcycle",
                body: "Don't forget to take your pill!",
                sound: true,
                vibrate: [0, 250, 250, 250],
                priority: 'max',
            },
            trigger: {
                // Show the notification every day at the specified time
                hour: settings.notificationTime.getHours(),
                minute: settings.notificationTime.getMinutes(),
                repeats: true,
            }
        });
    };

    return null;
};

export default NotificationsManager;
