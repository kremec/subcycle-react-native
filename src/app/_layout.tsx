import { Stack } from 'expo-router'
import { ThemeProvider, useTheme } from '../theme/ThemeContext'
import { PaperProvider } from 'react-native-paper'
import { AppContext, useEventsContext } from './AppContext'
import NotificationsManager from '../notifications/NotificationsManager'
import * as Notifications from 'expo-notifications'
import { useEffect, useState } from 'react'
import { defaultEvent, isSameDate } from './Types'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { StatusBar } from 'expo-status-bar'

const RootLayout = () => {
    const { theme } = useTheme()
    const { events, updateEvent } = useEventsContext()

    const [updatedFromNotification, setUpdatedFromNotification] = useState(false)

    const lastNotificationResponse = Notifications.useLastNotificationResponse()
    useEffect(() => {
        if (events.length === 0 || updatedFromNotification) return

        setUpdatedFromNotification(true)
        if (lastNotificationResponse?.actionIdentifier === 'checkpill') {
            Notifications.dismissAllNotificationsAsync()

            let event = events.find((e) => isSameDate(new Date(), e.date))
            if (!event) event = defaultEvent(new Date())
            event.pill = true
            updateEvent(event)
        }
    }, [lastNotificationResponse, events])

    return (
        <PaperProvider theme={theme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </PaperProvider>
    )
}

const App = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <ThemeProvider>
                    <AppContext>
                        <RootLayout />
                        <NotificationsManager />
                        <StatusBar style="auto" />
                    </AppContext>
                </ThemeProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}
export default App
