import { Tabs } from 'expo-router';
import { Icon } from 'react-native-paper';
import { useTheme } from '../../theme/ThemeContext';

export default function TabLayout() {
    const { theme } = useTheme(); // Access the theme
    
    return (
        <Tabs
            screenOptions={{
                // Bottom tab bar
                tabBarActiveTintColor: theme.colors.onBackground,
                tabBarStyle: { backgroundColor: theme.colors.background },
                // Top header bar
                headerTitleStyle: { color: theme.colors.onBackground },
                headerStyle: { backgroundColor: theme.colors.background },
                tabBarShowLabel: false,
            }}
            // All screens' background color
            sceneContainerStyle={{ backgroundColor: theme.colors.background }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Calendar',
                    tabBarIcon: ({ color }) => <Icon source="calendar-outline" size={20} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <Icon source="cog-outline" size={20} color={color} />,
                }}
            />
        </Tabs>
    );
}