import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as SQLite from 'expo-sqlite';

import { useTheme } from '../theme/ThemeContext';
import { Context, Event, isSameDate, Settings, Symptoms } from './Types';

import { createTables, insertEventToDb, updateEventInDb, getEventsFromDb, deleteEventFromDb, getSymptomsFromDb, updateSymptomsInDb, deleteSymptomsFromDb, insertSymptomsToDb } from '../data/SqlDbCalls';
import { getMenstruationPredictions, getOvulationPredictions } from '../stats/EventPrediction';
import { getSettings, storeSettings } from '../data/AsyncStorageCalls';

const defaultDb = SQLite.openDatabaseSync("subcycle.db");
const defaultSettings: Settings = {
    predictionsTimespan: 1,
    notificationTime: new Date(new Date().setHours(18, 0, 0)),
    partnerMode: false,
};
const defaultContextValue: Context = {
    events: [],
    updateEvent: (_event: Event) => { },
    symptoms: [],
    updateSymptoms: (_symptoms: Symptoms) => { },
    selectedDate: new Date(),
    setSelectedDate: (_date: Date) => { },
    settings: defaultSettings,
    updateSettings: (_settings: Settings) => { },
    db: defaultDb,
    setDb: (_db: SQLite.SQLiteDatabase) => { },
};
const Ctx = createContext(defaultContextValue);

export const AppContext = ({ children }: { children: ReactNode }) => {
    const { theme } = useTheme();

    const [db, setDb] = useState<SQLite.SQLiteDatabase>(defaultDb);
    __DEV__ && useDrizzleStudio(db);

    const [dbEvents, setDbEvents] = useState<Event[]>(defaultContextValue.events);
    const [dbSymptoms, setDbSymptoms] = useState<Symptoms[]>(defaultContextValue.symptoms);
    const [events, setEvents] = useState<Event[]>(defaultContextValue.events);
    const [symptoms, setSymptoms] = useState<Symptoms[]>(defaultContextValue.symptoms);
    const [selectedDate, setSelectedDate] = useState<Date>(defaultContextValue.selectedDate);

    const [settings, setSettings] = useState<Settings>(defaultSettings);

    async function updateEvent(event: Event) {
        if (event.prediction)
            return;

        const hasEvents =
            event.menstruation ||
            event.ovulation ||
            event.pill;
        const existingEvent = dbEvents.find(e => isSameDate(e.date, event.date));
        if (!existingEvent) {
            if (hasEvents) { // Insert if event is new and has at least some event
                setDbEvents([...dbEvents, event]);
                await insertEventToDb(db, event);
            }
        }
        else {
            if (hasEvents) { // Update if event has at least one event
                const tempEvents = dbEvents.filter(e => !isSameDate(e.date, event.date));
                setDbEvents([...tempEvents, event]);
                await updateEventInDb(db, existingEvent);
            }
            else { // Delete if event has no events
                setDbEvents(dbEvents.filter(e => !isSameDate(e.date, event.date)));
                await deleteEventFromDb(db, event.date);
            }
        }
    }

    async function updateSymptoms(symptoms: Symptoms) {
        const hasSymptoms =
            symptoms.menstruationLow ||
            symptoms.menstruationMedium ||
            symptoms.menstruationStrong ||
            symptoms.menstruationSpotting ||
            symptoms.symptomsIntestinalProblems ||
            symptoms.symptomsAppetiteChanges ||
            symptoms.symptomsBloating ||
            symptoms.symptomsChills ||
            symptoms.symptomsCramps ||
            symptoms.symptomsDrySkin ||
            symptoms.symptomsInsomnia ||
            symptoms.symptomsNausea ||
            symptoms.dischargeWatery ||
            symptoms.dischargeCreamy ||
            symptoms.dischargeSticky ||
            symptoms.dischargeDry ||
            symptoms.sexDriveVeryLow ||
            symptoms.sexDriveLow ||
            symptoms.sexDriveHigh ||
            symptoms.sexDriveVeryHigh ||
            symptoms.exerciseRunning ||
            symptoms.exerciseCycling ||
            symptoms.exerciseHiking ||
            symptoms.exerciseGym ||
            symptoms.moodAngry ||
            symptoms.moodHappy ||
            symptoms.moodNeutral ||
            symptoms.moodSad ||
            symptoms.moodAnnoyed ||
            symptoms.moodSensitive ||
            symptoms.moodIrritated;
        const existingSymptoms = dbSymptoms.find(s => isSameDate(s.date, symptoms.date));
        if (!existingSymptoms) {
            if (hasSymptoms) { // Insert if symptoms are new and have at least some symptoms
                setDbSymptoms([...dbSymptoms, symptoms]);
                await insertSymptomsToDb(db, symptoms);
            }
        }
        else {
            if (hasSymptoms) { // Update if symptoms have at least one symptom
                const tempSymptoms = dbSymptoms.filter(s => !isSameDate(s.date, symptoms.date));
                setDbSymptoms([...tempSymptoms, symptoms]);
                await updateSymptomsInDb(db, existingSymptoms);
            }
            else { // Delete if symptoms have no symptoms
                setDbSymptoms(dbSymptoms.filter(s => !isSameDate(s.date, symptoms.date)));
                await deleteSymptomsFromDb(db, symptoms.date);
            }
        }
    }

    async function updateSettings(settings: Settings) {
        setSettings(settings);
        await storeSettings(settings);
    }

    useEffect(() => {
        async function updateFromDb() {
            await createTables(db);

            const eventsFromDb = await getEventsFromDb(db);
            setDbEvents(eventsFromDb);

            const symptomsFromDb = await getSymptomsFromDb(db);
            setDbSymptoms(symptomsFromDb);
        }
        updateFromDb();

        async function updateSettingsFromStorage() {
            const settings = await getSettings();
            if (settings)
                setSettings(settings);
        }
        updateSettingsFromStorage();
    }, [db]);

    useEffect(() => {
        // Watch out to not mutate events array in these functions
        const allEvents = [...dbEvents, ...getMenstruationPredictions(dbEvents, settings.predictionsTimespan), ...getOvulationPredictions(dbEvents, settings.predictionsTimespan)];

        setEvents(allEvents);
    }, [db, dbEvents, theme, settings.predictionsTimespan]);

    useEffect(() => {
        setSymptoms(dbSymptoms);
    }, [db, dbSymptoms]);

    return (
        <Ctx.Provider value={{ events, updateEvent, symptoms, updateSymptoms, selectedDate, setSelectedDate, settings, updateSettings, db, setDb }}>
            {children}
        </Ctx.Provider>
    )
}

export const useAppContext = () => useContext(Ctx);