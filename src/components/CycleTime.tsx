import React, { useEffect } from 'react'
import { View } from 'react-native';
import { Text } from 'react-native-paper'

import { useAppContext } from '../app/AppContext';
import { CalendarColors } from '../theme/Colors';

const CycleTime = () => {
    const { events } = useAppContext();

    const [daysUntilNextMenstruationEvent, setDaysUntilNextMenstruationEvent] = React.useState(-1);
    useEffect(() => {
        const nextClosestEvent = events
            .filter(event => event.menstruation && event.date >= new Date())
            .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

        if (!nextClosestEvent)
            return;

        const msTimeUntilNextEvent = nextClosestEvent.date.getTime() - new Date().getTime();
        setDaysUntilNextMenstruationEvent(Math.floor(msTimeUntilNextEvent / (1000 * 60 * 60 * 24))+1);
    }, [events]);

    return (
        <>
        {daysUntilNextMenstruationEvent !== -1 ? (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>{daysUntilNextMenstruationEvent} days</Text>
                <Text variant="titleLarge">until next <Text style={{ color: CalendarColors.predictedMenstruation, fontWeight: 'bold' }}>menstruation</Text> event</Text>
            </View>
        ) : (
            <Text style={{ fontSize: 25 }}>No menstruation events</Text>
        )}
        </>
    )
}

export default CycleTime