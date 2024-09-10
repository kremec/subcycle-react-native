import * as SQLite from 'expo-sqlite'
import { DateData } from 'react-native-calendars'
import { SymptomColors } from '../theme/Colors'
import {
    IconArrowBadgeDown,
    IconArrowBadgeUp,
    IconBalloon,
    IconBarbell,
    IconBedOff,
    IconBike,
    IconBolt,
    IconCactus,
    IconChartBubble,
    IconChartRadar,
    IconDroplet,
    IconDropletHalfFilled,
    IconDropletOff,
    IconIceCream2,
    IconMoodAngry,
    IconMoodAnnoyed,
    IconMoodCry,
    IconMoodHappy,
    IconMoodNeutral,
    IconMoodSad,
    IconMoodSadSquint,
    IconMoodSick,
    IconPoo,
    IconRipple,
    IconRun,
    IconSnowflake,
    IconToolsKitchen2,
    IconTrekking
} from '@tabler/icons-react-native'

export type DbVersion = {
    version: number
}

export type DbEvent = {
    date: Date
    menstruationLight: boolean
    menstruationModerate: boolean
    menstruationHeavy: boolean
    menstruationSpotting: boolean
    ovulation: boolean
    pill: boolean
}
export type Event = {
    date: Date
    menstruationLight: boolean
    menstruationModerate: boolean
    menstruationHeavy: boolean
    menstruationSpotting: boolean
    ovulation: boolean
    pill: boolean
    prediction: boolean
}
export const defaultEvent = (date: Date): Event => ({
    date,
    menstruationLight: false,
    menstruationModerate: false,
    menstruationHeavy: false,
    menstruationSpotting: false,
    ovulation: false,
    pill: false,
    prediction: false
})

export type DbSymptoms = {
    date: Date
    symptoms_intestinal_problems: boolean
    symptoms_appetite_changes: boolean
    symptoms_bloating: boolean
    symptoms_chills: boolean
    symptoms_cramps: boolean
    symptoms_dry_skin: boolean
    symptoms_insomnia: boolean
    symptoms_nausea: boolean
    discharge_watery: boolean
    discharge_creamy: boolean
    discharge_sticky: boolean
    discharge_dry: boolean
    sex_drive_very_low: boolean
    sex_drive_low: boolean
    sex_drive_high: boolean
    sex_drive_very_high: boolean
    exercise_running: boolean
    exercise_cycling: boolean
    exercise_hiking: boolean
    exercise_gym: boolean
    mood_angry: boolean
    mood_happy: boolean
    mood_neutral: boolean
    mood_sad: boolean
    mood_annoyed: boolean
    mood_sensitive: boolean
    mood_irritated: boolean
}
export type Symptoms = {
    date: Date
    symptomsIntestinalProblems: boolean
    symptomsAppetiteChanges: boolean
    symptomsBloating: boolean
    symptomsChills: boolean
    symptomsCramps: boolean
    symptomsDrySkin: boolean
    symptomsInsomnia: boolean
    symptomsNausea: boolean
    dischargeWatery: boolean
    dischargeCreamy: boolean
    dischargeSticky: boolean
    dischargeDry: boolean
    libidoVeryLow: boolean
    libidoLow: boolean
    libidoHigh: boolean
    libidoVeryHigh: boolean
    exerciseRunning: boolean
    exerciseCycling: boolean
    exerciseHiking: boolean
    exerciseGym: boolean
    moodAngry: boolean
    moodHappy: boolean
    moodNeutral: boolean
    moodSad: boolean
    moodAnnoyed: boolean
    moodSensitive: boolean
    moodIrritated: boolean
}
export const defaultSymptoms = (date: Date): Symptoms => ({
    date,
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
    libidoVeryLow: false,
    libidoLow: false,
    libidoHigh: false,
    libidoVeryHigh: false,
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
})

export const SymptomTypes = [
    {
        name: 'Symptoms',
        backgroundColor: SymptomColors.symptoms,
        types: [
            { key: 'symptomsIntestinalProblems', name: 'Intestinal\nproblems', icon: IconPoo },
            { key: 'symptomsAppetiteChanges', name: 'Appetite\nchanges', icon: IconToolsKitchen2 },
            { key: 'symptomsBloating', name: 'Bloating', icon: IconBalloon },
            { key: 'symptomsChills', name: 'Chills', icon: IconSnowflake },
            { key: 'symptomsCramps', name: 'Cramps', icon: IconBolt },
            { key: 'symptomsDrySkin', name: 'Dry skin', icon: IconDropletOff },
            { key: 'symptomsInsomnia', name: 'Insomnia', icon: IconBedOff },
            { key: 'symptomsNausea', name: 'Nausea', icon: IconMoodSick }
        ]
    },
    {
        name: 'Discharge',
        backgroundColor: SymptomColors.discharge,
        types: [
            { key: 'dischargeWatery', name: 'Watery', icon: IconRipple },
            { key: 'dischargeCreamy', name: 'Creamy', icon: IconIceCream2 },
            { key: 'dischargeSticky', name: 'Sticky', icon: IconChartRadar },
            { key: 'dischargeDry', name: 'Dry', icon: IconCactus }
        ]
    },
    {
        name: 'Libido',
        backgroundColor: SymptomColors.libido,
        types: [
            { key: 'libidoVeryLow', name: 'Very low', icon: IconArrowBadgeDown, filled: true },
            { key: 'libidoLow', name: 'Low', icon: IconArrowBadgeDown },
            { key: 'libidoHigh', name: 'High', icon: IconArrowBadgeUp },
            { key: 'libidoVeryHigh', name: 'Very high', icon: IconArrowBadgeUp, filled: true }
        ]
    },
    {
        name: 'Exercise',
        backgroundColor: SymptomColors.exercise,
        types: [
            { key: 'exerciseRunning', name: 'Running', icon: IconRun },
            { key: 'exerciseCycling', name: 'Cycling', icon: IconBike },
            { key: 'exerciseHiking', name: 'Hiking', icon: IconTrekking },
            { key: 'exerciseGym', name: 'Gym', icon: IconBarbell }
        ]
    },
    {
        name: 'Moods',
        backgroundColor: SymptomColors.moods,
        types: [
            { key: 'moodAngry', name: 'Angry', icon: IconMoodAngry },
            { key: 'moodHappy', name: 'Happy', icon: IconMoodHappy },
            { key: 'moodNeutral', name: 'Neutral', icon: IconMoodNeutral },
            { key: 'moodSad', name: 'Sad', icon: IconMoodSad },
            { key: 'moodAnnoyed', name: 'Annoyed', icon: IconMoodAnnoyed },
            { key: 'moodSensitive', name: 'Sensitive', icon: IconMoodCry },
            { key: 'moodIrritated', name: 'Irritated', icon: IconMoodSadSquint }
        ]
    }
]


export type MarkedDate = {
    date: Date
    marked: boolean
    startingDay: boolean
    endingDay: boolean
    color: string
    textColor: string
    dotColor: string
    selected: boolean,
    prediction: boolean,
    onPress: () => void
}


export type EventPeriod = {
    start: Date
    dayLength: number
}


export type EventsContext = {
    events: Event[]
    updateEvent: (event: Event) => void
}
export type SymptomsContext = {
    symptoms: Symptoms[]
    updateSymptoms: (symptoms: Symptoms) => void
}
export type SettingsContext = {
    settings: Settings
    updateSettings: (settings: Settings) => void
}
export type DbContext = {
    db: SQLite.SQLiteDatabase
    setDb: (db: SQLite.SQLiteDatabase) => void
}
export type SelectedDateContext = {
    selectedDate: Date
    setSelectedDate: (date: Date) => void
}

export type Settings = {
    predictionsTimespan: number
    notificationTime: Date
    partnerMode: boolean
}

export const isSameDate = (date1: Date | DateData, date2: Date | DateData): boolean => {
    const getDateComponents = (date: Date | DateData): { year: number; month: number; day: number } => {
        if (date instanceof Date) {
            return {
                year: date.getFullYear(),
                month: date.getMonth() + 1, // Months are zero-based in JavaScript's Date
                day: date.getDate()
            }
        } else {
            return {
                year: date.year,
                month: date.month,
                day: date.day
            }
        }
    }

    const date1Components = getDateComponents(date1)
    const date2Components = getDateComponents(date2)

    return date1Components.year === date2Components.year && date1Components.month === date2Components.month && date1Components.day === date2Components.day
}

export const getMonthYear = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long'
    }
    return date.toLocaleDateString(undefined, options)
}
export const getWeekdayDayMonth = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    }
    return date.toLocaleDateString(undefined, options)
}
export const getHourMinute = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric'
    }
    return date.toLocaleTimeString(undefined, options)
}
