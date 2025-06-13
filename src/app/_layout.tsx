import { Stack } from 'expo-router'
import { ThemeProvider, useTheme } from '../theme/ThemeContext'
import { PaperProvider } from 'react-native-paper'
import { AppContext } from './AppContext'
import NotificationsManager from '../notifications/NotificationsManager'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { StatusBar } from 'expo-status-bar'

const RootLayout = () => {
    const { theme } = useTheme()

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
