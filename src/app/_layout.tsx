import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useTheme } from "../theme/ThemeContext";

const RootLayout = () => {
    const { theme } = useTheme();

    return (
        <PaperProvider theme={theme}>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.colors.background,
                    },
                    headerTintColor: theme.colors.onBackground,
                    contentStyle: {
                        backgroundColor: theme.colors.background,
                    },
                    animation: "ios",
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        headerTitle: "Home",
                        headerTitleAlign: "center",
                    }}
                />
            </Stack>
        </PaperProvider>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <RootLayout />
        </ThemeProvider>
    );
};

export default App;
