import React, { useEffect, useMemo } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { Divider, Text } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { getWeekdayDayMonth, Symptoms, SymptomTypes } from '../app/Types';
import { useTheme } from '../theme/ThemeContext';
import SymptomCard from './SymptomCard';

const SymptomsEdit = ({ bottomSheetModalRef, selectedSymptoms, onChange }: { bottomSheetModalRef: React.RefObject<BottomSheetModal>, selectedSymptoms: Symptoms, onChange: (symptoms: Symptoms) => void }) => {
    const { theme } = useTheme();

    useEffect(() => {
        bottomSheetModalRef.current?.present();
    }, [bottomSheetModalRef]);

    const snapPoints = useMemo(() => ["90%"], []);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const yOffset = event.nativeEvent.contentOffset.y;

        // Close the modal if the user is at the top and scrolls up
        if (yOffset <= 0) {
            // Add a little threshold if needed, e.g., -10
            bottomSheetModalRef.current?.dismiss();
        }
    };

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={-1}
            snapPoints={snapPoints}
            style={{ borderTopColor: theme.colors.onBackground, borderWidth: 1, borderRadius: 10 }}
            backgroundStyle={{ backgroundColor: theme.colors.background }}
            enableDismissOnClose={false}
        >
            <Text variant='titleLarge' style={{ paddingLeft: 10, color: theme.colors.onBackground }}>Symptoms for {getWeekdayDayMonth(selectedSymptoms.date)}</Text>
            <Divider style={{ marginTop: 10 }} />
            <ScrollView decelerationRate={0.9} showsVerticalScrollIndicator={false} onScrollEndDrag={handleScroll}>
                {SymptomTypes.map((type) => (
                    <View key={type.name} style={{ paddingVertical: 10 }}>
                        <Text variant='titleMedium' style={{ paddingLeft: 10, color: theme.colors.onBackground }}>{type.name}</Text>
                        <ScrollView
                            horizontal
                            decelerationRate={0.9}
                        >
                            {
                                type.types.map((symptom) => {
                                    const key: keyof Symptoms = symptom.key as keyof Symptoms;
                                    return (
                                        <SymptomCard
                                            key={symptom.name}
                                            icon={symptom.icon}
                                            text={symptom.name}
                                            backgroundColor={type.backgroundColor}
                                            filled={symptom.filled}
                                            onPress={() => {
                                                if (key !== "date")
                                                    selectedSymptoms[key] = !selectedSymptoms[key]
                                                onChange(selectedSymptoms)
                                            }}
                                            selected={selectedSymptoms[key] === true}
                                        />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>

                ))}
            </ScrollView>
        </BottomSheetModal >
    )
}

export default SymptomsEdit