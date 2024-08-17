import React from 'react'
import { Button, Checkbox, Dialog, Portal, Text } from 'react-native-paper'
import { CalendarColors } from '../theme/Colors';
import { Event, getWeekdayDayMonth } from '../app/Types';

const CalendarEditDialog = ({ visible, onCancel, onDone, selectedEvent }:
    { visible: boolean, onCancel: () => void, onDone: (updatedDateEvent: Event) => void, selectedEvent: Event | undefined }) => {
    if (!selectedEvent)
        return;

    const [menstruationChecked, setMenstruationChecked] = React.useState(selectedEvent.menstruation);
    const [ovulationChecked, setOvulationChecked] = React.useState(selectedEvent.ovulation);
    const [tabletChecked, setTabletChecked] = React.useState(selectedEvent.tablet);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onCancel}>
                <Dialog.Title>
                    <Text variant="titleLarge">{selectedEvent.prediction ? "Predictions" : "Events"} for {getWeekdayDayMonth(selectedEvent.date)}</Text>
                </Dialog.Title>
                <Dialog.Content>
                    {/* Menstruation */}
                    <Checkbox.Item
                        status={menstruationChecked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setMenstruationChecked(!menstruationChecked);
                            if (!menstruationChecked)
                                setOvulationChecked(false); // Deselect ovulation if menstruation is deselected
                        }}
                        label='Menstruation'
                        color={CalendarColors.menstruation}
                    />
                    {/* Ovulation */}
                    <Checkbox.Item
                        status={ovulationChecked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setOvulationChecked(!ovulationChecked)
                            if (!ovulationChecked)
                                setMenstruationChecked(false) // Deselect menstruation if ovulation is deselected
                        }}
                        label='Ovulation'
                        color={CalendarColors.ovulation}
                    />
                    {/* Tablet */}
                    <Checkbox.Item
                        status={tabletChecked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setTabletChecked(!tabletChecked)
                        }}
                        label='Tablet'
                        color={CalendarColors.tablet}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => {
                        selectedEvent.menstruation = menstruationChecked;
                        selectedEvent.ovulation = ovulationChecked;
                        selectedEvent.tablet = tabletChecked;
                        selectedEvent.prediction = false;
                        onDone(selectedEvent);
                    }}>Done</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default CalendarEditDialog