import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "../theme/ThemeContext";
import { PaperProvider } from "react-native-paper";
import { AppContext } from "./AppContext";

const RootLayout = () => {
    const { theme } = useTheme();

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
        <ThemeProvider>
            <AppContext>
                <RootLayout />
            </AppContext>
        </ThemeProvider>
    );
};
export default App;