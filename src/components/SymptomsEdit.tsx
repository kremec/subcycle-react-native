import React, { useCallback, useEffect, useMemo } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native'
import { Divider, Text } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import { BottomSheetModal } from '@gorhom/bottom-sheet'

import { getWeekdayDayMonth, Symptoms, SymptomTypes } from '../app/Types'
import { useTheme } from '../theme/ThemeContext'
import SymptomCard from './SymptomCard'

const SymptomsEdit = ({
    bottomSheetModalRef,
    selectedSymptoms,
    onChange
}: {
    bottomSheetModalRef: React.RefObject<BottomSheetModal>
    selectedSymptoms: Symptoms
    onChange: (symptoms: Symptoms) => void
}) => {
    const { theme } = useTheme()

    useEffect(() => {
        bottomSheetModalRef.current?.present()
    }, [bottomSheetModalRef])

    const snapPoints = useMemo(() => ['90%'], [])

    // Close the modal if the user is at the top and scrolls up
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (event.nativeEvent.contentOffset.y <= 0) {
            bottomSheetModalRef.current?.dismiss()
        }
    }

    const handleSymptomToggle = useCallback(
        (key: keyof Symptoms) => {
            if (key !== 'date') {
                let updatedSymptoms = { ...selectedSymptoms, [key]: !selectedSymptoms[key] }

                // Menstruation flows
                if (key === 'menstruationLow' && updatedSymptoms.menstruationLow) {
                    updatedSymptoms = {
                        ...updatedSymptoms,
                        menstruationMedium: false,
                        menstruationStrong: false
                    }
                } else if (key === 'menstruationMedium' && updatedSymptoms.menstruationMedium) {
                    updatedSymptoms = {
                        ...updatedSymptoms,
                        menstruationLow: false,
                        menstruationStrong: false
                    }
                } else if (key === 'menstruationStrong' && updatedSymptoms.menstruationStrong) {
                    updatedSymptoms = {
                        ...updatedSymptoms,
                        menstruationLow: false,
                        menstruationMedium: false
                    }
                }

                // Sex
                if (key === 'sexDriveVeryLow' && updatedSymptoms.sexDriveVeryLow) {
                    updatedSymptoms = {
                        ...updatedSymptoms,
                        sexDriveLow: false,
                        sexDriveHigh: false,
                        sexDriveVeryHigh: false
                    }
                } else if (key === 'sexDriveLow' && updatedSymptoms.sexDriveLow) {
                    updatedSymptoms = {
                        ...updatedSymptoms,
                        sexDriveVeryLow: false,
                        sexDriveHigh: false,
                        sexDriveVeryHigh: false
                    }
                } else if (key === 'sexDriveHigh' && updatedSymptoms.sexDriveHigh) {
                    updatedSymptoms = {
                        ...updatedSymptoms,
                        sexDriveVeryLow: false,
                        sexDriveLow: false,
                        sexDriveVeryHigh: false
                    }
                } else if (key === 'sexDriveVeryHigh' && updatedSymptoms.sexDriveVeryHigh) {
                    updatedSymptoms = {
                        ...updatedSymptoms,
                        sexDriveVeryLow: false,
                        sexDriveLow: false,
                        sexDriveHigh: false
                    }
                }

                onChange(updatedSymptoms)
            }
        },
        [selectedSymptoms, onChange]
    )

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={-1}
            snapPoints={snapPoints}
            style={{
                borderTopColor: theme.colors.onBackground,
                borderWidth: 1,
                borderRadius: 10
            }}
            backgroundStyle={{ backgroundColor: theme.colors.background }}
            enableDismissOnClose={false}
        >
            <Text variant="titleLarge" style={{ paddingLeft: 10, color: theme.colors.onBackground }}>
                Symptoms for {getWeekdayDayMonth(selectedSymptoms.date)}
            </Text>
            <Divider style={{ marginTop: 10 }} />
            <ScrollView decelerationRate={0.9} showsVerticalScrollIndicator={false} onScrollEndDrag={handleScroll}>
                {SymptomTypes.map((type) => (
                    <View key={type.name} style={{ paddingVertical: 10 }}>
                        <Text
                            variant="titleMedium"
                            style={{
                                paddingLeft: 10,
                                color: theme.colors.onBackground
                            }}
                        >
                            {type.name}
                        </Text>
                        <ScrollView horizontal decelerationRate={0.9}>
                            {type.types.map((symptom) => {
                                const key: keyof Symptoms = symptom.key as keyof Symptoms
                                return (
                                    <SymptomCard
                                        key={symptom.name}
                                        icon={symptom.icon}
                                        text={symptom.name}
                                        backgroundColor={type.backgroundColor}
                                        onBackgroundColor={theme.colors.onBackground}
                                        filled={symptom.filled}
                                        onPress={() => handleSymptomToggle(key)}
                                        selected={selectedSymptoms[key] === true}
                                    />
                                )
                            })}
                        </ScrollView>
                    </View>
                ))}
            </ScrollView>
        </BottomSheetModal>
    )
}

export default SymptomsEdit
