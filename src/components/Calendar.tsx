import React, { useState } from 'react';
import { DateData, Calendar as RNCalendar } from 'react-native-calendars';
import { useTheme } from '../theme/ThemeContext';

const Calendar = () => {
    const { theme } = useTheme();

    const [loadingDates, setLoadingDates] = useState(false);
    const [markedDates, setMarkedDates] = useState({
        [new Date().toISOString().split('T')[0]]: { selected: true, startingDay: true, endingDay: true, color: 'red' }, // Today
    });

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
                console.log("Add menstrual event for date: ", selectedDate);
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
