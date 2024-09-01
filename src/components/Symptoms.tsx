import React from 'react'
import { Card, IconButton } from 'react-native-paper'

import { useAppContext } from '../app/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { getWeekdayDayMonth } from '../app/Types';

const Symptoms = ({ selectedDate }: { selectedDate: Date }) => {
    const { updateEvent } = useAppContext();
    const { theme } = useTheme();

    return (
        <Card style={{ backgroundColor: theme.colors.background }}>
            <Card.Title title={`Symptoms for ${getWeekdayDayMonth(selectedDate)}`} />
            <Card.Content>
                <IconButton
                    mode='outlined'
                    icon='plus'
                    style={{ borderRadius: 10 }}
                    onPress={() => { }}
                />
            </Card.Content>
        </Card>
    )
}

export default Symptoms