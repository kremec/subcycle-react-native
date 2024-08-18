import { DateData } from "react-native-calendars";

export type Event = {
    date: Date;
    menstruation: boolean;
    ovulation: boolean;
    tablet: boolean;
    prediction: boolean;
};

export type EventPeriod = {
    start: Date;
    dayLength: number;
}

export type Context = {
    events: Event[];
    updateEvent: (event: Event) => void;
    settings: Settings;
    updateSettings: (settings: Settings) => void;
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
        weekday:'short',
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