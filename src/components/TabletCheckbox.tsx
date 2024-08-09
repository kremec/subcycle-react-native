import React from 'react'
import { Checkbox } from 'react-native-paper';

const TabletCheckbox = () => {
    const [checked, setChecked] = React.useState(false);
    return (
        <Checkbox.Item
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
                setChecked(!checked);
            }}
            label='Contraception pill taken today'
            color='green'
        />
    )
}

export default TabletCheckbox