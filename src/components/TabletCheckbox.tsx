import React from 'react'
import { Checkbox } from 'react-native-paper';
import { CalendarColors } from '../theme/Colors';

const TabletCheckbox = () => {
    const [checked, setChecked] = React.useState(false);
    return (
        <Checkbox.Item
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
                setChecked(!checked);
            }}
            label='Contraception pill taken today'
            color={CalendarColors.tablet}
        />
    )
}

export default TabletCheckbox