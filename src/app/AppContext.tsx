import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as SQLite from 'expo-sqlite';

import { Context, Event, isSameDate, Settings, Symptoms } from './Types';
import { getMenstruationPredictions, getOvulationPredictions } from '../stats/EventPrediction';

import { createTables, insertEventToDb, updateEventInDb, getEventsFromDb, deleteEventFromDb, getSymptomsFromDb, updateSymptomsInDb, deleteSymptomsFromDb, insertSymptomsToDb } from '../data/SqlDbCalls';
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

    const [db, setDb] = useState<SQLite.SQLiteDatabase>(defaultDb);
    __DEV__ && useDrizzleStudio(db);

    const [settings, setSettings] = useState<Settings>(defaultSettings);

    const [dbEvents, setDbEvents] = useState<Event[]>(defaultContextValue.events);
    const [events, setEvents] = useState<Event[]>(defaultContextValue.events);
    const [dbSymptoms, setDbSymptoms] = useState<Symptoms[]>(defaultContextValue.symptoms);
    const [symptoms, setSymptoms] = useState<Symptoms[]>(defaultContextValue.symptoms);

    const [selectedDate, setSelectedDate] = useState<Date>(defaultContextValue.selectedDate);

    const updateEvent = useCallback((editEvent: Event) => {
        if (editEvent.prediction)
            return;

        const hasEvents =
            editEvent.menstruation ||
            editEvent.ovulation ||
            editEvent.pill;
        const existingEvent = dbEvents.find(e => isSameDate(e.date, editEvent.date));
        if (!existingEvent) {
            if (hasEvents) { // Insert if event is new and has at least some event
                setDbEvents([...dbEvents, editEvent]);
                insertEventToDb(db, editEvent);
            }
        } else {
            if (hasEvents) { // Update if event has at least one event
                const tempEvents = dbEvents.filter(e => !isSameDate(e.date, editEvent.date));
                setDbEvents([...tempEvents, editEvent]);
                updateEventInDb(db, existingEvent);
            } else { // Delete if event has no events
                setDbEvents(dbEvents.filter(e => !isSameDate(e.date, editEvent.date)));
                deleteEventFromDb(db, editEvent.date);
            }
        }
    }, [dbEvents]);

    const updateSymptoms = useCallback((editSymptoms: Symptoms) => {
        const hasSymptoms =
            editSymptoms.menstruationLow ||
            editSymptoms.menstruationMedium ||
            editSymptoms.menstruationStrong ||
            editSymptoms.menstruationSpotting ||
            editSymptoms.symptomsIntestinalProblems ||
            editSymptoms.symptomsAppetiteChanges ||
            editSymptoms.symptomsBloating ||
            editSymptoms.symptomsChills ||
            editSymptoms.symptomsCramps ||
            editSymptoms.symptomsDrySkin ||
            editSymptoms.symptomsInsomnia ||
            editSymptoms.symptomsNausea ||
            editSymptoms.dischargeWatery ||
            editSymptoms.dischargeCreamy ||
            editSymptoms.dischargeSticky ||
            editSymptoms.dischargeDry ||
            editSymptoms.sexDriveVeryLow ||
            editSymptoms.sexDriveLow ||
            editSymptoms.sexDriveHigh ||
            editSymptoms.sexDriveVeryHigh ||
            editSymptoms.exerciseRunning ||
            editSymptoms.exerciseCycling ||
            editSymptoms.exerciseHiking ||
            editSymptoms.exerciseGym ||
            editSymptoms.moodAngry ||
            editSymptoms.moodHappy ||
            editSymptoms.moodNeutral ||
            editSymptoms.moodSad ||
            editSymptoms.moodAnnoyed ||
            editSymptoms.moodSensitive ||
            editSymptoms.moodIrritated;
        const existingSymptoms = dbSymptoms.find(s => isSameDate(s.date, editSymptoms.date));
        if (!existingSymptoms) {
            if (hasSymptoms) { // Insert if symptoms are new and have at least some symptoms
                setDbSymptoms([...dbSymptoms, editSymptoms]);
                insertSymptomsToDb(db, editSymptoms);
            }
        } else {
            if (hasSymptoms) { // Update if symptoms have at least one symptom
                const tempSymptoms = dbSymptoms.filter(s => !isSameDate(s.date, editSymptoms.date));
                setDbSymptoms([...tempSymptoms, editSymptoms]);
                updateSymptomsInDb(db, existingSymptoms);
            } else { // Delete if symptoms have no symptoms
                setDbSymptoms(dbSymptoms.filter(s => !isSameDate(s.date, editSymptoms.date)));
                deleteSymptomsFromDb(db, editSymptoms.date);
            }
        }
    }, [dbSymptoms]);

    const updateSettings = useCallback(async (settings: Settings) => {
        setSettings(settings);
        await storeSettings(settings);
    }, []);

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
        const allEvents = [...dbEvents, ...getMenstruationPredictions(dbEvents, settings.predictionsTimespan), ...getOvulationPredictions(dbEvents, settings.predictionsTimespan)];
        setEvents(allEvents);
    }, [dbEvents])
    useEffect(() => {
        setSymptoms(dbSymptoms);
    }, [dbSymptoms]);

    return (
        <Ctx.Provider value={{ events, updateEvent, symptoms, updateSymptoms, selectedDate, setSelectedDate, settings, updateSettings, db, setDb }}>
            {children}
        </Ctx.Provider>
    )
}

export const useAppContext = () => useContext(Ctx);