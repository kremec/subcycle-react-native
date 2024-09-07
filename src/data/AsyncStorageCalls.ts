import AsyncStorage from '@react-native-async-storage/async-storage'
import { Settings } from '../app/Types'

const SETTINGS_KEY = 'settings'

export async function storeSettings(value: Settings) {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(SETTINGS_KEY, jsonValue)
    } catch (e) {
        // saving error
    }
}

export async function getSettings() {
    try {
        const jsonValue = await AsyncStorage.getItem(SETTINGS_KEY)
        if (jsonValue) {
            const settings: Settings = JSON.parse(jsonValue)
            settings.notificationTime = new Date(settings.notificationTime) // Convert date string to Date
            return settings
        }
    } catch (e) {
        // error reading value
    }
}
