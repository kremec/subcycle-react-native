import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import * as SQLite from 'expo-sqlite'

import { DbContext, Event, EventsContext, isSameDate, PartnerInsight, PartnerInsightsContext, SelectedDateContext, Settings, SettingsContext, Symptoms, SymptomsContext } from './Types'
import { getMenstruationPredictions, getOvulationPredictions } from '../stats/EventPrediction'

import {
    createTables,
    insertEventToDb,
    updateEventInDb,
    getEventsFromDb,
    deleteEventFromDb,
    getSymptomsFromDb,
    updateSymptomsInDb,
    deleteSymptomsFromDb,
    insertSymptomsToDb,
    insertPartnerInsightToDb,
    updatePartnerInsightInDb,
    deletePartnerInsightFromDb
} from '../data/SqlDbCalls'
import { getSettings, storeSettings } from '../data/AsyncStorageCalls'

const defaultDb = SQLite.openDatabaseSync('subcycle.db')
const defaultSettings: Settings = {
    predictionsTimespan: 1,
    notificationTime: new Date(new Date().setHours(18, 0, 0)),
    partnerMode: false
}

const defaultEventsContextValue: EventsContext = {
    events: [],
    updateEvent: (_event: Event) => {}
}
const EventsCtx = createContext(defaultEventsContextValue)
const defaultSymptomsContextValue: SymptomsContext = {
    symptoms: [],
    updateSymptoms: (_symptoms: Symptoms) => {}
}
const SymptomsCtx = createContext(defaultSymptomsContextValue)
const defaultPartnerInsightsContextValue: PartnerInsightsContext = {
    partnerInsights: [],
    updatePartnerInsights: (_insights: PartnerInsight[]) => {},
    deletePartnerInsights: (_dayInCycle: number) => {}
}
const PartnerInsightsCtx = createContext(defaultPartnerInsightsContextValue)
const defaultSelectedDateContextValue: SelectedDateContext = {
    selectedDate: new Date(),
    setSelectedDate: (_date: Date) => {}
}
const SelectedDateCtx = createContext(defaultSelectedDateContextValue)
const defaultSettingsContextValue: SettingsContext = {
    settings: defaultSettings,
    updateSettings: (_settings: Settings) => {}
}
const SettingsCtx = createContext(defaultSettingsContextValue)
const defaultDbContextValue: DbContext = {
    db: defaultDb,
    setDb: (_db: SQLite.SQLiteDatabase) => {}
}
const DbCtx = createContext(defaultDbContextValue)

export const AppContext = ({ children }: { children: ReactNode }) => {
    const [db, setDb] = useState<SQLite.SQLiteDatabase>(defaultDb)
    __DEV__ && useDrizzleStudio(db)

    const [settings, setSettings] = useState<Settings>(defaultSettings)

    const [dbEvents, setDbEvents] = useState<Event[]>(defaultEventsContextValue.events)
    const [events, setEvents] = useState<Event[]>(defaultEventsContextValue.events)
    const [dbSymptoms, setDbSymptoms] = useState<Symptoms[]>(defaultSymptomsContextValue.symptoms)
    const [symptoms, setSymptoms] = useState<Symptoms[]>(defaultSymptomsContextValue.symptoms)
    const [dbPartnerInsights, setDbPartnerInsights] = useState<PartnerInsight[]>(defaultPartnerInsightsContextValue.partnerInsights)
    const [partnerInsights, setPartnerInsights] = useState<PartnerInsight[]>(defaultPartnerInsightsContextValue.partnerInsights)

    const [selectedDate, setSelectedDate] = useState<Date>(defaultSelectedDateContextValue.selectedDate)

    const updateEvent = useCallback(
        (editEvent: Event) => {
            if (editEvent.prediction) return

            const hasEvents = editEvent.menstruationLight || editEvent.menstruationModerate || editEvent.menstruationHeavy || editEvent.menstruationSpotting || editEvent.ovulation || editEvent.pill
            const existingEvent = dbEvents.find((e) => isSameDate(e.date, editEvent.date))
            if (!existingEvent) {
                if (hasEvents) {
                    // Insert if event is new and has at least some event
                    insertEventToDb(db, editEvent)
                    setDbEvents([...dbEvents, editEvent])
                }
            } else {
                if (hasEvents) {
                    // Update if event has at least one event
                    const tempEvents = dbEvents.filter((e) => !isSameDate(e.date, editEvent.date))
                    updateEventInDb(db, editEvent)
                    setDbEvents([...tempEvents, editEvent])
                } else {
                    // Delete if event has no events
                    deleteEventFromDb(db, editEvent.date)
                    setDbEvents(dbEvents.filter((e) => !isSameDate(e.date, editEvent.date)))
                }
            }
        },
        [dbEvents]
    )

    const updateSymptoms = useCallback(
        (editSymptoms: Symptoms) => {
            const hasSymptoms =
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
                editSymptoms.libidoVeryLow ||
                editSymptoms.libidoLow ||
                editSymptoms.libidoHigh ||
                editSymptoms.libidoVeryHigh ||
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
                editSymptoms.moodIrritated

            const existingSymptoms = dbSymptoms.find((s) => isSameDate(s.date, editSymptoms.date))
            if (!existingSymptoms) {
                if (hasSymptoms) {
                    // Insert if symptoms are new and have at least some symptoms
                    insertSymptomsToDb(db, editSymptoms)
                    setDbSymptoms([...dbSymptoms, editSymptoms])
                }
            } else {
                if (hasSymptoms) {
                    // Update if symptoms have at least one symptom
                    const tempSymptoms = dbSymptoms.filter((s) => !isSameDate(s.date, editSymptoms.date))
                    updateSymptomsInDb(db, editSymptoms)
                    setDbSymptoms([...tempSymptoms, editSymptoms])
                } else {
                    // Delete if symptoms have no symptoms
                    deleteSymptomsFromDb(db, editSymptoms.date)
                    setDbSymptoms(dbSymptoms.filter((s) => !isSameDate(s.date, editSymptoms.date)))
                }
            }
        },
        [dbSymptoms]
    )

    const updatePartnerInsights = useCallback(
        (editInsights: PartnerInsight[]) => {
            const existingInsights = dbPartnerInsights.find((i) => i.dayInCycle === editInsights[0].dayInCycle)
            if (!existingInsights) {
                // Insert if insight is new
                insertPartnerInsightToDb(db, editInsights[0])
                setDbPartnerInsights([...dbPartnerInsights, ...editInsights])
            } else {
                // Update if insight is already in db
                const tempInsights = dbPartnerInsights.filter((i) => i.dayInCycle !== editInsights[0].dayInCycle)
                updatePartnerInsightInDb(db, editInsights[0])
                setDbPartnerInsights([...tempInsights, ...editInsights])
            }
        },
        [dbPartnerInsights]
    )
    const deletePartnerInsights = useCallback(
        (dayInCycle: number) => {
            const existingInsights = dbPartnerInsights.find((i) => i.dayInCycle === dayInCycle)
            if (existingInsights) {
                // Delete if insight is already in db
                const tempInsights = dbPartnerInsights.filter((i) => i.dayInCycle !== dayInCycle)
                deletePartnerInsightFromDb(db, dayInCycle)
                setDbPartnerInsights(tempInsights)
            }
        },
        [dbPartnerInsights]
    )

    const updateSettings = useCallback(async (settings: Settings) => {
        setSettings(settings)
        await storeSettings(settings)
    }, [])

    useEffect(() => {
        async function updateFromDb() {
            await createTables(db)

            const eventsFromDb = await getEventsFromDb(db)
            setDbEvents(eventsFromDb)

            const symptomsFromDb = await getSymptomsFromDb(db)
            setDbSymptoms(symptomsFromDb)
        }
        updateFromDb()

        async function updateSettingsFromStorage() {
            const settings = await getSettings()
            if (settings) setSettings(settings)
        }
        updateSettingsFromStorage()
    }, [db])

    useEffect(() => {
        const allEvents = [...dbEvents, ...getMenstruationPredictions(dbEvents, settings.predictionsTimespan), ...getOvulationPredictions(dbEvents, settings.predictionsTimespan)]
        setEvents(allEvents)
    }, [dbEvents, settings.predictionsTimespan])
    useEffect(() => {
        setSymptoms(dbSymptoms)
    }, [dbSymptoms])
    useEffect(() => {
        setPartnerInsights(dbPartnerInsights)
    }, [dbPartnerInsights])

    return (
        <EventsCtx.Provider value={useMemo(() => ({ events, updateEvent }), [events])}>
            <SymptomsCtx.Provider value={useMemo(() => ({ symptoms, updateSymptoms }), [symptoms])}>
                <PartnerInsightsCtx.Provider value={useMemo(() => ({ partnerInsights, updatePartnerInsights, deletePartnerInsights }), [partnerInsights])}>
                    <SelectedDateCtx.Provider value={useMemo(() => ({ selectedDate, setSelectedDate }), [selectedDate])}>
                        <SettingsCtx.Provider value={useMemo(() => ({ settings, updateSettings }), [settings])}>
                            <DbCtx.Provider value={useMemo(() => ({ db, setDb }), [db])}>{children}</DbCtx.Provider>
                        </SettingsCtx.Provider>
                    </SelectedDateCtx.Provider>
                </PartnerInsightsCtx.Provider>
            </SymptomsCtx.Provider>
        </EventsCtx.Provider>
    )
}

export const useEventsContext = () => useContext(EventsCtx)
export const useSymptomsContext = () => useContext(SymptomsCtx)
export const useSelectedDateContext = () => useContext(SelectedDateCtx)
export const useSettingsContext = () => useContext(SettingsCtx)
export const useDbContext = () => useContext(DbCtx)
export const usePartnerInsightsContext = () => useContext(PartnerInsightsCtx)
