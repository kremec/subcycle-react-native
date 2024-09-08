import { Event, EventPeriod, isSameDate, Symptoms } from '../app/Types'

export const getEventPeriods = (events: Event[], eventName: string) => {
    const eventPeriods: EventPeriod[] = []
    events.forEach((event) => {
        var dayBefore = new Date(event.date)
        dayBefore.setDate(event.date.getDate() - 1)
        var dayAfter = new Date(event.date)
        dayAfter.setDate(event.date.getDate() + 1)

        const eventKey = eventName as keyof Event
        if (!event.prediction && event[eventKey] && !events.some((e) => isSameDate(e.date, dayBefore) && e[eventKey])) {
            // event is the is the first day of a menstruation period
            var periodLength = 1
            while (events.some((e) => isSameDate(e.date, dayAfter) && e[eventKey])) {
                dayAfter.setDate(dayAfter.getDate() + 1)
                periodLength++
            }

            eventPeriods.push({ start: event.date, dayLength: periodLength })
        }
    })
    if (eventPeriods.length == 0)
        return []

    eventPeriods.sort((a, b) => a.start.getTime() - b.start.getTime())
    return eventPeriods
}

export const getSymptomPeriods = (symptoms: Symptoms[], symptomName: string) => {
    const symptomPeriods: EventPeriod[] = []
    symptoms.forEach((symptom) => {
        var dayBefore = new Date(symptom.date)
        dayBefore.setDate(symptom.date.getDate() - 1)
        var dayAfter = new Date(symptom.date)
        dayAfter.setDate(symptom.date.getDate() + 1)

        const symptomKey = symptomName as keyof Symptoms
        if (symptom[symptomKey] && !symptoms.some((s) => isSameDate(s.date, dayBefore) && s[symptomKey])) {
            // event is the is the first day of a menstruation period
            var periodLength = 1
            while (symptoms.some((s) => isSameDate(s.date, dayAfter) && s[symptomKey])) {
                dayAfter.setDate(dayAfter.getDate() + 1)
                periodLength++
            }

            symptomPeriods.push({ start: symptom.date, dayLength: periodLength })
        }
    })
    if (symptomPeriods.length == 0)
        return []

    symptomPeriods.sort((a, b) => a.start.getTime() - b.start.getTime())
    return symptomPeriods
}

export const getAverageEventCycleLength = (eventPeriods: EventPeriod[]) => {
    const timesBetweenEventPeriods: number[] = []
    for (let i = 0; i < eventPeriods.length - 1; i++) {
        const startDate = eventPeriods[i].start
        const nextStartDate = eventPeriods[i + 1].start
        const msTimeBetweenPeriods = nextStartDate.getTime() - startDate.getTime()
        timesBetweenEventPeriods.push(msTimeBetweenPeriods / (1000 * 60 * 60 * 24))
    }
    if (timesBetweenEventPeriods.length == 0)
        return NaN

    var averageEventCycleLength = timesBetweenEventPeriods.reduce((acc, time) => acc + time, 0) / timesBetweenEventPeriods.length
    return averageEventCycleLength
}

export const getAverageEventPeriodLength = (eventPeriods: EventPeriod[]) => {
    const averageEventPeriodLength = eventPeriods.reduce((acc, period) => acc + period.dayLength, 0) / eventPeriods.length
    return averageEventPeriodLength
}

export const getAverageCycleLength = (events: Event[]) => {
    const menstruationPeriods: EventPeriod[] = getEventPeriods(events, "menstruation")

    const averageEventCycleLength = getAverageEventCycleLength(menstruationPeriods)
    return averageEventCycleLength
}

export const getAveragePeriodLength = (events: Event[]) => {
    const menstruationPeriods: EventPeriod[] = getEventPeriods(events, "menstruation")

    const averagePeriodLength = getAverageEventPeriodLength(menstruationPeriods)
    return averagePeriodLength
}

export const getAverageStrongPeriodLength = (symptoms: Symptoms[]) => {
    const menstruationPeriods: EventPeriod[] = getSymptomPeriods(symptoms, "menstruationStrong")

    const averageStrongPeriodLength = getAverageEventPeriodLength(menstruationPeriods)
    return averageStrongPeriodLength
}