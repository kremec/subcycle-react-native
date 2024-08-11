import { DateData } from "react-native-calendars";

export type Event = {
    date: Date;
    menstruation: boolean;
    ovulation: boolean;
    tablet: boolean;
};

export type DbData = {
    events: Event[];
    updateEvent: (event: Event) => void;
};

export const isSameDate = (dateData: DateData, date: Date): boolean => {
    const yearMatches = dateData.year === date.getFullYear();
    const monthMatches = dateData.month === date.getMonth() + 1; // getMonth() is 0-based
    const dayMatches = dateData.day === date.getDate();

    return yearMatches && monthMatches && dayMatches;
};