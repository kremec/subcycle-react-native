import * as TaskManager from 'expo-task-manager'
import * as Notifications from 'expo-notifications'
import { defaultEvent, isSameDate } from '../app/Types'
import { getEventsFromDb, updateEventInDb } from '../data/SqlDbCalls'
import * as SQLite from 'expo-sqlite'

const BACKGROUND_NOTIFICATION_TASK = 'PILL_REMINDER_TASK'

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error }) => {
    if (error) {
        console.error('Background task error:', error)
        return
    }
    if (!data) {
        console.error('Background task data is undefined')
        return
    }

    const { actionIdentifier, notification } = data as Notifications.NotificationResponse
    if (actionIdentifier === 'checkpill') {
        const db = SQLite.openDatabaseSync('subcycle.db')

        let eventForToday = (await getEventsFromDb(db)).filter(e => isSameDate(e.date, new Date()))[0];
        if (!eventForToday) {
            eventForToday = defaultEvent(new Date());
        }
        eventForToday.pill = true

        // Update the event in the database
        await updateEventInDb(db, eventForToday)

        console.log('Pill reminder task completed')

        await Notifications.dismissNotificationAsync(
            notification.request.identifier
        );
    }
})

export const registerBackgroundTask = async () => {
    Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)
        .then(() => console.log("Background notification task registered."))
        .catch((e) =>
            console.error("Failed to register background task", e)
        );
}

export default BACKGROUND_NOTIFICATION_TASK
