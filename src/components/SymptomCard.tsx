import React, { memo } from 'react'
import { Card, Text } from 'react-native-paper'
import { Icon } from '@tabler/icons-react-native'

const SymptomCard = ({
    icon: Icon,
    text,
    backgroundColor,
    onBackgroundColor,
    filled,
    selected,
    onPress
}: {
    icon: Icon
    text: string
    backgroundColor: string
    onBackgroundColor: string
    filled: boolean | undefined
    selected: boolean
    onPress: () => void
}) => {
    return (
        <Card
            style={{
                backgroundColor: backgroundColor,
                marginHorizontal: 2,
                minWidth: 78,
                height: 100,
                opacity: selected ? 1 : 0.4,
                padding: selected ? 0 : 2,
                borderWidth: selected ? 2 : 0,
                borderColor: onBackgroundColor,
                justifyContent: 'center',
                alignItems: 'center'
            }}
            onPress={onPress}
        >
            <Card.Content
                style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Icon size={40} strokeWidth={!filled ? 1.5 : 0} fill={filled ? onBackgroundColor : 'transparent'} color={onBackgroundColor} />
                <Text
                    variant="bodySmall"
                    style={{
                        color: onBackgroundColor,
                        opacity: 1
                    }}
                >
                    {text}
                </Text>
            </Card.Content>
        </Card>
    )
}

export default memo(SymptomCard)
