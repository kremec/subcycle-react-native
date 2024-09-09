import React from 'react'
import { View } from 'react-native'
import { Card, Text } from 'react-native-paper'
import { IconDroplet, IconReload } from '@tabler/icons-react-native'

import { useTheme } from '../../theme/ThemeContext'
import { useEventsContext, useSymptomsContext } from '../AppContext'

import { getAverageCycleLength, getAveragePeriodLength, getAverageHeavyPeriodLength } from '../../stats/CycleStats'

export default function StatsTab() {
    const { theme } = useTheme()
    const { events } = useEventsContext()

    const averageCycleLength = getAverageCycleLength(events)
    const averagePeriodLength = getAveragePeriodLength(events)
    const averageHeavyPeriodLength = getAverageHeavyPeriodLength(events)

    return (
        <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10, gap: 10, flexDirection: 'column' }}>
            <Card style={{ overflow: 'hidden', padding: 10, backgroundColor: theme.colors.background, shadowColor: theme.colors.onBackground }}>
                <Card.Title
                    title="Average cycle length"
                    subtitle={
                        <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>
                            {!Number.isNaN(averageCycleLength)
                                ? Math.floor(averageCycleLength) !== Math.ceil(averageCycleLength)
                                    ? Math.floor(averageCycleLength) + ' - ' + Math.ceil(averageCycleLength) + ' days'
                                    : averageCycleLength + ' day' + (averageHeavyPeriodLength > 1 ? 's' : '')
                                : 'N/A'}
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
                            {!Number.isNaN(averagePeriodLength)
                                ? Math.floor(averagePeriodLength) !== Math.ceil(averagePeriodLength)
                                    ? Math.floor(averagePeriodLength) + ' - ' + Math.ceil(averagePeriodLength) + ' days'
                                    : averagePeriodLength + ' day' + (averageHeavyPeriodLength > 1 ? 's' : '')
                                : 'N/A'}
                        </Text>
                    }
                    left={(props) => <IconDroplet {...props} color={theme.colors.onBackground} strokeWidth={1.5} />}
                />
            </Card>

            <Card style={{ overflow: 'hidden', padding: 10, backgroundColor: theme.colors.background, shadowColor: theme.colors.onBackground }}>
                <Card.Title
                    title="Average heavy period length"
                    subtitle={
                        <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>
                            {!Number.isNaN(averageHeavyPeriodLength)
                                ? Math.floor(averageHeavyPeriodLength) !== Math.ceil(averageHeavyPeriodLength)
                                    ? Math.floor(averageHeavyPeriodLength) + ' - ' + Math.ceil(averageHeavyPeriodLength) + ' days'
                                    : averageHeavyPeriodLength + ' day' + (averageHeavyPeriodLength > 1 ? 's' : '')
                                : 'N/A'}
                        </Text>
                    }
                    left={(props) => <IconDroplet fill={theme.colors.onBackground} {...props} color={theme.colors.onBackground} strokeWidth={1.5} />}
                />
            </Card>
        </View>
    )
}
