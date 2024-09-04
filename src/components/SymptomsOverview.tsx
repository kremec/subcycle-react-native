import React, { useMemo, useRef } from 'react'
import { Card, IconButton } from 'react-native-paper'

import { defaultSymptoms, getWeekdayDayMonth, isSameDate, Symptoms, SymptomTypes } from '../app/Types';
import { useTheme } from '../theme/ThemeContext';
import SymptomsEdit from './SymptomsEdit';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelectedDateContext, useSymptomsContext } from '../app/AppContext';

const SymptomsOverview = () => {
    const { theme } = useTheme();
    const { symptoms, updateSymptoms } = useSymptomsContext();
    const { selectedDate } = useSelectedDateContext();

    const selectedSymptoms = useMemo(() => {
        return symptoms.find(s => isSameDate(s.date, selectedDate)) || defaultSymptoms(selectedDate);
    }, [symptoms, selectedDate]);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    return (
        <>
            <Card style={{ backgroundColor: theme.colors.background }}>
                <Card.Title title={`Symptoms for ${getWeekdayDayMonth(selectedDate)}`} />
                <Card.Content>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <IconButton
                            mode='outlined'
                            icon='plus'
                            style={{ borderRadius: 10 }}
                            onPress={() => bottomSheetModalRef.current?.snapToIndex(0)}
                        />
                        <ScrollView
                            horizontal
                            decelerationRate={0.9}
                        >
                            {
                                SymptomTypes.map((type) => (
                                    type.types.map((symptom) => {
                                        if (selectedSymptoms[symptom.key as keyof Symptoms]) {
                                            const Icon = symptom.icon;
                                            return (
                                                <Icon
                                                    key={symptom.key}  // Adding key prop
                                                    size={40}
                                                    strokeWidth={!symptom.filled ? 1.5 : 0}
                                                    fill={symptom.filled ? type.backgroundColor : 'transparent'}
                                                    color={type.backgroundColor}
                                                />
                                            );
                                        }
                                        return null;
                                    })
                                ))
                            }
                        </ScrollView>
                    </View>
                </Card.Content>
            </Card>
            <SymptomsEdit
                bottomSheetModalRef={bottomSheetModalRef}
                selectedSymptoms={selectedSymptoms}
                onChange={(symptoms) => { updateSymptoms(symptoms) }}
            />
        </>
    )
}

export default SymptomsOverview