import React from 'react'
import { Button, Checkbox, Dialog, Portal } from 'react-native-paper'
import { CalendarColors } from '../theme/Colors';
import { Event } from '../app/Types';

const CalendarEditDialog = ({ visible, onCancel, onDone, selectedDateEvents }:
    { visible: boolean, onCancel: () => void, onDone: (updatedDateEvent: Event) => void, selectedDateEvents: Event | undefined }) => {
    if (!selectedDateEvents)
        return;

    const [menstruationChecked, setMenstruationChecked] = React.useState(selectedDateEvents.menstruation);
    const [ovulationChecked, setOvulationChecked] = React.useState(selectedDateEvents.ovulation);
    const [tabletChecked, setTabletChecked] = React.useState(selectedDateEvents.tablet);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onCancel}>
                <Dialog.Title>
                    Edit events for {selectedDateEvents.date.toLocaleDateString()}
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
                        selectedDateEvents.menstruation = menstruationChecked;
                        selectedDateEvents.ovulation = ovulationChecked;
                        selectedDateEvents.tablet = tabletChecked;
                        selectedDateEvents.prediction = false;
                        onDone(selectedDateEvents);
                    }}>Done</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default CalendarEditDialog