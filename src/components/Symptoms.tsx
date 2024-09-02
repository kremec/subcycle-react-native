import React, { useMemo, useRef } from 'react'
import { View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper'
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { useAppContext } from '../app/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { getWeekdayDayMonth } from '../app/Types';
import { IconArrowBadgeDown, IconArrowBadgeUp, IconBalloon, IconBarbell, IconBedOff, IconBike, IconBolt, IconCompass, IconDroplet, IconDropletHalfFilled, IconDropletOff, IconDroplets, IconMoodAngry, IconMoodAnnoyed, IconMoodCry, IconMoodHappy, IconMoodNeutral, IconMoodSad, IconMoodSadDizzy, IconMoodSadSquint, IconMoodSick, IconPoo, IconRun, IconSnowflake, IconToolsKitchen2, IconTrekking } from '@tabler/icons-react-native';
import { SymptomColors } from '../theme/Colors';
import SymptomCard from './SymptomCard';
import { ScrollView } from 'react-native-gesture-handler';

const Symptoms = ({ selectedDate }: { selectedDate: Date }) => {
    const { updateEvent } = useAppContext();
    const { theme } = useTheme();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['25%', '50%', "75%", "90%"], []);

    const symptoms = [
        {
            name: "Menstruation",
            backgroundColor: SymptomColors.menstruation,
            values: [
                { icon: IconDroplet, text: "Low", iconProps: {} },
                { icon: IconDropletHalfFilled, text: "Medium", filled: true },
                { icon: IconDroplet, text: "Strong", filled: true },
                { icon: IconDroplets, text: "Spotting", filled: true },
            ]
        },
        {
            name: "Symptoms",
            backgroundColor: SymptomColors.symptoms,
            values: [
                { icon: IconPoo, text: "Intestinal\nproblems" },
                { icon: IconToolsKitchen2, text: "Appetite\nchanges" },
                { icon: IconBalloon, text: "Bloating" },
                { icon: IconSnowflake, text: "Chills" },
                { icon: IconBolt, text: "Cramps" },
                { icon: IconDropletOff, text: "Dry\nskin" },
                { icon: IconBedOff, text: "Insomnia" },
                { icon: IconMoodSick, text: "Nausea" },
            ]
        },
        {
            name: "Moods",
            backgroundColor: SymptomColors.moods,
            values: [
                { icon: IconMoodAngry, text: "Angry" },
                { icon: IconMoodHappy, text: "Happy" },
                { icon: IconMoodNeutral, text: "Neutral" },
                { icon: IconMoodSad, text: "Sad" },
                { icon: IconMoodAnnoyed, text: "Annoyed" },
                { icon: IconMoodCry, text: "Sensitive" },
                { icon: IconMoodSadSquint, text: "Irritated" },
            ]
        },
        {
            name: "Sex drive",
            backgroundColor: SymptomColors.sexDrive,
            values: [
                { icon: IconArrowBadgeDown, text: "Very low", filled: true },
                { icon: IconArrowBadgeDown, text: "Low" },
                { icon: IconArrowBadgeUp, text: "High" },
                { icon: IconArrowBadgeUp, text: "Very high", filled: true },
            ]
        },
        {
            name: "Exercise",
            backgroundColor: SymptomColors.exercise,
            values: [
                { icon: IconRun, text: "Running" },
                { icon: IconBike, text: "Cycling" },
                { icon: IconTrekking, text: "Hiking" },
                { icon: IconBarbell, text: "Gym" },
            ]
        }
    ]

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

                {symptoms.map((symptom) => (
                    <View key={symptom.name} style={{ paddingVertical: 10 }}>
                        <Text variant='titleMedium' style={{ paddingLeft: 10 }}>{symptom.name}</Text>
                        <ScrollView
                            horizontal
                            decelerationRate={0.9}
                        >
                            {
                                symptom.values.map((value) => (
                                    <SymptomCard
                                        key={value.text}
                                        icon={value.icon}
                                        text={value.text}
                                        backgroundColor={symptom.backgroundColor}
                                        filled={value.filled}
                                        onPress={() => console.log(symptom.name + ": " + value.text)}
                                    />
                                ))
                            }
                        </ScrollView>
                    </View>

                ))}
            </BottomSheetModal >
        </>
    )
}

export default Symptoms