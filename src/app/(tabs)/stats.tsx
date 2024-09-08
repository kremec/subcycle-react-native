import React from 'react'
import { View } from 'react-native'
import { Card, Text } from 'react-native-paper'
import { IconDroplet, IconReload } from '@tabler/icons-react-native'

import { useTheme } from '../../theme/ThemeContext'
import { useEventsContext, useSymptomsContext } from '../AppContext'

import { getAverageCycleLength, getAveragePeriodLength, getAverageStrongPeriodLength } from '../../stats/CycleStats'

export default function StatsTab() {
    const { theme } = useTheme()
    const { events } = useEventsContext()
    const { symptoms } = useSymptomsContext()

    const averageCycleLength = getAverageCycleLength(events)
    const averagePeriodLength = getAveragePeriodLength(events)
    const averageStrongPeriodLength = getAverageStrongPeriodLength(symptoms)

    return (
        <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10, gap: 10, flexDirection: 'column' }}>
            <Card style={{ overflow: 'hidden', padding: 10, backgroundColor: theme.colors.background, shadowColor: theme.colors.onBackground }}>
                <Card.Title
                    title="Average cycle length"
                    subtitle={
                        <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>
                            {!Number.isNaN(averageCycleLength) ? averageCycleLength + ' days' : 'N/A'}
                        </Text>
                    }
                    left={(props) => <IconReload {...props} color={theme.colors.onBackground} strokeWidth={1.5} />}
                />
            </Card>

            <Card style={{ overflow: 'hidden', padding: 10, backgroundColor: theme.colors.background, shadowColor: theme.colors.onBackground }}>
                <Card.Title
                    title="Average period length"
                    subtitle={
                        <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>
                            {!Number.isNaN(averagePeriodLength) ? averagePeriodLength + ' days' : 'N/A'}
                        </Text>
                    }
                    left={(props) => <IconDroplet {...props} color={theme.colors.onBackground} strokeWidth={1.5} />}
                />
            </Card>

            <Card style={{ overflow: 'hidden', padding: 10, backgroundColor: theme.colors.background, shadowColor: theme.colors.onBackground }}>
                <Card.Title
                    title="Average strong period length"
                    subtitle={
                        <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>
                            {!Number.isNaN(averageStrongPeriodLength) ? averageStrongPeriodLength + ' days' : 'N/A'}
                        </Text>
                    }
                    left={(props) => <IconDroplet fill={theme.colors.onBackground} {...props} color={theme.colors.onBackground} strokeWidth={1.5} />}
                />
            </Card>
        </View>
    )
}
