import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "../theme/ThemeContext";
import { PaperProvider } from "react-native-paper";
import { AppContext, useAppContext } from "./AppContext";
import NotificationsManager from "../notifications/NotificationsManager";
import * as Notifications from 'expo-notifications';
import { useEffect } from "react";
import { isSameDate } from "./Types";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const RootLayout = () => {
    const { theme } = useTheme();
    const { events, updateEvent } = useAppContext();

    const lastNotificationResponse = Notifications.useLastNotificationResponse();
    useEffect(() => {
        if (lastNotificationResponse?.actionIdentifier === "checkpill") {
            Notifications.dismissAllNotificationsAsync();

            let event = events.find(e => isSameDate(new Date(), e.date));
            if (!event)
                event = { date: new Date(), menstruation: false, ovulation: false, pill: true, prediction: false };
            event.pill = true;
            updateEvent(event);
            console.log(event);
        }
    }, [lastNotificationResponse]);

    return (
        <PaperProvider theme={theme}>
            <Stack>
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                />
            </Stack>
        </PaperProvider>
    );
};

const App = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <ThemeProvider>
                    <AppContext>
                        <RootLayout />
                        <NotificationsManager />
                    </AppContext>
                </ThemeProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};
export default App;