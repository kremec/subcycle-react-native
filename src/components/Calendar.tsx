import React, { useCallback, useEffect, useState } from 'react'
import { DateData, Calendar as RNCalendar, CalendarUtils } from 'react-native-calendars'

import { useTheme } from '../theme/ThemeContext'
import { useEventsContext, useSelectedDateContext } from '../app/AppContext'
import { Event, getMonthYear, isSameDate } from '../app/Types'
import CalendarEditDialog from './CalendarEditDialog'
import { CalendarColors } from '../theme/Colors'

import { TextStyle, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'

const Calendar = () => {
    // Getting theme and data contexts
    const { theme } = useTheme()
    const { events, updateEvent } = useEventsContext()
    const { selectedDate, setSelectedDate } = useSelectedDateContext()

    // Marking dates
    const [loadingDates, setLoadingDates] = useState(true)
    const [markedDates, setMarkedDates] = useState({})
    useEffect(() => {
        setLoadingDates(true)

        // Watch out to not mutate events array in this function
        const formattedEvents = formatCalendarDates(events)
        setMarkedDates({ ...formattedEvents })

        setLoadingDates(false)
    }, [events, selectedDate, theme])

    const formatCalendarDates = useCallback(
        (events: Event[]) => {
            const markedDates: { [dateKey: string]: { selected: boolean; startingDay: boolean; endingDay: boolean; marked: boolean; color: string; dotColor: string; customTextStyle?: TextStyle } } =
                {}

            events.forEach((event) => {
                const dateKey = CalendarUtils.getCalendarDateString(event.date)
                const color = getEventColor(event)
                const dotColor = getEventDotColor(event)
                const customTextStyle = getEventTextStyle(event)

                var dayBefore = new Date(event.date)
                dayBefore.setDate(event.date.getDate() - 1)
                var dayAfter = new Date(event.date)
                dayAfter.setDate(event.date.getDate() + 1)

                markedDates[dateKey] = {
                    selected: true,
                    // If there is no event on the previous day with same color, mark it as starting day
                    startingDay: !events.some((e) => isSameDate(e.date, dayBefore) && getEventColor(event) === getEventColor(e)),
                    // If there is no event on the next day with same color, mark it as ending day
                    endingDay: !events.some((e) => isSameDate(e.date, dayAfter) && getEventColor(event) === getEventColor(e)),
                    marked: true,
                    color,
                    dotColor,
                    customTextStyle
                }
            })
            if (!events.some((e) => isSameDate(e.date, selectedDate)))
                markedDates[CalendarUtils.getCalendarDateString(selectedDate)] = {
                    selected: true,
                    startingDay: false,
                    endingDay: false,
                    marked: true,
                    color: theme.colors.background,
                    dotColor: theme.colors.background,
                    customTextStyle: { color: theme.colors.onBackground, fontWeight: 'bold' }
                }

            return markedDates
        },
        [events, selectedDate, theme]
    )
    const getEventColor = useCallback((event: Event) => {
        if (event.prediction) {
            if (event.menstruation) return CalendarColors.predictedMenstruation
            else if (event.ovulation) return CalendarColors.predictedOvulation
            else return CalendarColors.off
        } else {
            if (event.menstruation) return CalendarColors.menstruation
            else if (event.ovulation) return CalendarColors.ovulation
            else return CalendarColors.off
        }
    }, [])
    const getEventDotColor = useCallback((event: Event) => {
        if (event.pill) return CalendarColors.pill
        else return CalendarColors.off
    }, [])
    const getEventTextStyle = useCallback(
        (event: Event) => {
            const textStyle: TextStyle = { color: event.menstruation || event.ovulation ? theme.colors.background : theme.colors.onBackground }

            if (isSameDate(event.date, selectedDate)) textStyle.fontWeight = 'bold'

            return textStyle
        },
        [selectedDate, theme]
    )

    // Edit dialog
    const [dialogVisible, setDialogVisible] = useState(false)
    const [editEvent, setEditEvent] = useState<Event>()

    const calendarDayPress = useCallback(
        (date: DateData) => {
            let event = events.find((e) => isSameDate(date, e.date))
            if (!event) event = { date: new Date(date.dateString), menstruation: false, ovulation: false, pill: false, prediction: false }

            if (isSameDate(event.date, selectedDate)) {
                setEditEvent(event)
                setDialogVisible(true)
            } else setSelectedDate(event.date)
        },
        [events, selectedDate]
    )

    const [headerClicked, setHeaderClicked] = useState(false)
    const renderHeader = useCallback(
        (date: string) => (
            <TouchableOpacity
                onPress={() => {
                    setHeaderClicked((prev) => !prev)
                    setSelectedDate(new Date())
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{getMonthYear(new Date(date))}</Text>
            </TouchableOpacity>
        ),
        [setSelectedDate]
    )

    return (
        <>
            <RNCalendar
                key={`${theme.mode}-${headerClicked}`} // Force remount when theme changes
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
                    calendarDayPress(date)
                }}
                renderHeader={renderHeader}
                theme={{
                    calendarBackground: theme.colors.background,
                    dayTextColor: theme.colors.onBackground,
                    monthTextColor: theme.colors.onBackground,
                    selectedDayTextColor: 'black'
                }}
            />

            <CalendarEditDialog
                visible={dialogVisible}
                onCancel={() => {
                    setDialogVisible(false)
                    setEditEvent(undefined)
                }}
                onDone={(updatedDateEvent: Event) => {
                    updateEvent(updatedDateEvent)
                    setDialogVisible(false)
                    setEditEvent(undefined)
                }}
                selectedEvent={editEvent}
            />
        </>
    )
}

export default Calendar
