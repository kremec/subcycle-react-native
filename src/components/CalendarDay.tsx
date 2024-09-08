import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Text } from 'react-native-paper'
import { IconCircle } from '@tabler/icons-react-native'

import { MarkedDate } from '../app/Types'

const CalendarDay = ({ markedDate }: { markedDate: MarkedDate }) => {
    const borderWidth = 2
    const borderRadius = 20

    return (
        <TouchableOpacity
            style={{
                width: markedDate.endingDay ? '101%' : '100%',
                height: 'auto',
                paddingVertical: 5,
                backgroundColor: !markedDate.prediction ? markedDate.color : 'transparent',
                borderTopLeftRadius: markedDate.startingDay ? borderRadius : 0,
                borderBottomLeftRadius: markedDate.startingDay ? borderRadius : 0,
                borderTopRightRadius: markedDate.endingDay ? borderRadius : 0,
                borderBottomRightRadius: markedDate.endingDay ? borderRadius : 0,
                borderTopWidth: markedDate.prediction ? borderWidth : 0,
                borderBottomWidth: markedDate.prediction ? borderWidth : 0,
                borderLeftWidth: markedDate.prediction && markedDate.startingDay ? borderWidth : 0,
                borderRightWidth: markedDate.prediction && markedDate.endingDay ? borderWidth : 0,
                borderColor: markedDate.color,
                justifyContent: 'center'
            }}
            onPress={markedDate.onPress}
        >
            <View style={{ alignItems: 'center' }}>
                <Text variant="bodyLarge" style={{ textAlign: 'center', justifyContent: 'center', fontWeight: markedDate.selected ? 'bold' : 'normal' }}>
                    {markedDate.date.getDate()}
                </Text>
                <IconCircle size={5} color={markedDate.dotColor} strokeWidth={3} fill={markedDate.dotColor} style={{ position: 'absolute', bottom: -3 }} />
            </View>
        </TouchableOpacity>
    )
}

export default CalendarDay
