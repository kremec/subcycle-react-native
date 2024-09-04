import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Card, Icon, Switch, Text, TouchableRipple } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as SQLite from 'expo-sqlite';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

import { useDbContext, useSettingsContext } from '../AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { getHourMinute, Settings } from '../Types';

export default function Tab() {
    const { theme } = useTheme();

    const { db, setDb } = useDbContext();
    const { settings, updateSettings } = useSettingsContext();
    const [currentSettings, setCurrentSettings] = useState(settings);
    useEffect(() => {
        setCurrentSettings(settings);
    }, [settings]);

    const [showNotificationTimePicker, setShowNotificationTimePicker] = useState(false);

    const originalDbFolder = FileSystem.documentDirectory + 'SQLite';
    const exportDb = async () => {
        const dbOriginalFilePath = originalDbFolder + '/subcycle.db';
        const dbCustomFilePath = FileSystem.documentDirectory + 'subcycle.db';
        await FileSystem.copyAsync({
            from: dbOriginalFilePath,
            to: dbCustomFilePath
        });
        await Sharing.shareAsync(dbCustomFilePath, { dialogTitle: 'Export database' });
    }

    const importDb = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
        });

        if (result.canceled || result.assets.length === 0)
            return;

        if (!((await FileSystem.getInfoAsync(originalDbFolder)).exists))
            await FileSystem.makeDirectoryAsync(originalDbFolder);

        const base64Data = await FileSystem.readAsStringAsync(
            result.assets[0].uri,
            { encoding: FileSystem.EncodingType.Base64 }
        );

        await FileSystem.writeAsStringAsync(originalDbFolder + '/subcycle.db', base64Data, { encoding: FileSystem.EncodingType.Base64 });
        setDb(SQLite.openDatabaseSync("subcycle.db"));
    }

    return (
        <>
            <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10, gap: 10, flexDirection: 'column' }}>
                <Card
                    style={{ overflow: 'hidden', padding: 10, backgroundColor: theme.colors.background, shadowColor: theme.colors.onBackground }}
                >
                    <Card.Title
                        title="Menstrual cycle prediction"
                        subtitle="Number of months for predictions"
                        left={(props) => <Icon source='chart-box-outline' {...props} />}
                    />
                    <Card.Content>
                        <Picker
                            selectedValue={currentSettings?.predictionsTimespan}
                            onValueChange={(itemValue) => {
                                const newSettings: Settings = { ...currentSettings, predictionsTimespan: itemValue };
                                updateSettings(newSettings);
                            }}
                            style={{
                                color: theme.colors.onBackground,
                                backgroundColor: theme.colors.background
                            }}
                            dropdownIconColor={theme.colors.onBackground}
                        >
                            <Picker.Item color={theme.colors.onBackground} style={{ backgroundColor: theme.colors.background }} label="No predictions" value={0} />
                            {[...Array(24)].map((_, i) => (
                                <Picker.Item color={theme.colors.onBackground} style={{ backgroundColor: theme.colors.background }} key={i + 1} label={`${i + 1} month${i > 0 ? 's' : ''}`} value={i + 1} />
                            ))}
                        </Picker>
                    </Card.Content>
                </Card>

                <Card
                    style={{ overflow: 'hidden', padding: 10, backgroundColor: theme.colors.background, shadowColor: theme.colors.onBackground }}
                >
                    <Card.Title
                        title="Pill notifications"
                        subtitle="Daily notification time"
                        left={(props) => <Icon source='alarm' {...props} />}
                    />
                    <Card.Content>
                        <TouchableRipple
                            style={{ padding: 10, borderRadius: 10 }}
                            onPress={() => setShowNotificationTimePicker(true)}
                        >
                            <Text>Notification time: {getHourMinute(currentSettings?.notificationTime)}</Text>
                        </TouchableRipple>
                        {showNotificationTimePicker && (
                            <DateTimePicker
                                value={currentSettings?.notificationTime}
                                mode="time"
                                is24Hour={true}
                                onChange={(event, value) => {
                                    if (event.type === 'set' && value)
                                        updateSettings({ ...currentSettings, notificationTime: value })

                                    setShowNotificationTimePicker(false)
                                }}
                            />
                        )}
                    </Card.Content>
                </Card>

                <Card
                    style={{ overflow: 'hidden', padding: 10, backgroundColor: theme.colors.background, shadowColor: theme.colors.onBackground }}
                >
                    <Card.Title
                        title="Partner mode"
                        subtitle="Coming soon <3"
                        left={(props) => <Icon source='account-heart-outline' {...props} />}
                    />
                    <Card.Content>
                        <Switch value={currentSettings.partnerMode} onValueChange={(value) => updateSettings({ ...currentSettings, partnerMode: value })} />
                    </Card.Content>
                </Card>
            </View>
            <View style={{ paddingHorizontal: 10, paddingVertical: 10, gap: 10, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Button
                        mode='outlined'
                        textColor={theme.colors.onBackground}
                        icon={(props) => <Icon source='import' {...props} />}
                        onPress={() => importDb()}
                    >
                        Import data
                    </Button>
                </View>
                <View style={{ flex: 1 }}>
                    <Button
                        mode='outlined'
                        textColor={theme.colors.onBackground}
                        icon={(props) => <Icon source='export' {...props} />}
                        onPress={() => exportDb()}
                    >
                        Export data
                    </Button>
                </View>
            </View>
        </>
    );
}
