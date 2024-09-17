import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, Divider, FAB, List, SegmentedButtons, Text } from 'react-native-paper'

import { useTheme } from '../../theme/ThemeContext'
import { useEventsContext, usePartnerInsightsContext, useSelectedDateContext } from '../AppContext'

import { getDayInCycle } from '../../stats/CycleStats'
import PartnerInsightsEditDialog from '../../components/PartnerInsightsEditDialog'
import { defaultPartnerInsight, PartnerInsight } from '../Types'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { IconArrowDown, IconCompass, IconEdit } from '@tabler/icons-react-native'

const ParnerInfo = () => {
    const { theme } = useTheme()
    const { events } = useEventsContext()
    const { selectedDate } = useSelectedDateContext()
    const { partnerInsights, updatePartnerInsights } = usePartnerInsightsContext()

    const currentDayInCycle = getDayInCycle(selectedDate, events)
    const currentPartnerInsight = partnerInsights.filter((insight) => insight.dayInCycle <= currentDayInCycle).sort((a, b) => b.dayInCycle - a.dayInCycle)[0]

    const [partnerTabMode, setPartnerTabMode] = useState('view')
    const [editInsight, setEditInsight] = useState<PartnerInsight | null>(null)

    return (
        <>
            <SegmentedButtons
                style={{ marginHorizontal: 10, marginVertical: 10 }}
                value={partnerTabMode}
                onValueChange={setPartnerTabMode}
                buttons={[
                    {
                        value: 'view',
                        label: "Today's insights",
                        icon: () => <IconCompass size={20} color={theme.colors.onBackground} strokeWidth={1.5} />
                    },
                    {
                        value: 'edit',
                        label: 'Edit insights',
                        icon: () => <IconEdit size={20} color={theme.colors.onBackground} strokeWidth={1.5} />
                    }
                ]}
            />
            {partnerTabMode === 'view' ? (
                <>
                    <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10, gap: 10 }}>
                        <Text variant="headlineSmall" style={{ textAlign: 'center' }}>
                            {currentPartnerInsight ? currentPartnerInsight.name : 'No insights found'}
                        </Text>
                        <Text variant="titleLarge">{currentPartnerInsight ? currentPartnerInsight.description : ''}</Text>
                    </View>
                </>
            ) : partnerTabMode === 'edit' ? (
                <>
                    <ScrollView style={{ marginHorizontal: 10, marginVertical: 10 }}>
                        <Divider />
                        {partnerInsights
                            .sort((a, b) => a.dayInCycle - b.dayInCycle)
                            .map((insight) => (
                                <>
                                    <List.Item
                                        key={insight.dayInCycle}
                                        title={insight.name}
                                        description={insight.description}
                                        onPress={() => {
                                            setEditInsight(insight)
                                        }}
                                        left={() => (
                                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                <Text>{insight.dayInCycle}</Text>
                                                <IconArrowDown color={theme.colors.onBackground} strokeWidth={1.5} />
                                            </View>
                                        )}
                                    />
                                    <Divider key={insight.dayInCycle + '-divider'} />
                                </>
                            ))}
                    </ScrollView>

                    <FAB
                        icon="plus"
                        style={{ position: 'absolute', margin: 15, right: 0, bottom: 0 }}
                        onPress={() => {
                            setEditInsight(defaultPartnerInsight)
                        }}
                    />
                </>
            ) : null}
            {editInsight && (
                <PartnerInsightsEditDialog
                    selectedInsight={editInsight}
                    visible={true}
                    onCancel={() => {
                        setEditInsight(null)
                    }}
                    onDone={(updatedPartnerInsight, remove) => {
                        if (remove) updatePartnerInsights({ ...updatedPartnerInsight, dayInCycle: -1 }, editInsight.dayInCycle)
                        else if (!partnerInsights.some((i) => i.dayInCycle == updatedPartnerInsight.dayInCycle) || editInsight.dayInCycle === updatedPartnerInsight.dayInCycle)
                            updatePartnerInsights(updatedPartnerInsight, editInsight.dayInCycle)

                        setEditInsight(null)
                    }}
                />
            )}
        </>
    )
}

export default ParnerInfo
