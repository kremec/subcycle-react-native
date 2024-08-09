import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { Colors } from "./Colors";

export const DarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
export const LightTheme = { ...MD3LightTheme, colors: Colors.light };

const defaultContextValue = { theme: LightTheme };
const ThemeContext = createContext(defaultContextValue);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemColorTheme: string = useColorScheme() as string;
    const [theme, setTheme] = useState(systemColorTheme === "dark" ? DarkTheme : LightTheme);

    useEffect(() => {
        setTheme(systemColorTheme === "dark" ? DarkTheme : LightTheme);
    }, [systemColorTheme]);

    return (
        <ThemeContext.Provider value={{ theme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
