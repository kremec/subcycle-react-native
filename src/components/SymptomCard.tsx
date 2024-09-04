import React, { memo } from 'react'
import { Card, Text } from 'react-native-paper'
import { Icon } from '@tabler/icons-react-native'

import { useTheme } from '../theme/ThemeContext';

const SymptomCard = ({ icon: Icon, text, backgroundColor, filled, selected, onPress }: { icon: Icon, text: string, backgroundColor: string, filled: boolean | undefined, selected: boolean, onPress: () => void }) => {
    const { theme } = useTheme();

    return (
        <Card
            style={{
                backgroundColor,
                marginHorizontal: 2,
                minWidth: 80,
                height: 100,
                opacity: selected ? 1 : 0.5,
                borderWidth: selected ? 1 : 0, borderColor: theme.colors.onBackground,
                justifyContent: 'center',
                alignItems: 'center'
            }}
            onPress={onPress}
        >
            <Card.Content style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Icon size={40} strokeWidth={!filled ? 1.5 : 0} fill={filled ? theme.colors.onBackground : 'transparent'} color={theme.colors.onBackground} />
                <Text variant='bodySmall' style={{ color: theme.colors.onBackground }}>{text}</Text>
            </Card.Content>
        </Card>
    )
}

export default memo(SymptomCard)