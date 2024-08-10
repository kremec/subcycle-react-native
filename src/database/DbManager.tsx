import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as SQLite from 'expo-sqlite';

import { DbData, MenstrualEvent, OvulationEvent, TabletEvent } from './Types';
import { addMenstrualEventToDb, createTables, deleteMenstrualEventFromDb, getMenstrualEventsFromDb, getOvulationEventsFromDb, getTabletEventsFromDb } from './DbCalls';

const db = SQLite.openDatabaseSync("db");

const defaultContextValue: DbData = {
    menstrualEvents: [],
    ovulationEvents: [],
    tabletEvents: [],
    addMenstrualEvent: () => {},
};
const DbContext = createContext(defaultContextValue);

export const SQLiteDb = ({ children }: { children: ReactNode }) => {
    useDrizzleStudio(db);

    const [menstrualEvents, setMenstrualEvents] = useState<MenstrualEvent[]>([]);
    const [ovulationEvents, setOvulationEvents] = useState<OvulationEvent[]>([]);
    const [tabletEvents, setTabletEvents] = useState<TabletEvent[]>([]);

    async function toggleMenstrualEvent(date: Date) {
        const existingMenstrualEvent = menstrualEvents.find(event => event.date = date);
        if (!existingMenstrualEvent) {
            const newMenstrualEvent: MenstrualEvent = { date };
            await addMenstrualEventToDb(db, date);
            setMenstrualEvents([...menstrualEvents, newMenstrualEvent]);
            console.log("Add menstrual event for date: ", date);
        } else {
            await deleteMenstrualEventFromDb(db, date);
            setMenstrualEvents(menstrualEvents.filter(event => event.date !== date));
            console.log("Delete menstrual event for date: ", date);
        }
    }
    
    useEffect(() => {
        createTables(db);

        async function updateAllEventsFromDb() {
            const menstrualEvents = await getMenstrualEventsFromDb(db);
            const ovulationEvents = await getOvulationEventsFromDb(db);
            const tabletEvents = await getTabletEventsFromDb(db);
            setMenstrualEvents(menstrualEvents);
            setOvulationEvents(ovulationEvents);
            setTabletEvents(tabletEvents);
        }
        updateAllEventsFromDb();
    }, []);

    return (
        <DbContext.Provider value={{ menstrualEvents, ovulationEvents, tabletEvents, addMenstrualEvent: toggleMenstrualEvent }}>
            {children}
        </DbContext.Provider>
    )
}

export const useDb = () => useContext(DbContext);