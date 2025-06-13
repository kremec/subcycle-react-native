import { useEffect } from 'react'
import * as Notifications from 'expo-notifications'
import { useSettingsContext } from '../app/AppContext'
import { registerBackgroundTask } from './backgroundTask'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true
    })
})

const NotificationsManager = () => {
    const { settings } = useSettingsContext()

    useEffect(() => {
        registerBackgroundTask()
    }, [])

    useEffect(() => {
        if (settings.notificationTime === null) return

        const setupNotifications = async () => {
            const permissionStatus = await requestPermissions()

            await Notifications.cancelAllScheduledNotificationsAsync()
            if (permissionStatus === 'granted') scheduleDailyNotification()
        }

        setupNotifications()
    }, [settings.notificationTime])

    const requestPermissions = async () => {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            vibrationPattern: [0, 250, 250, 250],
            importance: Notifications.AndroidImportance.MAX,
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            bypassDnd: true
        })

        await Notifications.setNotificationCategoryAsync('pillreminder', [
            {
                buttonTitle: 'Check pill for today',
                identifier: 'checkpill',
                options: {
                    opensAppToForeground: false,
                    isDestructive: true,
                    isAuthenticationRequired: false
                }
            }
        ])

        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus

        // Ask for permission if it hasn't been granted yet
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync()
            finalStatus = status
        }

        return finalStatus
    }

    const scheduleDailyNotification = async () => {
        if (settings.notificationTime === null) return

        // Schedule the notification
        await Notifications.scheduleNotificationAsync({
            content: {
                categoryIdentifier: 'pillreminder',
                title: 'subcycle',
                body: "Don't forget to take your pill!",
                sound: true,
                vibrate: [0, 250, 250, 250],
                priority: 'max'
            },
            trigger: {
                // Show the notification every day at the specified time
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: settings.notificationTime.getHours(),
                minute: settings.notificationTime.getMinutes()
            }
        })
    }

    return null
}

export const sendTestNotification = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            categoryIdentifier: 'pillreminder',
            title: 'subcycle',
            body: "Don't forget to take your pill!",
            sound: true,
            vibrate: [0, 250, 250, 250],
            priority: 'max'
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 5,
            channelId: 'default'
        }
    })
}

export default NotificationsManager
