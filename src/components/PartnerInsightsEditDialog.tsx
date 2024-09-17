import React from 'react'
import { Button, Dialog, Portal, Text, TextInput } from 'react-native-paper'
import { PartnerInsight } from '../app/Types'
import { View } from 'react-native'

const PartnerInsightsEditDialog = ({
    selectedInsight,
    visible,
    onCancel,
    onDone
}: {
    selectedInsight: PartnerInsight
    visible: boolean
    onCancel: () => void
    onDone: (updatedPartnerInsight: PartnerInsight, remove: boolean) => void
}) => {
    const [name, setName] = React.useState(selectedInsight ? selectedInsight.name : '')
    const [description, setDescription] = React.useState(selectedInsight ? selectedInsight.description : '')
    const [dayInCycle, setDayInCycle] = React.useState(selectedInsight ? (selectedInsight.dayInCycle == -1 ? '' : selectedInsight.dayInCycle.toString()) : '')

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onCancel}>
                <Dialog.Title>
                    <Text variant="titleLarge">{name ? name : 'New insight'}</Text>
                </Dialog.Title>
                <Dialog.Content>
                    {selectedInsight && (
                        <>
                            <TextInput label="Name" multiline={true} value={name} onChangeText={(text) => setName(text)} />
                            <View style={{ height: 20 }} />
                            <TextInput label="Description" multiline={true} defaultValue={description} onChangeText={(text) => setDescription(text)} />
                            <View style={{ height: 20 }} />
                            <TextInput label="Start day in cycle" keyboardType="numeric" value={dayInCycle} onChangeText={(text) => setDayInCycle(text.replace(/[^0-9]/g, ''))} />
                        </>
                    )}
                </Dialog.Content>
                <Dialog.Actions>
                    {selectedInsight && (
                        <>
                            <Button onPress={() => onDone({ ...selectedInsight, name, description, dayInCycle: parseInt(dayInCycle) }, true)}>Delete</Button>
                            <Button onPress={() => onDone({ ...selectedInsight, name, description, dayInCycle: parseInt(dayInCycle) }, false)}>Done</Button>
                        </>
                    )}
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default PartnerInsightsEditDialog
