import React, { useEffect, useState } from 'react';
import { DateData, Calendar as RNCalendar, CalendarUtils } from 'react-native-calendars';

import { useTheme } from '../theme/ThemeContext';
import { useDb } from '../database/DbManager';
import { Event, isSameDate } from '../database/Types';
import CalendarEditDialog from './CalendarEditDialog';
import { CalendarColors } from '../theme/Colors';

const Calendar = () => {
    // Getting theme and data contexts
    const { theme } = useTheme();
    const { events, updateEvent } = useDb();

    // Marking dates
    const [loadingDates, setLoadingDates] = useState(true);
    const [markedDates, setMarkedDates] = useState({});
    useEffect(() => {
        const formattedDates = formatCalendarDates(events);
        setMarkedDates({ ...formattedDates });
        setLoadingDates(false);
    }, [events]);
    const formatCalendarDates = (events: Event[]) => {
        const markedDates: { [dateKey: string]: { selected: boolean; startingDay: boolean; endingDay: boolean; marked: boolean, color: string, dotColor: string, customStyles: any } } = {};

        events.forEach(event => {
            const dateKey = CalendarUtils.getCalendarDateString(event.date);
            const color = getEventColor(event);
            const dotColor = getEventDotColor(event);
            markedDates[dateKey] = {
                selected: true,
                startingDay: true,
                endingDay: true,
                marked: true,
                color,
                dotColor,
                customStyles: {}
            };
        });
    
        return markedDates;
    };
    const getEventColor = (event: Event) => {
        if (event.menstruation) return CalendarColors.menstruation;
        else if (event.ovulation) return CalendarColors.ovulation;
        else return CalendarColors.off;
    };
    const getEventDotColor = (event: Event) => {
        if (event.tablet) return CalendarColors.tablet;
        else return CalendarColors.off;
    };

    // Edit dialog
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedDateEvents, setSelectedDateEvents] = useState<Event>();
    const calendarDayPress = (date: DateData) => {
        let event = events.find(e => isSameDate(date, e.date));
        if (!event)
            event = { date: new Date(date.dateString), menstruation: false, ovulation: false, tablet: false };

        setSelectedDateEvents(event);
        setDialogVisible(true);
    };

    return (
        <>
            <RNCalendar
                key={theme.mode} // Force remount when theme changes
                horizontal={true}
                pagingEnabled={true}
                futureScrollRange={0}
                enableSwipeMonths={true}
                hideArrows={true}
                showSixWeeks={true}
                hideExtraDays={true}
                firstDay={1}
                markingType={'period'}
                markedDates={markedDates}
                displayLoadingIndicator={loadingDates}
                onDayPress={(date: DateData) => {calendarDayPress(date)}}
                theme={{
                    calendarBackground: theme.colors.background,
                    dayTextColor: theme.colors.onBackground,
                    monthTextColor: theme.colors.onBackground,
                }}
            />

            <CalendarEditDialog
                visible={dialogVisible}
                onCancel={() => {
                    setDialogVisible(false)
                    setSelectedDateEvents(undefined)
                }}
                onDone={(updatedDateEvent: Event) => {
                    updateEvent(updatedDateEvent);
                    setDialogVisible(false)
                    setSelectedDateEvents(undefined)
                }}
                selectedDateEvents={selectedDateEvents}
            />
        </>
    );
};

export default Calendar;
