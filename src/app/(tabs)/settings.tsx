import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Card, Icon, Switch, Text, TouchableRipple } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useTheme } from '../../theme/ThemeContext';
import { useAppContext } from '../AppContext';
import { getHourMinute, Settings } from '../Types';

export default function Tab() {
    const { theme } = useTheme();

    
    const { settings, updateSettings } = useAppContext();
    const [currentSettings, setCurrentSettings] = useState(settings);
    useEffect(() => {
        setCurrentSettings(settings);
    }, [settings]);

    const [showNotificationTimePicker, setShowNotificationTimePicker] = useState(false);

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
                                const newSettings: Settings = {...currentSettings, predictionsTimespan: itemValue};
                                updateSettings(newSettings);
                            }}
                        >
                            <Picker.Item label="No predictions" value={0} />
                            {[...Array(24)].map((_, i) => (
                                <Picker.Item key={i + 1} label={`${i + 1} month${i > 0 ? 's' : ''}`} value={i + 1} />
                            ))}
                        </Picker>
                    </Card.Content>
                </Card>

                <Card
                    style={{ overflow: 'hidden', padding: 10, backgroundColor: theme.colors.background, shadowColor: theme.colors.onBackground }}
                >
                    <Card.Title
                        title="Tablet notifications"
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
                        onPress={() => console.log("Import data")}
                    >
                        Import data
                    </Button>
                </View>
                <View style={{ flex: 1 }}>
                    <Button
                        mode='outlined'
                        textColor={theme.colors.onBackground}
                        icon={(props) => <Icon source='export' {...props} />}
                        onPress={() => console.log("Export data")}
                    >
                        Export data
                    </Button>
                </View>
            </View>
        </>
    );
}
