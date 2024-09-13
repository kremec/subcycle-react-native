import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, FAB, Text } from 'react-native-paper'

import { useTheme } from '../../theme/ThemeContext'
import { useEventsContext, usePartnerInsightsContext, useSelectedDateContext } from '../AppContext'

import { getDayInCycle } from '../../stats/CycleStats'
import PartnerInsightsEditDialog from '../../components/PartnerInsightsEditDialog'
import { defaultPartnerInsight, PartnerInsight } from '../Types'

const ParnerInfo = () => {
    const { theme } = useTheme()
    const { events } = useEventsContext()
    const { selectedDate } = useSelectedDateContext()
    const { partnerInsights, updatePartnerInsights, deletePartnerInsights } = usePartnerInsightsContext()

    const currentDayInCycle = getDayInCycle(selectedDate, events)
    const currentPartnerInsight = partnerInsights.filter((insight) => insight.dayInCycle <= currentDayInCycle).sort((a, b) => a.dayInCycle - b.dayInCycle)[0]

    const [editListVisible, setEditListVisible] = useState(false)
    const [selectedInsight, setSelectedInsight] = useState<PartnerInsight>(defaultPartnerInsight)
    const [dialogVisible, setDialogVisible] = useState(false)

    return (
        <>
            {!dialogVisible && (
                <>
                    <Button mode="outlined" style={{ marginHorizontal: 10, marginVertical: 10 }} textColor={theme.colors.onBackground} onPress={() => setEditListVisible(!editListVisible)}>
                        {editListVisible ? "View today's insights" : 'Edit insights'}
                    </Button>
                    {!editListVisible ? (
                        <>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, gap: 10 }}>
                                <Text variant="headlineSmall" style={{ textAlign: 'center' }}>
                                    {currentPartnerInsight ? currentPartnerInsight.name : 'No insights found'}
                                </Text>
                                <Text variant="titleLarge" style={{ textAlign: 'center' }}>
                                    {currentPartnerInsight ? currentPartnerInsight.description : ''}
                                </Text>
                            </View>
                        </>
                    ) : (
                        <>
                            {partnerInsights.map((insight) => (
                                <Button
                                    key={insight.dayInCycle}
                                    mode="outlined"
                                    onPress={() => {
                                        setSelectedInsight(insight)
                                    }}
                                >
                                    {insight.name}
                                </Button>
                            ))}
                            <FAB
                                icon="plus"
                                style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
                                onPress={() => {
                                    setSelectedInsight(defaultPartnerInsight)
                                    setDialogVisible(true)
                                }}
                            />
                        </>
                    )}
                </>
            )}
            <PartnerInsightsEditDialog
                selectedInsight={selectedInsight}
                visible={dialogVisible}
                onCancel={() => setDialogVisible(false)}
                onDone={(updatedPartnerInsight, remove) => setDialogVisible(false)}
            />
        </>
    )
}

export default ParnerInfo
