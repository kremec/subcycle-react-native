import { SQLiteDatabase } from "expo-sqlite";
import { Event } from "../app/Types";

export async function createTables(db: SQLiteDatabase) {
    await db?.execAsync(
        `CREATE TABLE IF NOT EXISTS events (
            date DATE PRIMARY KEY,
            menstruation BOOLEAN NOT NULL DEFAULT FALSE,
            ovulation BOOLEAN NOT NULL DEFAULT FALSE,
            pill BOOLEAN NOT NULL DEFAULT FALSE
        );`
    );
};

export async function getEventsFromDb(db: SQLiteDatabase) {
    const results = await db.getAllAsync<Event>("SELECT * FROM events");

    const events = results.map(event => ({
        date: new Date(event.date),
        menstruation: event.menstruation ? true : false,
        ovulation: event.ovulation ? true : false,
        pill: event.pill ? true : false,
        prediction: false,
    }));
    return events;
};

export async function insertEventToDb(db: SQLiteDatabase, event: Event) {
    const command = await db.prepareAsync("INSERT INTO events (date, menstruation, ovulation, pill) VALUES ($date, $menstruation, $ovulation, $pill)");
    await command.executeAsync({ $date: event.date.toISOString(), $menstruation: event.menstruation, $ovulation: event.ovulation, $pill: event.pill });
};

export async function updateEventInDb(db: SQLiteDatabase, event: Event) {
    const command = await db.prepareAsync("UPDATE events SET menstruation = $menstruation, ovulation = $ovulation, pill = $pill WHERE date = $date");
    await command.executeAsync({ $date: event.date.toISOString(), $menstruation: event.menstruation, $ovulation: event.ovulation, $pill: event.pill });
};

export async function deleteEventFromDb(db: SQLiteDatabase, date: Date) {
    const command = await db.prepareAsync("DELETE FROM events WHERE date = $date");
    await command.executeAsync({ $date: date.toISOString() });
};