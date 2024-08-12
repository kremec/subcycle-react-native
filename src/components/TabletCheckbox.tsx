import React, { useEffect } from 'react'
import { Checkbox } from 'react-native-paper';

import { CalendarColors } from '../theme/Colors';
import { useDb } from '../database/DbManager';
import { isSameDate } from '../database/Types';

const TabletCheckbox = () => {
    const { events, updateEvent } = useDb();

    const [visible, setVisible] = React.useState(false);
    const [checked, setChecked] = React.useState(false);

    useEffect(() => {
        const tabletToday = events.some(e => isSameDate(e.date, new Date()) && e.tablet);
        setVisible(!tabletToday);
        setChecked(tabletToday);
    }, [events]);

    return (
        visible && <Checkbox.Item
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
                setChecked(!checked);
                let event = events.find(e => isSameDate(new Date(), e.date));
                if (!event)
                    event = { date: new Date(), menstruation: false, ovulation: false, tablet: !checked };
                updateEvent(event);
            }}
            label='Contraception pill taken today'
            color={CalendarColors.tablet}
        />
    )
}

export default TabletCheckbox