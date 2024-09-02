import React, { useMemo, useRef, useState } from 'react'
import { Animated, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { Card, Divider, IconButton, Text } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { IconArrowBadgeDown, IconArrowBadgeUp, IconBalloon, IconBarbell, IconBedOff, IconBike, IconBolt, IconCactus, IconChartBubble, IconChartRadar, IconDroplet, IconDropletHalfFilled, IconDropletOff, IconDroplets, IconIceCream2, IconMoodAngry, IconMoodAnnoyed, IconMoodCry, IconMoodHappy, IconMoodNeutral, IconMoodSad, IconMoodSadSquint, IconMoodSick, IconPoo, IconRipple, IconRun, IconSnowflake, IconToolsKitchen2, IconTrekking } from '@tabler/icons-react-native';

import { getWeekdayDayMonth } from '../app/Types';
import { SymptomColors } from '../theme/Colors';
import { useTheme } from '../theme/ThemeContext';
import SymptomCard from './SymptomCard';

const Symptoms = ({ selectedDate }: { selectedDate: Date }) => {
    const { theme } = useTheme();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["90%"], []);

    const [scrollY, setScrollY] = useState(new Animated.Value(0));
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const yOffset = event.nativeEvent.contentOffset.y;
        setScrollY(new Animated.Value(yOffset));

        // Close the modal if the user is at the top and scrolls up
        if (yOffset <= 0) {
            // Add a little threshold if needed, e.g., -10
            bottomSheetModalRef.current?.dismiss();
        }
    };

    const symptoms = [
        {
            name: "Menstruation",
            backgroundColor: SymptomColors.menstruation,
            values: [
                { icon: IconDroplet, text: "Low", iconProps: {} },
                { icon: IconDropletHalfFilled, text: "Medium", filled: true },
                { icon: IconDroplet, text: "Strong", filled: true },
                { icon: IconChartBubble, text: "Spotting", filled: true },
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
                { icon: IconDropletOff, text: "Dry skin" },
                { icon: IconBedOff, text: "Insomnia" },
                { icon: IconMoodSick, text: "Nausea" },
            ]
        },
        {
            name: "Discharge",
            backgroundColor: SymptomColors.discharge,
            values: [
                { icon: IconRipple, text: "Watery" },
                { icon: IconIceCream2, text: "Creamy" },
                { icon: IconChartRadar, text: "Sticky" },
                { icon: IconCactus, text: "Dry" },
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
                        onPress={() => bottomSheetModalRef.current?.snapToIndex(0)}
                    />
                </Card.Content>
            </Card>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                style={{ borderTopColor: theme.colors.onBackground, borderWidth: 1, borderRadius: 10 }}
                backgroundStyle={{ backgroundColor: theme.colors.background }}
                enableDismissOnClose={false}
            >
                <Text variant='titleLarge' style={{ paddingLeft: 10, color: theme.colors.onBackground }}>Symptoms for {getWeekdayDayMonth(selectedDate)}</Text>
                <Divider style={{ marginTop: 10 }} />
                <ScrollView decelerationRate={0.9} showsVerticalScrollIndicator={false} onScrollEndDrag={handleScroll}>
                    {symptoms.map((symptom) => (
                        <View key={symptom.name} style={{ paddingVertical: 10 }}>
                            <Text variant='titleMedium' style={{ paddingLeft: 10, color: theme.colors.onBackground }}>{symptom.name}</Text>
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
                </ScrollView>
            </BottomSheetModal >
        </>
    )
}

export default Symptoms