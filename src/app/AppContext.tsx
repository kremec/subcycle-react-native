import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as SQLite from 'expo-sqlite';

import { useTheme } from '../theme/ThemeContext';
import { Context, Event, isSameDate } from './Types';

import { createTables, insertEventToDb, updateEventInDb, getEventsFromDb, deleteEventFromDb } from '../database/DbCalls';
import { getMenstruationPredictions, getOvulationPredictions } from '../stats/EventPrediction';

const db = SQLite.openDatabaseSync("db");

const defaultContextValue: Context = {
    events: [],
    updateEvent: (_event: Event) => {},
};
const Ctx = createContext(defaultContextValue);

export const AppContext = ({ children }: { children: ReactNode }) => {
    useDrizzleStudio(db);

    const { theme } = useTheme();

    const [dbEvents, setDbEvents] = useState<Event[]>([]);
    const [events, setEvents] = useState<Event[]>([]);

    async function updateEvent(event: Event) {
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
    
    useEffect(() => {
        createTables(db);

        async function updateAllEventsFromDb() {
            const eventsFromDb = await getEventsFromDb(db);
            setDbEvents(eventsFromDb);
        }
        updateAllEventsFromDb();
    }, []);

    useEffect(() => {
        // Watch out to not mutate events array in these functions
        const allEvents = [...dbEvents, ...getMenstruationPredictions(dbEvents), ...getOvulationPredictions(dbEvents)];
        if (!allEvents.some(e => isSameDate(e.date, new Date())))
            allEvents.push({ date: new Date(), menstruation: false, ovulation: false, tablet: false, prediction: false });

        setEvents(allEvents);
    }, [dbEvents, theme]);

    return (
        <Ctx.Provider value={{ events, updateEvent }}>
            {children}
        </Ctx.Provider>
    )
}

export const useAppContext = () => useContext(Ctx);