import { useState } from 'react';
import { View } from 'react-native';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import { useTheme } from '../../theme/ThemeContext';
import { Button, Card, Icon, IconButton, Text } from 'react-native-paper';

export default function Tab() {
    const { theme } = useTheme();

    const [predictionSettingsOpen, setPredictionSettingsOpen] = useState(false); 
    const noPredictions = ["No predictions"];
    const predictionMonths = [...Array(28).keys()].map(i => i+1);
    const predictionSettings = [...noPredictions, ...predictionMonths];

    return (
        <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10, gap: 10, flexDirection: 'column' }}>
            <Card
                style={{ overflow: 'hidden', padding: 10, backgroundColor: theme.colors.background, shadowColor: theme.colors.onBackground }}
                onPress={() => {if (!predictionSettingsOpen) {setPredictionSettingsOpen(true)}}}
            >
                <Card.Title
                    title="Predictions timespan"
                    subtitle="How many months in advance should the app make predictions?"
                    subtitleNumberOfLines={2}
                    left={(props) => !predictionSettingsOpen ?
                        <Icon source='chart-box-outline' {...props} /> : 
                        <IconButton
                            mode='contained'
                            icon='arrow-up'
                            onPress={() => setPredictionSettingsOpen(false)}
                        />
                    }
                />
                {predictionSettingsOpen &&
                <Card.Content>
                    <View style={{ height: 180, marginTop: 10 }}>
                        <ScrollPicker
                            dataSource={predictionSettings}
                            selectedIndex={0}
                            renderItem={(data, index) => (
                                <Text key={index}>{data}</Text>
                            )}
                            onValueChange={(data) => {
                                console.log(data);
                            }}
                            wrapperHeight={180}
                            wrapperBackground={theme.colors.background}
                            itemHeight={60}
                            highlightColor={theme.colors.onBackground}
                            highlightBorderWidth={1}
                        />
                    </View>
                </Card.Content>}
            </Card>
        </View>
    );
}
