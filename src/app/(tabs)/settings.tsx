import { useState } from 'react';
import { View } from 'react-native';
import { Card, Icon, Switch, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useTheme } from '../../theme/ThemeContext';
import { getHourMinute } from '../Types';

export default function Tab() {
    const { theme } = useTheme();

    const [predictionSettings, setPredictionSettings] = useState();
    console.log(predictionSettings);

    const [showNotificationTimePicker, setShowNotificationTimePicker] = useState(false);
    const [notificationTime, setNotificationTime] = useState(new Date(new Date().setHours(18, 0, 0)));
    console.log(notificationTime);

    const [partnerMode, setPartnerMode] = useState(false);
    console.log(partnerMode);

    return (
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
                        selectedValue={predictionSettings}
                        onValueChange={(itemValue) => setPredictionSettings(itemValue)}
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
                onPress={() => setShowNotificationTimePicker(true)}
            >
                <Card.Title
                    title="Tablet notifications"
                    subtitle="Daily notification time"
                    left={(props) => <Icon source='alarm' {...props} />}
                />
                <Card.Content>
                    <Text>Notification time: {getHourMinute(notificationTime)}</Text>
                    {showNotificationTimePicker && (
                        <DateTimePicker
                            value={notificationTime}
                            mode="time"
                            is24Hour={true}
                            onChange={(event, value) => {
                                if (event.type === 'set' && value)
                                    setNotificationTime(value)

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
                    subtitle="(Coming soon)"
                    left={(props) => <Icon source='account-heart-outline' {...props} />}
                />
                <Card.Content>
                    <Switch value={partnerMode} onValueChange={setPartnerMode} />
                </Card.Content>
            </Card>
        </View>
    );
}
