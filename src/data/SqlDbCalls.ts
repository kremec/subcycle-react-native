import { SQLiteDatabase } from 'expo-sqlite'
import { DbEvent, DbSymptoms, Event, Symptoms } from '../app/Types'

export async function createTables(db: SQLiteDatabase) {
    await db?.execAsync(
        `
        CREATE TABLE IF NOT EXISTS events (
            date DATE PRIMARY KEY,
            menstruation BOOLEAN NOT NULL DEFAULT FALSE,
            ovulation BOOLEAN NOT NULL DEFAULT FALSE,
            pill BOOLEAN NOT NULL DEFAULT FALSE
        );

        CREATE TABLE IF NOT EXISTS symptoms (
            date DATE PRIMARY KEY,
            menstruation_low BOOLEAN NOT NULL DEFAULT FALSE,
            menstruation_medium BOOLEAN NOT NULL DEFAULT FALSE,
            menstruation_strong BOOLEAN NOT NULL DEFAULT FALSE,
            menstruation_spotting BOOLEAN NOT NULL DEFAULT FALSE,
            symptoms_intestinal_problems BOOLEAN NOT NULL DEFAULT FALSE,
            symptoms_appetite_changes BOOLEAN NOT NULL DEFAULT FALSE,
            symptoms_bloating BOOLEAN NOT NULL DEFAULT FALSE,
            symptoms_chills BOOLEAN NOT NULL DEFAULT FALSE,
            symptoms_cramps BOOLEAN NOT NULL DEFAULT FALSE,
            symptoms_dry_skin BOOLEAN NOT NULL DEFAULT FALSE,
            symptoms_insomnia BOOLEAN NOT NULL DEFAULT FALSE,
            symptoms_nausea BOOLEAN NOT NULL DEFAULT FALSE,
            discharge_watery BOOLEAN NOT NULL DEFAULT FALSE,
            discharge_creamy BOOLEAN NOT NULL DEFAULT FALSE,
            discharge_sticky BOOLEAN NOT NULL DEFAULT FALSE,
            discharge_dry BOOLEAN NOT NULL DEFAULT FALSE,
            sex_drive_very_low BOOLEAN NOT NULL DEFAULT FALSE,
            sex_drive_low BOOLEAN NOT NULL DEFAULT FALSE,
            sex_drive_high BOOLEAN NOT NULL DEFAULT FALSE,
            sex_drive_very_high BOOLEAN NOT NULL DEFAULT FALSE,
            exercise_running BOOLEAN NOT NULL DEFAULT FALSE,
            exercise_cycling BOOLEAN NOT NULL DEFAULT FALSE,
            exercise_hiking BOOLEAN NOT NULL DEFAULT FALSE,
            exercise_gym BOOLEAN NOT NULL DEFAULT FALSE,
            mood_angry BOOLEAN NOT NULL DEFAULT FALSE,
            mood_happy BOOLEAN NOT NULL DEFAULT FALSE,
            mood_neutral BOOLEAN NOT NULL DEFAULT FALSE,
            mood_sad BOOLEAN NOT NULL DEFAULT FALSE,
            mood_annoyed BOOLEAN NOT NULL DEFAULT FALSE,
            mood_sensitive BOOLEAN NOT NULL DEFAULT FALSE,
            mood_irritated BOOLEAN NOT NULL DEFAULT FALSE
        );
        `
    )
}

export async function getEventsFromDb(db: SQLiteDatabase) {
    const results = await db.getAllAsync<DbEvent>('SELECT * FROM events')

    const events: Event[] = results.map((event) => ({
        date: new Date(event.date),
        menstruation: event.menstruation ? true : false,
        ovulation: event.ovulation ? true : false,
        pill: event.pill ? true : false,
        prediction: false
    }))
    return events
}

export async function getSymptomsFromDb(db: SQLiteDatabase) {
    const results = await db.getAllAsync<DbSymptoms>('SELECT * FROM symptoms')

    const symptoms: Symptoms[] = results.map((symptoms) => ({
        date: new Date(symptoms.date),
        menstruationLow: symptoms.menstruation_low ? true : false,
        menstruationMedium: symptoms.menstruation_medium ? true : false,
        menstruationStrong: symptoms.menstruation_strong ? true : false,
        menstruationSpotting: symptoms.menstruation_spotting ? true : false,
        symptomsIntestinalProblems: symptoms.symptoms_intestinal_problems ? true : false,
        symptomsAppetiteChanges: symptoms.symptoms_appetite_changes ? true : false,
        symptomsBloating: symptoms.symptoms_bloating ? true : false,
        symptomsChills: symptoms.symptoms_chills ? true : false,
        symptomsCramps: symptoms.symptoms_cramps ? true : false,
        symptomsDrySkin: symptoms.symptoms_dry_skin ? true : false,
        symptomsInsomnia: symptoms.symptoms_insomnia ? true : false,
        symptomsNausea: symptoms.symptoms_nausea ? true : false,
        dischargeWatery: symptoms.discharge_watery ? true : false,
        dischargeCreamy: symptoms.discharge_creamy ? true : false,
        dischargeSticky: symptoms.discharge_sticky ? true : false,
        dischargeDry: symptoms.discharge_dry ? true : false,
        sexDriveVeryLow: symptoms.sex_drive_very_low ? true : false,
        sexDriveLow: symptoms.sex_drive_low ? true : false,
        sexDriveHigh: symptoms.sex_drive_high ? true : false,
        sexDriveVeryHigh: symptoms.sex_drive_very_high ? true : false,
        exerciseRunning: symptoms.exercise_running ? true : false,
        exerciseCycling: symptoms.exercise_cycling ? true : false,
        exerciseHiking: symptoms.exercise_hiking ? true : false,
        exerciseGym: symptoms.exercise_gym ? true : false,
        moodAngry: symptoms.mood_angry ? true : false,
        moodHappy: symptoms.mood_happy ? true : false,
        moodNeutral: symptoms.mood_neutral ? true : false,
        moodSad: symptoms.mood_sad ? true : false,
        moodAnnoyed: symptoms.mood_annoyed ? true : false,
        moodSensitive: symptoms.mood_sensitive ? true : false,
        moodIrritated: symptoms.mood_irritated ? true : false
    }))
    return symptoms
}

export async function insertEventToDb(db: SQLiteDatabase, event: Event) {
    const command = await db.prepareAsync(
        `INSERT INTO events (
            date,
            menstruation,
            ovulation,
            pill
        ) VALUES (
            $date,
            $menstruation,
            $ovulation,
            $pill
        )`
    )
    await command.executeAsync({
        $date: event.date.toISOString(),
        $menstruation: event.menstruation,
        $ovulation: event.ovulation,
        $pill: event.pill
    })
}

export async function insertSymptomsToDb(db: SQLiteDatabase, symptoms: Symptoms) {
    const command = await db.prepareAsync(
        `INSERT INTO symptoms (
            date,
            menstruation_low,
            menstruation_medium,
            menstruation_strong,
            menstruation_spotting,
            symptoms_intestinal_problems,
            symptoms_appetite_changes,
            symptoms_bloating,
            symptoms_chills,
            symptoms_cramps,
            symptoms_dry_skin,
            symptoms_insomnia,
            symptoms_nausea,
            discharge_watery,
            discharge_creamy,
            discharge_sticky,
            discharge_dry,
            sex_drive_very_low,
            sex_drive_low,
            sex_drive_high,
            sex_drive_very_high,
            exercise_running,
            exercise_cycling,
            exercise_hiking,
            exercise_gym,
            mood_angry,
            mood_happy,
            mood_neutral,
            mood_sad,
            mood_annoyed,
            mood_sensitive,
            mood_irritated
        ) VALUES (
            $date,
            $menstruation_low,
            $menstruation_medium,
            $menstruation_strong,
            $menstruation_spotting,
            $symptoms_intestinal_problems,
            $symptoms_appetite_changes,
            $symptoms_bloating,
            $symptoms_chills,
            $symptoms_cramps,
            $symptoms_dry_skin,
            $symptoms_insomnia,
            $symptoms_nausea,
            $discharge_watery,
            $discharge_creamy,
            $discharge_sticky,
            $discharge_dry,
            $sex_drive_very_low,
            $sex_drive_low,
            $sex_drive_high,
            $sex_drive_very_high,
            $exercise_running,
            $exercise_cycling,
            $exercise_hiking,
            $exercise_gym,
            $mood_angry,
            $mood_happy,
            $mood_neutral,
            $mood_sad,
            $mood_annoyed,
            $mood_sensitive,
            $mood_irritated
        )`
    )
    await command.executeAsync({
        $date: symptoms.date.toISOString(),
        $menstruation_low: symptoms.menstruationLow,
        $menstruation_medium: symptoms.menstruationMedium,
        $menstruation_strong: symptoms.menstruationStrong,
        $menstruation_spotting: symptoms.menstruationSpotting,
        $symptoms_intestinal_problems: symptoms.symptomsIntestinalProblems,
        $symptoms_appetite_changes: symptoms.symptomsAppetiteChanges,
        $symptoms_bloating: symptoms.symptomsBloating,
        $symptoms_chills: symptoms.symptomsChills,
        $symptoms_cramps: symptoms.symptomsCramps,
        $symptoms_dry_skin: symptoms.symptomsDrySkin,
        $symptoms_insomnia: symptoms.symptomsInsomnia,
        $symptoms_nausea: symptoms.symptomsNausea,
        $discharge_watery: symptoms.dischargeWatery,
        $discharge_creamy: symptoms.dischargeCreamy,
        $discharge_sticky: symptoms.dischargeSticky,
        $discharge_dry: symptoms.dischargeDry,
        $sex_drive_very_low: symptoms.sexDriveVeryLow,
        $sex_drive_low: symptoms.sexDriveLow,
        $sex_drive_high: symptoms.sexDriveHigh,
        $sex_drive_very_high: symptoms.sexDriveVeryHigh,
        $exercise_running: symptoms.exerciseRunning,
        $exercise_cycling: symptoms.exerciseCycling,
        $exercise_hiking: symptoms.exerciseHiking,
        $exercise_gym: symptoms.exerciseGym,
        $mood_angry: symptoms.moodAngry,
        $mood_happy: symptoms.moodHappy,
        $mood_neutral: symptoms.moodNeutral,
        $mood_sad: symptoms.moodSad,
        $mood_annoyed: symptoms.moodAnnoyed,
        $mood_sensitive: symptoms.moodSensitive,
        $mood_irritated: symptoms.moodIrritated
    })
}

export async function updateEventInDb(db: SQLiteDatabase, event: Event) {
    const command = await db.prepareAsync(
        `UPDATE events SET
            menstruation = $menstruation,
            ovulation = $ovulation,
            pill = $pill
        WHERE date = $date`
    )
    await command.executeAsync({
        $date: event.date.toISOString(),
        $menstruation: event.menstruation,
        $ovulation: event.ovulation,
        $pill: event.pill
    })
}

export async function updateSymptomsInDb(db: SQLiteDatabase, symptoms: Symptoms) {
    const command = await db.prepareAsync(
        `UPDATE symptoms SET
            menstruation_low = $menstruation_low,
            menstruation_medium = $menstruation_medium,
            menstruation_strong = $menstruation_strong,
            menstruation_spotting = $menstruation_spotting,
            symptoms_intestinal_problems = $symptoms_intestinal_problems,
            symptoms_appetite_changes = $symptoms_appetite_changes,
            symptoms_bloating = $symptoms_bloating,
            symptoms_chills = $symptoms_chills,
            symptoms_cramps = $symptoms_cramps,
            symptoms_dry_skin = $symptoms_dry_skin,
            symptoms_insomnia = $symptoms_insomnia,
            symptoms_nausea = $symptoms_nausea,
            discharge_watery = $discharge_watery,
            discharge_creamy = $discharge_creamy,
            discharge_sticky = $discharge_sticky,
            discharge_dry = $discharge_dry,
            sex_drive_very_low = $sex_drive_very_low,
            sex_drive_low = $sex_drive_low,
            sex_drive_high = $sex_drive_high,
            sex_drive_very_high = $sex_drive_very_high,
            exercise_running = $exercise_running,
            exercise_cycling = $exercise_cycling,
            exercise_hiking = $exercise_hiking,
            exercise_gym = $exercise_gym,
            mood_angry = $mood_angry,
            mood_happy = $mood_happy,
            mood_neutral = $mood_neutral,
            mood_sad = $mood_sad,
            mood_annoyed = $mood_annoyed,
            mood_sensitive = $mood_sensitive,
            mood_irritated = $mood_irritated
        WHERE date = $date`
    )
    await command.executeAsync({
        $date: symptoms.date.toISOString(),
        $menstruation_low: symptoms.menstruationLow,
        $menstruation_medium: symptoms.menstruationMedium,
        $menstruation_strong: symptoms.menstruationStrong,
        $menstruation_spotting: symptoms.menstruationSpotting,
        $symptoms_intestinal_problems: symptoms.symptomsIntestinalProblems,
        $symptoms_appetite_changes: symptoms.symptomsAppetiteChanges,
        $symptoms_bloating: symptoms.symptomsBloating,
        $symptoms_chills: symptoms.symptomsChills,
        $symptoms_cramps: symptoms.symptomsCramps,
        $symptoms_dry_skin: symptoms.symptomsDrySkin,
        $symptoms_insomnia: symptoms.symptomsInsomnia,
        $symptoms_nausea: symptoms.symptomsNausea,
        $discharge_watery: symptoms.dischargeWatery,
        $discharge_creamy: symptoms.dischargeCreamy,
        $discharge_sticky: symptoms.dischargeSticky,
        $discharge_dry: symptoms.dischargeDry,
        $sex_drive_very_low: symptoms.sexDriveVeryLow,
        $sex_drive_low: symptoms.sexDriveLow,
        $sex_drive_high: symptoms.sexDriveHigh,
        $sex_drive_very_high: symptoms.sexDriveVeryHigh,
        $exercise_running: symptoms.exerciseRunning,
        $exercise_cycling: symptoms.exerciseCycling,
        $exercise_hiking: symptoms.exerciseHiking,
        $exercise_gym: symptoms.exerciseGym,
        $mood_angry: symptoms.moodAngry,
        $mood_happy: symptoms.moodHappy,
        $mood_neutral: symptoms.moodNeutral,
        $mood_sad: symptoms.moodSad,
        $mood_annoyed: symptoms.moodAnnoyed,
        $mood_sensitive: symptoms.moodSensitive,
        $mood_irritated: symptoms.moodIrritated
    })
}

export async function deleteEventFromDb(db: SQLiteDatabase, date: Date) {
    const command = await db.prepareAsync(`DELETE FROM events WHERE date = $date`)
    await command.executeAsync({ $date: date.toISOString() })
}

export async function deleteSymptomsFromDb(db: SQLiteDatabase, date: Date) {
    const command = await db.prepareAsync(`DELETE FROM symptoms WHERE date = $date`)
    await command.executeAsync({ $date: date.toISOString() })
}
