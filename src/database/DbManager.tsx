import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as SQLite from 'expo-sqlite';

import { DbData, Event } from './Types';
import { createTables, insertEventToDb, updateEventInDb, getEventsFromDb, deleteEventFromDb } from './DbCalls';

const db = SQLite.openDatabaseSync("db");

const defaultContextValue: DbData = {
    events: [],
    updateEvent: (_event: Event) => {},
};
const DbContext = createContext(defaultContextValue);

export const SQLiteDb = ({ children }: { children: ReactNode }) => {
    useDrizzleStudio(db);

    const [events, setEvents] = useState<Event[]>([]);

    async function updateEvent(event: Event) {
        const hasEvents = event.menstruation || event.ovulation || event.tablet;
        const existingEvent = events.find(e => e.date === event.date);
        if (!existingEvent) {
            if (hasEvents) { // Insert if event is new and has at least some event
                setEvents([...events, event]);
                await insertEventToDb(db, event); 
            }
        }
        else {
            if (hasEvents) { // Update if event has at least one event
                const tempEvents = events.filter(e => e.date !== event.date);
                setEvents([...tempEvents, event]);
                await updateEventInDb(db, existingEvent);
            }
            else { // Delete if event has no events
                setEvents(events.filter(e => e.date !== event.date));
                await deleteEventFromDb(db, event.date);
            }
        }
    }
    
    useEffect(() => {
        createTables(db);

        async function updateAllEventsFromDb() {
            const eventsFromDb = await getEventsFromDb(db);
            setEvents(eventsFromDb);
        }
        updateAllEventsFromDb();
    }, []);

    return (
        <DbContext.Provider value={{ events, updateEvent }}>
            {children}
        </DbContext.Provider>
    )
}

export const useDb = () => useContext(DbContext);