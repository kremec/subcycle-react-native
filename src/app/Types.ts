import * as SQLite from 'expo-sqlite';
import { DateData } from "react-native-calendars";
import { SymptomColors } from '../theme/Colors';
import { IconArrowBadgeDown, IconArrowBadgeUp, IconBalloon, IconBarbell, IconBedOff, IconBike, IconBolt, IconCactus, IconChartBubble, IconChartRadar, IconDroplet, IconDropletHalfFilled, IconDropletOff, IconIceCream2, IconMoodAngry, IconMoodAnnoyed, IconMoodCry, IconMoodHappy, IconMoodNeutral, IconMoodSad, IconMoodSadSquint, IconMoodSick, IconPoo, IconRipple, IconRun, IconSnowflake, IconToolsKitchen2, IconTrekking } from '@tabler/icons-react-native';

export type DbEvent = {
    date: Date;
    menstruation: boolean;
    ovulation: boolean;
    pill: boolean;
};
export type Event = {
    date: Date;
    menstruation: boolean;
    ovulation: boolean;
    pill: boolean;
    prediction: boolean;
};

export type DbSymptoms = {
    date: Date;
    menstruation_low: boolean;
    menstruation_medium: boolean;
    menstruation_strong: boolean;
    menstruation_spotting: boolean;
    symptoms_intestinal_problems: boolean;
    symptoms_appetite_changes: boolean;
    symptoms_bloating: boolean;
    symptoms_chills: boolean;
    symptoms_cramps: boolean;
    symptoms_dry_skin: boolean;
    symptoms_insomnia: boolean;
    symptoms_nausea: boolean;
    discharge_watery: boolean;
    discharge_creamy: boolean;
    discharge_sticky: boolean;
    discharge_dry: boolean;
    sex_drive_very_low: boolean;
    sex_drive_low: boolean;
    sex_drive_high: boolean;
    sex_drive_very_high: boolean;
    exercise_running: boolean;
    exercise_cycling: boolean;
    exercise_hiking: boolean;
    exercise_gym: boolean;
    mood_angry: boolean;
    mood_happy: boolean;
    mood_neutral: boolean;
    mood_sad: boolean;
    mood_annoyed: boolean;
    mood_sensitive: boolean;
    mood_irritated: boolean;
};
export type Symptoms = {
    date: Date;
    menstruationLow: boolean;
    menstruationMedium: boolean;
    menstruationStrong: boolean;
    menstruationSpotting: boolean;
    symptomsIntestinalProblems: boolean;
    symptomsAppetiteChanges: boolean;
    symptomsBloating: boolean;
    symptomsChills: boolean;
    symptomsCramps: boolean;
    symptomsDrySkin: boolean;
    symptomsInsomnia: boolean;
    symptomsNausea: boolean;
    dischargeWatery: boolean;
    dischargeCreamy: boolean;
    dischargeSticky: boolean;
    dischargeDry: boolean;
    sexDriveVeryLow: boolean;
    sexDriveLow: boolean;
    sexDriveHigh: boolean;
    sexDriveVeryHigh: boolean;
    exerciseRunning: boolean;
    exerciseCycling: boolean;
    exerciseHiking: boolean;
    exerciseGym: boolean;
    moodAngry: boolean;
    moodHappy: boolean;
    moodNeutral: boolean;
    moodSad: boolean;
    moodAnnoyed: boolean;
    moodSensitive: boolean;
    moodIrritated: boolean;
};

export const defaultSymptoms = (date: Date): Symptoms => ({
    date,
    menstruationLow: false,
    menstruationMedium: false,
    menstruationStrong: false,
    menstruationSpotting: false,
    symptomsIntestinalProblems: false,
    symptomsAppetiteChanges: false,
    symptomsBloating: false,
    symptomsChills: false,
    symptomsCramps: false,
    symptomsDrySkin: false,
    symptomsInsomnia: false,
    symptomsNausea: false,
    dischargeWatery: false,
    dischargeCreamy: false,
    dischargeSticky: false,
    dischargeDry: false,
    sexDriveVeryLow: false,
    sexDriveLow: false,
    sexDriveHigh: false,
    sexDriveVeryHigh: false,
    exerciseRunning: false,
    exerciseCycling: false,
    exerciseHiking: false,
    exerciseGym: false,
    moodAngry: false,
    moodHappy: false,
    moodNeutral: false,
    moodSad: false,
    moodAnnoyed: false,
    moodSensitive: false,
    moodIrritated: false
});

export const SymptomTypes = [
    {
        name: "Menstruation",
        backgroundColor: SymptomColors.menstruation,
        types: [
            { key: "menstruationLow", name: "Low", icon: IconDroplet },
            { key: "menstruationMedium", name: "Medium", icon: IconDropletHalfFilled, filled: true },
            { key: "menstruationStrong", name: "Strong", icon: IconDroplet, filled: true },
            { key: "menstruationSpotting", name: "Spotting", icon: IconChartBubble, filled: true },
        ]
    },
    {
        name: "Symptoms",
        backgroundColor: SymptomColors.symptoms,
        types: [
            { key: "symptomsIntestinalProblems", name: "Intestinal\nproblems", icon: IconPoo },
            { key: "symptomsAppetiteChanges", name: "Appetite\nchanges", icon: IconToolsKitchen2 },
            { key: "symptomsBloating", name: "Bloating", icon: IconBalloon },
            { key: "symptomsChills", name: "Chills", icon: IconSnowflake },
            { key: "symptomsCramps", name: "Cramps", icon: IconBolt },
            { key: "symptomsDrySkin", name: "Dry skin", icon: IconDropletOff },
            { key: "symptomsInsomnia", name: "Insomnia", icon: IconBedOff },
            { key: "symptomsNausea", name: "Nausea", icon: IconMoodSick },
        ]
    },
    {
        name: "Discharge",
        backgroundColor: SymptomColors.discharge,
        types: [
            { key: "dischargeWatery", name: "Watery", icon: IconRipple },
            { key: "dischargeCreamy", name: "Creamy", icon: IconIceCream2 },
            { key: "dischargeSticky", name: "Sticky", icon: IconChartRadar },
            { key: "dischargeDry", name: "Dry", icon: IconCactus },
        ]
    },
    {
        name: "Sex drive",
        backgroundColor: SymptomColors.sexDrive,
        types: [
            { key: "sexDriveVeryLow", name: "Very low", icon: IconArrowBadgeDown, filled: true },
            { key: "sexDriveLow", name: "Low", icon: IconArrowBadgeDown },
            { key: "sexDriveHigh", name: "High", icon: IconArrowBadgeUp },
            { key: "sexDriveVeryHigh", name: "Very high", icon: IconArrowBadgeUp, filled: true },
        ]
    },
    {
        name: "Exercise",
        backgroundColor: SymptomColors.exercise,
        types: [
            { key: "exerciseRunning", name: "Running", icon: IconRun },
            { key: "exerciseCycling", name: "Cycling", icon: IconBike },
            { key: "exerciseHiking", name: "Hiking", icon: IconTrekking },
            { key: "exerciseGym", name: "Gym", icon: IconBarbell },
        ]
    },
    {
        name: "Moods",
        backgroundColor: SymptomColors.moods,
        types: [
            { key: "moodAngry", name: "Angry", icon: IconMoodAngry },
            { key: "moodHappy", name: "Happy", icon: IconMoodHappy },
            { key: "moodNeutral", name: "Neutral", icon: IconMoodNeutral },
            { key: "moodSad", name: "Sad", icon: IconMoodSad },
            { key: "moodAnnoyed", name: "Annoyed", icon: IconMoodAnnoyed },
            { key: "moodSensitive", name: "Sensitive", icon: IconMoodCry },
            { key: "moodIrritated", name: "Irritated", icon: IconMoodSadSquint },
        ]
    }
]

export type EventPeriod = {
    start: Date;
    dayLength: number;
}

export type Context = {
    events: Event[];
    updateEvent: (event: Event) => void;
    symptoms: Symptoms[];
    updateSymptoms: (symptoms: Symptoms) => void;
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    settings: Settings;
    updateSettings: (settings: Settings) => void;
    db: SQLite.SQLiteDatabase;
    setDb: (db: SQLite.SQLiteDatabase) => void;
};

export type Settings = {
    predictionsTimespan: number;
    notificationTime: Date;
    partnerMode: boolean;
};

export const isSameDate = (date1: Date | DateData, date2: Date | DateData): boolean => {
    const getDateComponents = (date: Date | DateData): { year: number, month: number, day: number } => {
        if (date instanceof Date) {
            return {
                year: date.getFullYear(),
                month: date.getMonth() + 1, // Months are zero-based in JavaScript's Date
                day: date.getDate()
            };
        } else {
            return {
                year: date.year,
                month: date.month,
                day: date.day
            };
        }
    };

    const date1Components = getDateComponents(date1);
    const date2Components = getDateComponents(date2);

    return (
        date1Components.year === date2Components.year &&
        date1Components.month === date2Components.month &&
        date1Components.day === date2Components.day
    );
};

export const getMonthYear = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long'
    };
    return date.toLocaleDateString(undefined, options);
}
export const getWeekdayDayMonth = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    };
    return date.toLocaleDateString(undefined, options);
}
export const getHourMinute = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric'
    };
    return date.toLocaleTimeString(undefined, options);
}