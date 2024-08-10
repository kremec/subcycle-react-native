import { SQLiteDatabase } from "expo-sqlite";
import { MenstrualEvent, OvulationEvent, TabletEvent } from "./Types";

export function createTables(db: SQLiteDatabase) {

    db.withTransactionAsync(async() => {

      db?.execAsync(
        `CREATE TABLE IF NOT EXISTS menstrual_event (
            date DATE PRIMARY KEY
        );`
      );

      db?.execAsync(
        `CREATE TABLE IF NOT EXISTS ovulation_event (
            date DATE PRIMARY KEY
        );`
      );
  
      db?.execAsync(
        `CREATE TABLE IF NOT EXISTS tablet_event (
            date DATE PRIMARY KEY
        );`
      );

    });
};

export const getMenstrualEventsFromDb = async (db: SQLiteDatabase) => {
    return await db.getAllAsync<MenstrualEvent>("SELECT * FROM menstrual_event");
};
export const getOvulationEventsFromDb = async (db: SQLiteDatabase) => {
    return await db.getAllAsync<OvulationEvent>("SELECT * FROM ovulation_event");
};
export const getTabletEventsFromDb = async (db: SQLiteDatabase) => {
    return await db.getAllAsync<TabletEvent>("SELECT * FROM tablet_event");
};

export const addMenstrualEventToDb = async (db: SQLiteDatabase, date: Date) => {
    const command = await db.prepareAsync("INSERT INTO menstrual_event (date) VALUES ($date)");
    await command.executeAsync({ $date: formatDate(date) });
};
export const addOvulationEventToDb = async (db: SQLiteDatabase, date: Date) => {
    const command = await db.prepareAsync("INSERT INTO ovulation_event (date) VALUES ($date)");
    await command.executeAsync({ $date: formatDate(date) });
};
export const addTabletEventToDb = async (db: SQLiteDatabase, date: Date) => {
    const command = await db.prepareAsync("INSERT INTO tablet_event (date) VALUES ($date)");
    await command.executeAsync({ $date: formatDate(date) });
};

export const deleteMenstrualEventFromDb = async (db: SQLiteDatabase, date: Date) => {
    const command = await db.prepareAsync("DELETE FROM menstrual_event WHERE date = $date");
    await command.executeAsync({ $date: formatDate(date) });
};
export const deleteOvulationEventFromDb = async (db: SQLiteDatabase, date: Date) => {
    const command = await db.prepareAsync("DELETE FROM ovulation_event WHERE date = $date");
    await command.executeAsync({ $date: formatDate(date) });
};
export const deleteTabletEventFromDb = async (db: SQLiteDatabase, date: Date) => {
    const command = await db.prepareAsync("DELETE FROM tablet_event WHERE date = $date");
    await command.executeAsync({ $date: formatDate(date) });
};

const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
};