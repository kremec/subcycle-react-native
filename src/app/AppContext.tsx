import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as SQLite from 'expo-sqlite';

import { useTheme } from '../theme/ThemeContext';
import { Context, Event, isSameDate, Settings } from './Types';

import { createTables, insertEventToDb, updateEventInDb, getEventsFromDb, deleteEventFromDb } from '../data/SqlDbCalls';
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
    settings: defaultSettings,
    updateSettings: (_settings: Settings) => { },
    db: defaultDb,
    setDb: (_db: SQLite.SQLiteDatabase) => { },
};
const Ctx = createContext(defaultContextValue);

export const AppContext = ({ children }: { children: ReactNode }) => {
    const { theme } = useTheme();

    const [db, setDb] = useState<SQLite.SQLiteDatabase>(defaultDb);
    useDrizzleStudio(db);

    const [dbEvents, setDbEvents] = useState<Event[]>([]);
    const [events, setEvents] = useState<Event[]>([]);

    const [settings, setSettings] = useState<Settings>(defaultSettings);

    async function updateEvent(event: Event) {
        if (event.prediction)
            return;

        const hasEvents = event.menstruation || event.ovulation || event.tablet;
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

    async function updateSettings(settings: Settings) {
        setSettings(settings);
        await storeSettings(settings);
    }

    useEffect(() => {
        async function updateAllEventsFromDb() {
            await createTables(db);
            const eventsFromDb = await getEventsFromDb(db);
            setDbEvents(eventsFromDb);
        }
        updateAllEventsFromDb();

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
        if (!allEvents.some(e => isSameDate(e.date, new Date())))
            allEvents.push({ date: new Date(), menstruation: false, ovulation: false, tablet: false, prediction: false });

        setEvents(allEvents);
    }, [db, dbEvents, theme, settings.predictionsTimespan]);

    return (
        <Ctx.Provider value={{ events, updateEvent, settings, updateSettings, db, setDb }}>
            {children}
        </Ctx.Provider>
    )
}

export const useAppContext = () => useContext(Ctx);