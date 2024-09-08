import React, { useCallback, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import { DateData, Calendar as RNCalendar } from 'react-native-calendars'

import { useTheme } from '../theme/ThemeContext'
import { useEventsContext, useSelectedDateContext, useSymptomsContext } from '../app/AppContext'
import { Event, getMonthYear, isSameDate, MarkedDate, Symptoms } from '../app/Types'
import CalendarEditDialog from './CalendarEditDialog'
import { CalendarColors } from '../theme/Colors'

import CalendarDay from './CalendarDay'

const Calendar = () => {
    // Getting theme and data contexts
    const { theme } = useTheme()
    const { events, updateEvent } = useEventsContext()
    const { symptoms } = useSymptomsContext()
    const { selectedDate, setSelectedDate } = useSelectedDateContext()

    // Marking dates
    const [loadingDates, setLoadingDates] = useState(true)
    const [markedDates, setMarkedDates] = useState<MarkedDate[]>([])
    useEffect(() => {
        setLoadingDates(true)

        // Watch out to not mutate events array in this function
        const formattedEvents = formatCalendarDates(events, symptoms)
        setMarkedDates(formattedEvents)

        setLoadingDates(false)
    }, [events, symptoms, selectedDate, theme])

    const formatCalendarDates = useCallback(
        (events: Event[], symptoms: Symptoms[]) => {
            const markedDates: MarkedDate[] = []

            events.forEach((event) => {
                const color = getEventColor(event, symptoms)
                const dotColor = getEventDotColor(event)

                var dayBefore = new Date(event.date)
                dayBefore.setDate(event.date.getDate() - 1)
                var dayAfter = new Date(event.date)
                dayAfter.setDate(event.date.getDate() + 1)

                const startingDay = !events.some((e) => isSameDate(e.date, dayBefore) && combineEvents(event, e))
                const endingDay = !events.some((e) => isSameDate(e.date, dayAfter) && combineEvents(event, e))

                markedDates.push({
                    date: event.date,
                    marked: true,
                    startingDay,
                    endingDay,
                    color,
                    textColor: !event.prediction && (event.menstruation || event.ovulation) ? theme.colors.background : theme.colors.onBackground,
                    dotColor,
                    selected: false,
                    prediction: event.prediction,
                    onPress: () => {}
                })
            })

            return markedDates
        },
        [events, selectedDate, theme]
    )
    const combineEvents = useCallback((event1: Event, event2: Event) => {
        if (event1.menstruation && event2.menstruation && event1.prediction === event2.prediction) return true
        else if (event1.ovulation && event2.ovulation && event1.prediction === event2.prediction) return true
        return false
    }, [])
    const getEventColor = useCallback((event: Event, symptoms: Symptoms[]) => {
        if (event.ovulation) return CalendarColors.ovulation
        else if (event.menstruation) {
            if (!event.prediction) {
                const symptomsForDate = symptoms.find((s) => isSameDate(s.date, event.date))
                if (symptomsForDate) {
                    if (symptomsForDate.menstruationLow) return CalendarColors.menstruationLow
                    else if (symptomsForDate.menstruationMedium) return CalendarColors.menstruationMedium
                    else if (symptomsForDate.menstruationStrong) return CalendarColors.menstruationHeavy
                }
            }
            return CalendarColors.menstruationMedium
        } else return CalendarColors.off
    }, [])
    const getEventDotColor = useCallback((event: Event) => {
        if (event.pill) return CalendarColors.pill
        else return CalendarColors.off
    }, [])

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
                dayComponent={({ date }: { date: DateData }) => {
                    const markedDate = markedDates.find((m) => isSameDate(date, m.date))
                    if (markedDate) {
                        return (
                            <CalendarDay
                                markedDate={{
                                    ...markedDate,
                                    selected: isSameDate(date, selectedDate),
                                    onPress: () => calendarDayPress(date)
                                }}
                            />
                        )
                    }
                    return (
                        <CalendarDay
                            markedDate={{
                                date: new Date(date.dateString),
                                startingDay: false,
                                endingDay: false,
                                marked: false,
                                color: theme.colors.background,
                                textColor: theme.colors.onBackground,
                                dotColor: theme.colors.background,
                                selected: isSameDate(date, selectedDate),
                                prediction: false,
                                onPress: () => calendarDayPress(date)
                            }}
                        />
                    )
                }}
                displayLoadingIndicator={loadingDates}
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
