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
    }, [events, theme]);
    const formatCalendarDates = (events: Event[]) => {
        const markedDates: { [dateKey: string]: { selected: boolean; startingDay: boolean; endingDay: boolean; marked: boolean, color: string, dotColor: string, textColor: string } } = {};

        events.forEach(event => {
            const dateKey = CalendarUtils.getCalendarDateString(event.date);
            const color = getEventColor(event);
            const dotColor = getEventDotColor(event);

            var dayBefore = new Date();
            dayBefore.setDate(event.date.getDate() - 1);
            var dayAfter = new Date();
            dayAfter.setDate(event.date.getDate() + 1);

            markedDates[dateKey] = {
                selected: true,
                // If there is no event on the previous day with same color, mark it as starting day
                startingDay: !events.some(e => isSameDate(e.date, dayBefore) && getEventColor(event) === getEventColor(e)),
                // If there is no event on the next day with same color, mark it as ending day
                endingDay: !events.some(e => isSameDate(e.date, dayAfter) && getEventColor(event) === getEventColor(e)),
                marked: true,
                color,
                dotColor,
                textColor: event.menstruation || event.ovulation ? theme.colors.background : theme.colors.onBackground,
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
                    selectedDayTextColor: 'black',
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
