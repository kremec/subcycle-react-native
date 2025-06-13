import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button, Card, Icon, Switch, Text, TouchableRipple } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker'

import * as SQLite from 'expo-sqlite'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker'

import { useDbContext, useSettingsContext } from '../AppContext'
import { useTheme } from '../../theme/ThemeContext'
import { getHourMinute, Settings } from '../Types'
import { IconAlarm, IconFileExport, IconFileImport, IconReport, IconUserHeart } from '@tabler/icons-react-native'
import NotificationsManager, { sendTestNotification } from '../../notifications/NotificationsManager'
import React from 'react'

export default function SettingsTab() {
    const IS_DEV = process.env.NODE_ENV === 'development'

    const { theme } = useTheme()

    const { setDb } = useDbContext()
    const { settings, updateSettings } = useSettingsContext()

    const [showNotificationTimePicker, setShowNotificationTimePicker] = useState(false)

    const originalDbFolder = FileSystem.documentDirectory + 'SQLite'
    const exportDb = async () => {
        const dbOriginalFilePath = originalDbFolder + '/subcycle.db'
        const dbCustomFilePath = FileSystem.documentDirectory + 'subcycle.db'
        await FileSystem.copyAsync({
            from: dbOriginalFilePath,
            to: dbCustomFilePath
        })
        await Sharing.shareAsync(dbCustomFilePath, { dialogTitle: 'Export database' })
    }

    const importDb = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true
        })

        if (result.canceled || result.assets.length === 0) return

        if (!(await FileSystem.getInfoAsync(originalDbFolder)).exists) await FileSystem.makeDirectoryAsync(originalDbFolder)

        const base64Data = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: FileSystem.EncodingType.Base64 })

        await FileSystem.writeAsStringAsync(originalDbFolder + '/subcycle.db', base64Data, { encoding: FileSystem.EncodingType.Base64 })
        setDb(SQLite.openDatabaseSync('subcycle.db'))
    }

    return (
        <>
            <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10, gap: 10, flexDirection: 'column' }}>
                <Card style={{ overflow: 'hidden', padding: 10, backgroundColor: theme.colors.background, shadowColor: theme.colors.onBackground }}>
                    <Card.Title
                        title="Menstrual cycle prediction"
                        subtitle="Number of months for predictions"
                        left={(props) => <IconReport {...props} color={theme.colors.onBackground} strokeWidth={1.5} />}
                    />
                    <Card.Content>
                        <Picker
                            selectedValue={settings.predictionsTimespan}
                            onValueChange={(itemValue) => {
                                const newSettings: Settings = { ...settings, predictionsTimespan: itemValue }
                                updateSettings(newSettings)
                            }}
                            style={{
                                color: theme.colors.onBackground,
                                backgroundColor: theme.colors.background
                            }}
                            dropdownIconColor={theme.colors.onBackground}
                        >
                            <Picker.Item color={theme.colors.onBackground} style={{ backgroundColor: theme.colors.background }} label="No predictions" value={0} />
                            {[...Array(24)].map((_, i) => (
                                <Picker.Item
                                    color={theme.colors.onBackground}
                                    style={{ backgroundColor: theme.colors.background }}
                                    key={i + 1}
                                    label={`${i + 1} month${i > 0 ? 's' : ''}`}
                                    value={i + 1}
                                />
                            ))}
                        </Picker>
                    </Card.Content>
                </Card>

                <Card style={{ overflow: 'hidden', padding: 10, backgroundColor: theme.colors.background, shadowColor: theme.colors.onBackground }}>
                    <Card.Title title="Pill notifications" subtitle="Daily notification time" left={(props) => <IconAlarm {...props} color={theme.colors.onBackground} strokeWidth={1.5} />} />
                    <Card.Content>
                        <TouchableRipple style={{ padding: 10, borderRadius: 10 }} onPress={() => setShowNotificationTimePicker(true)}>
                            <Text variant="bodyLarge">Notification time: {settings.notificationTime ? getHourMinute(settings.notificationTime) : 'not set'}</Text>
                        </TouchableRipple>
                        {showNotificationTimePicker && (
                            <DateTimePicker
                                value={settings.notificationTime ?? new Date()}
                                mode="time"
                                is24Hour={true}
                                onChange={(event, value) => {
                                    if (event.type === 'set' && value) updateSettings({ ...settings, notificationTime: value })

                                    setShowNotificationTimePicker(false)
                                }}
                            />
                        )}
                        {IS_DEV && (
                            <Button mode="outlined" textColor={theme.colors.onBackground} onPress={() => sendTestNotification()}>
                                Send test notification
                            </Button>
                        )}
                    </Card.Content>
                </Card>

                <Card style={{ overflow: 'hidden', padding: 10, backgroundColor: theme.colors.background, shadowColor: theme.colors.onBackground }}>
                    <Card.Title title="Partner mode" subtitle="Insights based on day of cycle" left={(props) => <IconUserHeart {...props} color={theme.colors.onBackground} strokeWidth={1.5} />} />
                    <Card.Content>
                        <Switch color={theme.colors.secondary} value={settings.partnerMode} onValueChange={(value) => updateSettings({ ...settings, partnerMode: value })} />
                    </Card.Content>
                </Card>
            </View>
            <View style={{ paddingHorizontal: 10, paddingVertical: 10, gap: 10, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Button
                        mode="outlined"
                        textColor={theme.colors.onBackground}
                        icon={(props) => <IconFileImport {...props} color={theme.colors.onBackground} strokeWidth={2} />}
                        onPress={() => importDb()}
                    >
                        Import data
                    </Button>
                </View>
                <View style={{ flex: 1 }}>
                    <Button
                        mode="outlined"
                        textColor={theme.colors.onBackground}
                        icon={(props) => <IconFileExport {...props} color={theme.colors.onBackground} strokeWidth={2} />}
                        onPress={() => exportDb()}
                    >
                        Export data
                    </Button>
                </View>
            </View>
        </>
    )
}
