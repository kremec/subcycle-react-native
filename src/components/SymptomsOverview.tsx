import React, { useEffect, useRef, useState } from 'react'
import { Card, IconButton } from 'react-native-paper'

import { defaultSymptoms, getWeekdayDayMonth, isSameDate, Symptoms } from '../app/Types';
import { useTheme } from '../theme/ThemeContext';
import { useAppContext } from '../app/AppContext';
import SymptomsEdit from './SymptomsEdit';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const SymptomsOverview = () => {
    const { theme } = useTheme();
    const { symptoms, updateSymptoms, selectedDate } = useAppContext();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    return (
        <>
            <Card style={{ backgroundColor: theme.colors.background }}>
                <Card.Title title={`Symptoms for ${getWeekdayDayMonth(selectedDate)}`} />
                <Card.Content>
                    <IconButton
                        mode='outlined'
                        icon='plus'
                        style={{ borderRadius: 10 }}
                        onPress={() => { bottomSheetModalRef.current?.snapToIndex(0) }}
                    />
                </Card.Content>
            </Card>
            <SymptomsEdit
                bottomSheetModalRef={bottomSheetModalRef}
                selectedSymptoms={symptoms.find(s => isSameDate(s.date, selectedDate)) || defaultSymptoms(selectedDate)}
                onChange={(symptoms) => { updateSymptoms(symptoms) }}
            />
        </>
    )
}

export default SymptomsOverview