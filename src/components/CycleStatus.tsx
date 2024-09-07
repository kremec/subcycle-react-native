import React, { useEffect } from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'

import { CalendarColors } from '../theme/Colors'
import { useEventsContext } from '../app/AppContext'

const CycleStatus = () => {
    const { events } = useEventsContext()

    const [daysUntilNextMenstruationEvent, setDaysUntilNextMenstruationEvent] = React.useState(-1)
    useEffect(() => {
        const nextClosestEvent = events.filter((event) => event.menstruation && event.date >= new Date()).sort((a, b) => a.date.getTime() - b.date.getTime())[0]

        if (!nextClosestEvent) return

        const msTimeUntilNextEvent = nextClosestEvent.date.getTime() - new Date().getTime()
        setDaysUntilNextMenstruationEvent(Math.floor(msTimeUntilNextEvent / (1000 * 60 * 60 * 24)) + 1)
    }, [events])

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {daysUntilNextMenstruationEvent !== -1 ? (
                <>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>
                        {daysUntilNextMenstruationEvent} days
                    </Text>
                    <Text variant="titleLarge">
                        until next <Text style={{ color: CalendarColors.predictedMenstruation, fontWeight: 'bold' }}>menstruation</Text>
                    </Text>
                </>
            ) : (
                <Text variant="titleLarge">No menstruation events</Text>
            )}
        </View>
    )
}

export default CycleStatus
