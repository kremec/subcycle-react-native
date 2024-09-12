import { IconCalendarMonth, IconChartBar, IconSettings2, IconUserHeart } from '@tabler/icons-react-native'
import { Tabs } from 'expo-router'

import { useTheme } from '../../theme/ThemeContext'
import { useSettingsContext } from '../AppContext'

export default function TabLayout() {
    const { theme } = useTheme()
    const { settings } = useSettingsContext()

    return (
        <Tabs
            initialRouteName="index"
            screenOptions={{
                // Bottom tab bar
                tabBarActiveTintColor: theme.colors.onBackground,
                tabBarStyle: { backgroundColor: theme.colors.background },
                // Top header bar
                headerTitleStyle: { color: theme.colors.onBackground },
                headerStyle: { backgroundColor: theme.colors.background },
                tabBarShowLabel: false
            }}
            // All screens' background color
            sceneContainerStyle={{ backgroundColor: theme.colors.background }}
        >
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Stats',
                    tabBarIcon: ({ color }) => <IconChartBar size={20} color={color} />,
                    href: settings.partnerMode ? null : '/stats'
                }}
            />
            <Tabs.Screen
                name="partner"
                options={{
                    title: 'Partner info',
                    tabBarIcon: ({ color }) => <IconUserHeart size={20} color={color} />,
                    href: settings.partnerMode ? '/partner' : null
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Calendar',
                    tabBarIcon: ({ color }) => <IconCalendarMonth size={20} color={color} />
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <IconSettings2 size={20} color={color} />
                }}
            />
        </Tabs>
    )
}
