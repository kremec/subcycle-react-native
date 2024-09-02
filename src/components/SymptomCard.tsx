import React, { useState } from 'react'
import { Dimensions } from 'react-native';
import { Card, Text } from 'react-native-paper'
import { Icon } from '@tabler/icons-react-native'

import { useTheme } from '../theme/ThemeContext';

const SymptomCard = ({ icon: Icon, text, backgroundColor, filled, onPress }: { icon: Icon, text: string, backgroundColor: string, filled: boolean | undefined, onPress: () => void }) => {
    const { theme } = useTheme();
    const windowWidth = Dimensions.get('window').width;

    const [isPressed, setIsPressed] = useState(false);

    return (
        <Card
            style={{
                backgroundColor,
                marginHorizontal: 2,
                width: (windowWidth - 18) / 4,
                height: 95,
                opacity: isPressed ? 1 : 0.5,
                borderWidth: isPressed ? 1 : 0, borderColor: theme.colors.onBackground,
                justifyContent: 'center',
                alignItems: 'center'
            }}
            onPress={() => {
                onPress()
                setIsPressed(!isPressed)
            }}
        >
            <Card.Content style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Icon size={40} strokeWidth={!filled ? 1.5 : 0} fill={filled ? theme.colors.onBackground : 'transparent'} color={filled ? theme.colors.onBackground : theme.colors.onBackground} />
                <Text variant='bodySmall'>{text}</Text>
            </Card.Content>
        </Card>
    )
}

export default SymptomCard