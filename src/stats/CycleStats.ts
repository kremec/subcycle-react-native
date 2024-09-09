import { Event, EventPeriod, isSameDate, Symptoms } from '../app/Types'

const getEventKeysValue = (event: Event, eventNames: string[]) => {
    const eventKeys = eventNames.map((eventName) => eventName as keyof Event);
    const found = eventKeys.some((eventKey) => {
        return Boolean(event[eventKey]);  // Using Boolean() to ensure truthiness
    });
    return found;
}
export const getEventPeriods = (events: Event[], eventNames: string[]) => {
    const eventPeriods: EventPeriod[] = []
    events.forEach((event) => {
        var dayBefore = new Date(event.date)
        dayBefore.setDate(event.date.getDate() - 1)
        var dayAfter = new Date(event.date)
        dayAfter.setDate(event.date.getDate() + 1)

        if (!event.prediction && getEventKeysValue(event, eventNames) && !events.some((e) => isSameDate(e.date, dayBefore) && getEventKeysValue(e, eventNames))) {
            // event is the is the first day of a menstruation period
            var periodLength = 1
            while (events.some((e) => isSameDate(e.date, dayAfter) && getEventKeysValue(e, eventNames))) {
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
    const menstruationPeriods: EventPeriod[] = getEventPeriods(events, ["menstruationLight", "menstruationModerate", "menstruationHeavy", "menstruationSpotting"])

    console.log(menstruationPeriods )
    const averageEventCycleLength = getAverageEventCycleLength(menstruationPeriods)
    return averageEventCycleLength
}

export const getAveragePeriodLength = (events: Event[]) => {
    const menstruationPeriods: EventPeriod[] = getEventPeriods(events, ["menstruationLight", "menstruationModerate", "menstruationHeavy", "menstruationSpotting"])

    const averagePeriodLength = getAverageEventPeriodLength(menstruationPeriods)
    return averagePeriodLength
}

export const getAverageHeavyPeriodLength = (events: Event[]) => {
    const heavyMenstruationPeriods: EventPeriod[] = getEventPeriods(events, ["menstruationHeavy"])

    const averageHeavyPeriodLength = getAverageEventPeriodLength(heavyMenstruationPeriods)
    return averageHeavyPeriodLength
}