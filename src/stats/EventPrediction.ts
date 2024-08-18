import { Event, EventPeriod, isSameDate } from '../app/Types';

export const getMenstruationPredictions = (events: Event[], predictionPeriod: number) => {
    const menstruationPeriods: EventPeriod[] = [];
    events.forEach(event => {
        var dayBefore = new Date(event.date);
        dayBefore.setDate(event.date.getDate() - 1);
        var dayAfter = new Date(event.date);
        dayAfter.setDate(event.date.getDate() + 1);

        if (!event.prediction && event.menstruation && !events.some(e => isSameDate(e.date, dayBefore) && e.menstruation)) {
            // event is the is the first day of a menstruation period
            var periodLength = 1;
            while (events.some(e => isSameDate(e.date, dayAfter) && e.menstruation)) {
                dayAfter.setDate(dayAfter.getDate() + 1);
                periodLength++;
            }

            menstruationPeriods.push({ start: event.date, dayLength: periodLength });
        }
    });
    if (menstruationPeriods.length == 0)
        return [];

    menstruationPeriods.sort((a, b) => a.start.getTime() - b.start.getTime());

    // Average menstruation period length
    const averageMenstruationPeriodLength = menstruationPeriods.reduce((acc, period) => acc + period.dayLength, 0) / menstruationPeriods.length;

    // Average time between menstruation periods
    const timesBetweenMenstruationPeriods: number[] = [];
    for (let i = 0; i < menstruationPeriods.length - 1; i++) {
        const startDate = menstruationPeriods[i].start;
        const nextStartDate = menstruationPeriods[i + 1].start;
        const msTimeBetweenPeriods = nextStartDate.getTime() - startDate.getTime();
        timesBetweenMenstruationPeriods.push(msTimeBetweenPeriods / (1000 * 60 * 60 * 24));
    }
    if (timesBetweenMenstruationPeriods.length == 0)
        return [];
    var averageTimeBetweenMenstruationPeriods = timesBetweenMenstruationPeriods.reduce((acc, time) => acc + time, 0) / timesBetweenMenstruationPeriods.length;

    // Predict menstruation events for next year
    const predictedMenstruationEvents: Event[] = [];
    var lastMenstruationPeriodStartDate = menstruationPeriods[menstruationPeriods.length - 1].start;
    for (let sequentialPrediction = 0; sequentialPrediction < predictionPeriod; sequentialPrediction++) {
        lastMenstruationPeriodStartDate = new Date(new Date(lastMenstruationPeriodStartDate).setDate(lastMenstruationPeriodStartDate.getDate() + averageTimeBetweenMenstruationPeriods));
        for (let dayInPredictedPeriod = 0; dayInPredictedPeriod < averageMenstruationPeriodLength; dayInPredictedPeriod++) {
            const date = new Date(new Date(lastMenstruationPeriodStartDate).setDate(lastMenstruationPeriodStartDate.getDate() + dayInPredictedPeriod));
            predictedMenstruationEvents.push({ date, menstruation: true, ovulation: false, pill: false, prediction: true });
        }
    }

    return predictedMenstruationEvents;
}

export const getOvulationPredictions = (events: Event[], predictionPeriod: number) => {
    const ovulationPeriods: EventPeriod[] = [];
    events.forEach(event => {
        var dayBefore = new Date(event.date);
        dayBefore.setDate(event.date.getDate() - 1);
        var dayAfter = new Date(event.date);
        dayAfter.setDate(event.date.getDate() + 1);

        if (event.ovulation && !events.some(e => isSameDate(e.date, dayBefore) && e.ovulation)) {
            // event is the is the first day of a menstruation period
            var periodLength = 1;
            while (events.some(e => isSameDate(e.date, dayAfter) && e.ovulation)) {
                dayAfter.setDate(dayAfter.getDate() + 1);
                periodLength++;
            }

            ovulationPeriods.push({ start: event.date, dayLength: periodLength });
        }
    });
    if (ovulationPeriods.length == 0)
        return [];

    ovulationPeriods.sort((a, b) => a.start.getTime() - b.start.getTime());

    // Average ovulation period length
    const averageOvulationPeriodLength = ovulationPeriods.reduce((acc, period) => acc + period.dayLength, 0) / ovulationPeriods.length;

    // Average time between ovulation periods
    const timesBetweenOvulationPeriods: number[] = [];
    for (let i = 0; i < ovulationPeriods.length - 1; i++) {
        const startDate = ovulationPeriods[i].start;
        const nextStartDate = ovulationPeriods[i + 1].start;
        const msTimeBetweenPeriods = nextStartDate.getTime() - startDate.getTime();
        timesBetweenOvulationPeriods.push(msTimeBetweenPeriods / (1000 * 60 * 60 * 24));
    }
    if (timesBetweenOvulationPeriods.length == 0)
        return [];
    var averageTimeBetweenOvulationPeriods = timesBetweenOvulationPeriods.reduce((acc, time) => acc + time, 0) / timesBetweenOvulationPeriods.length;

    // Predict ovulation events for next year
    const predictedOvulationEvents: Event[] = [];
    var lastOvulationPeriodStartDate = ovulationPeriods[ovulationPeriods.length - 1].start;
    for (let sequentialPrediction = 0; sequentialPrediction < predictionPeriod; sequentialPrediction++) {
        lastOvulationPeriodStartDate = new Date(new Date(lastOvulationPeriodStartDate).setDate(lastOvulationPeriodStartDate.getDate() + averageTimeBetweenOvulationPeriods));
        for (let dayInPredictedPeriod = 0; dayInPredictedPeriod < averageOvulationPeriodLength; dayInPredictedPeriod++) {
            const date = new Date(new Date(lastOvulationPeriodStartDate).setDate(lastOvulationPeriodStartDate.getDate() + dayInPredictedPeriod));
            predictedOvulationEvents.push({ date, menstruation: false, ovulation: true, pill: false, prediction: true });
        }
    }

    return predictedOvulationEvents;
}