import { SQLiteDatabase } from "expo-sqlite";
import { Event } from "../app/Types";

export function createTables(db: SQLiteDatabase) {
    db.withTransactionAsync(async () => {
        db?.execAsync(
            `CREATE TABLE IF NOT EXISTS events (
            date DATE PRIMARY KEY,
            menstruation BOOLEAN NOT NULL DEFAULT FALSE,
            ovulation BOOLEAN NOT NULL DEFAULT FALSE,
            tablet BOOLEAN NOT NULL DEFAULT FALSE
        );`
        );

    });
    console.log("createTables");
};

export const getEventsFromDb = async (db: SQLiteDatabase) => {
    console.log("getEventsFromDb");
    const results = await db.getAllAsync<Event>("SELECT * FROM events");

    const events = results.map(event => ({
        date: new Date(event.date),
        menstruation: event.menstruation ? true : false,
        ovulation: event.ovulation ? true : false,
        tablet: event.tablet ? true : false,
        prediction: false,
    }));
    return events;
};

export const insertEventToDb = async (db: SQLiteDatabase, event: Event) => {
    console.log("insertEventToDb");
    const command = await db.prepareAsync("INSERT INTO events (date, menstruation, ovulation, tablet) VALUES ($date, $menstruation, $ovulation, $tablet)");
    await command.executeAsync({ $date: event.date.toISOString(), $menstruation: event.menstruation, $ovulation: event.ovulation, $tablet: event.tablet });
};

export const updateEventInDb = async (db: SQLiteDatabase, event: Event) => {
    console.log("updateEventInDb");
    const command = await db.prepareAsync("UPDATE events SET menstruation = $menstruation, ovulation = $ovulation, tablet = $tablet WHERE date = $date");
    await command.executeAsync({ $date: event.date.toISOString(), $menstruation: event.menstruation, $ovulation: event.ovulation, $tablet: event.tablet });
};

export const deleteEventFromDb = async (db: SQLiteDatabase, date: Date) => {
    console.log("deleteEventFromDb");
    const command = await db.prepareAsync("DELETE FROM events WHERE date = $date");
    await command.executeAsync({ $date: date.toISOString() });
};