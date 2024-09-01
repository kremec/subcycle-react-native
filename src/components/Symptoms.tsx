import React, { useMemo, useRef } from 'react'
import { View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper'
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { useAppContext } from '../app/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { getWeekdayDayMonth } from '../app/Types';
import { IconDroplet } from '@tabler/icons-react-native';

const Symptoms = ({ selectedDate }: { selectedDate: Date }) => {
    const { updateEvent } = useAppContext();
    const { theme } = useTheme();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['25%', '50%', "75%"], []);

    return (
        <>
            <Card style={{ backgroundColor: theme.colors.background }}>
                <Card.Title title={`Symptoms for ${getWeekdayDayMonth(selectedDate)}`} />
                <Card.Content>
                    <IconButton
                        mode='outlined'
                        icon='plus'
                        style={{ borderRadius: 10 }}
                        onPress={() => bottomSheetModalRef.current?.present()}
                    />
                </Card.Content>
            </Card>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={2}
                snapPoints={snapPoints}
                style={{ borderColor: theme.colors.onBackground, borderWidth: 1, borderRadius: 10 }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                    <Card>
                        <Card.Content>
                            <IconDroplet size={20} color={theme.colors.onBackground} />
                            <Text>Low</Text>
                        </Card.Content>
                    </Card>
                </View>
            </BottomSheetModal >
        </>
    )
}

export default Symptoms