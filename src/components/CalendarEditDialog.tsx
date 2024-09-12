import React from 'react'
import { Button, Dialog, Portal, Text } from 'react-native-paper'
import { CalendarColors } from '../theme/Colors'
import { Event, getWeekdayDayMonth } from '../app/Types'
import { View } from 'react-native'
import { IconChartBubble, IconDroplet, IconDropletHalfFilled, IconEgg, IconPillFilled } from '@tabler/icons-react-native'
import { useTheme } from '../theme/ThemeContext'

const CalendarEditDialog = ({
    visible,
    onCancel,
    onDone,
    selectedEvent,
    dayInCycle
}: {
    visible: boolean
    onCancel: () => void
    onDone: (updatedDateEvent: Event) => void
    selectedEvent: Event | undefined
    dayInCycle: number | undefined
}) => {
    if (!selectedEvent) return

    const { theme } = useTheme()

    const [menstruationLightChecked, setMenstruationLightChecked] = React.useState(selectedEvent.menstruationLight)
    const [menstruationModerateChecked, setMenstruationModerateChecked] = React.useState(selectedEvent.menstruationModerate)
    const [menstruationHeavyChecked, setMenstruationHeavyChecked] = React.useState(selectedEvent.menstruationHeavy)
    const [menstruationSpottingChecked, setMenstruationSpottingChecked] = React.useState(selectedEvent.menstruationSpotting)
    const [ovulationChecked, setOvulationChecked] = React.useState(selectedEvent.ovulation)
    const [pillChecked, setPillChecked] = React.useState(selectedEvent.pill)

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onCancel}>
                <Dialog.Title style={{ paddingTop: 10 }}>
                    <View>
                        <Text variant="titleLarge">
                            {selectedEvent.prediction ? 'Predictions' : 'Events'} for {getWeekdayDayMonth(selectedEvent.date)}
                        </Text>
                        {dayInCycle && (
                            <Text variant="titleSmall">{dayInCycle && `${dayInCycle === 1 ? '1st' : dayInCycle === 2 ? '2nd' : dayInCycle === 3 ? '3rd' : dayInCycle + 'th'} day of cycle`}</Text>
                        )}
                    </View>
                </Dialog.Title>
                <Dialog.Content>
                    {/* Menstruation */}
                    <Button
                        mode="outlined"
                        onPress={() => {
                            setMenstruationLightChecked(!menstruationLightChecked)
                            if (!menstruationLightChecked) {
                                setMenstruationModerateChecked(false)
                                setMenstruationHeavyChecked(false)
                                setMenstruationSpottingChecked(false)
                                setOvulationChecked(false)
                            }
                        }}
                        buttonColor={menstruationLightChecked ? CalendarColors.menstruationLight : 'transparent'}
                        icon={(props) => <IconDroplet {...props} color={theme.colors.onBackground} strokeWidth={1.5} />}
                        style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottomWidth: 0 }}
                    >
                        <Text variant="bodyLarge">Low</Text>
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={() => {
                            setMenstruationModerateChecked(!menstruationModerateChecked)
                            if (!menstruationModerateChecked) {
                                setMenstruationLightChecked(false)
                                setMenstruationHeavyChecked(false)
                                setMenstruationSpottingChecked(false)
                                setOvulationChecked(false)
                            }
                        }}
                        buttonColor={menstruationModerateChecked ? CalendarColors.menstruationModerate : 'transparent'}
                        icon={(props) => <IconDropletHalfFilled {...props} color={theme.colors.onBackground} strokeWidth={0} fill={theme.colors.onBackground} />}
                        style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottomWidth: 0 }}
                    >
                        <Text variant="bodyLarge">Moderate</Text>
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={() => {
                            setMenstruationHeavyChecked(!menstruationHeavyChecked)
                            if (!menstruationHeavyChecked) {
                                setMenstruationLightChecked(false)
                                setMenstruationModerateChecked(false)
                                setMenstruationSpottingChecked(false)
                                setOvulationChecked(false)
                            }
                        }}
                        buttonColor={menstruationHeavyChecked ? CalendarColors.menstruationHeavy : 'transparent'}
                        icon={(props) => <IconDroplet {...props} color={theme.colors.onBackground} strokeWidth={0} fill={theme.colors.onBackground} />}
                        style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottomWidth: 0 }}
                    >
                        <Text variant="bodyLarge">Heavy</Text>
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={() => {
                            setMenstruationSpottingChecked(!menstruationSpottingChecked)
                            if (!menstruationSpottingChecked) {
                                setMenstruationLightChecked(false)
                                setMenstruationModerateChecked(false)
                                setMenstruationHeavyChecked(false)
                                setOvulationChecked(false)
                            }
                        }}
                        buttonColor={menstruationSpottingChecked ? CalendarColors.menstruationModerate : 'transparent'}
                        icon={(props) => <IconChartBubble {...props} color={theme.colors.onBackground} strokeWidth={0} fill={theme.colors.onBackground} />}
                        style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                    >
                        <Text variant="bodyLarge">Spotting</Text>
                    </Button>

                    <View style={{ height: 20 }} />

                    {/* Ovulation */}
                    <Button
                        mode="outlined"
                        onPress={() => {
                            setOvulationChecked(!ovulationChecked)
                            if (!ovulationChecked) {
                                setMenstruationLightChecked(false)
                                setMenstruationModerateChecked(false)
                                setMenstruationHeavyChecked(false)
                                setMenstruationSpottingChecked(false)
                            }
                        }}
                        buttonColor={ovulationChecked ? CalendarColors.ovulation : 'transparent'}
                        icon={(props) => <IconEgg {...props} color={theme.colors.onBackground} strokeWidth={1.5} />}
                    >
                        <Text variant="bodyLarge">Ovulation</Text>
                    </Button>

                    <View style={{ height: 20 }} />

                    {/* Pill */}
                    <Button
                        mode="outlined"
                        onPress={() => setPillChecked(!pillChecked)}
                        buttonColor={pillChecked ? CalendarColors.pill : 'transparent'}
                        icon={(props) => <IconPillFilled {...props} color={theme.colors.onBackground} strokeWidth={0} fill={theme.colors.onBackground} />}
                    >
                        <Text variant="bodyLarge">Pill</Text>
                    </Button>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button
                        onPress={() => {
                            // If we opened a prediction and selected none of the options, cancel
                            if (
                                selectedEvent.prediction &&
                                !menstruationLightChecked &&
                                !menstruationModerateChecked &&
                                !menstruationHeavyChecked &&
                                !menstruationSpottingChecked &&
                                !ovulationChecked &&
                                !pillChecked
                            ) {
                                onCancel()
                                return
                            }
                            selectedEvent.menstruationLight = menstruationLightChecked
                            selectedEvent.menstruationModerate = menstruationModerateChecked
                            selectedEvent.menstruationHeavy = menstruationHeavyChecked
                            selectedEvent.menstruationSpotting = menstruationSpottingChecked
                            selectedEvent.ovulation = ovulationChecked
                            selectedEvent.pill = pillChecked
                            selectedEvent.prediction = false
                            onDone(selectedEvent)
                        }}
                    >
                        Done
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default CalendarEditDialog
