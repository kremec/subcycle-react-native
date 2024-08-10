import React, { useEffect, useState } from 'react';
import { DateData, Calendar as RNCalendar, CalendarUtils } from 'react-native-calendars';

import { useTheme } from '../theme/ThemeContext';
import { useDb } from '../database/DbManager';
import { MenstrualEvent } from '../database/Types';

const formatMenstrualEvents = (events: MenstrualEvent[]) => {
    const markedDates: { [dateKey: string]: { selected: boolean; startingDay: boolean; endingDay: boolean; color: string } } = {};
    
    events.forEach(event => {
        const dateKey = CalendarUtils.getCalendarDateString(event.date);
        markedDates[dateKey] = {
            selected: true,
            startingDay: true,
            endingDay: true,
            color: 'red',
        };
    });

    return markedDates;
};

const Calendar = () => {
    const { theme } = useTheme();
    const { menstrualEvents, ovulationEvents, tabletEvents, addMenstrualEvent } = useDb();

    const [loadingDates, setLoadingDates] = useState(false);
    
    const [markedDates, setMarkedDates] = useState({});
    useEffect(() => {
        const newMarkedDates = formatMenstrualEvents(menstrualEvents);
        setMarkedDates(newMarkedDates);
    }, [menstrualEvents]);

    return (
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
            onDayPress={(date: DateData) => {
                const selectedDate = new Date(date.dateString);
                addMenstrualEvent(selectedDate);
            }}
            theme={{
                calendarBackground: theme.colors.background,
                textSectionTitleColor: theme.colors.onBackground,
                dayTextColor: theme.colors.onBackground,
                todayTextColor: theme.colors.onBackground,
                selectedDayBackgroundColor: theme.colors.onBackground,
                arrowColor: theme.colors.onBackground,
                monthTextColor: theme.colors.onBackground,
            }}
        />
    );
};

export default Calendar;
