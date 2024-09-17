import React, { useState } from 'react'
import { View } from 'react-native'
import { Divider, FAB, List, SegmentedButtons, Text } from 'react-native-paper'

import { useTheme } from '../../theme/ThemeContext'
import { useEventsContext, usePartnerInsightsContext } from '../AppContext'

import { getDayInCycle } from '../../stats/CycleStats'
import PartnerInsightsEditDialog from '../../components/PartnerInsightsEditDialog'
import { defaultPartnerInsight, PartnerInsight } from '../Types'
import { ScrollView } from 'react-native-gesture-handler'
import { IconArrowDown, IconCompass, IconEdit } from '@tabler/icons-react-native'

const PartnerInfo = () => {
    const { theme } = useTheme()
    const { events } = useEventsContext()
    const { partnerInsights, updatePartnerInsights } = usePartnerInsightsContext()

    const currentDayInCycle = getDayInCycle(new Date(), events)
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
                        {currentPartnerInsight && !Number.isNaN(currentDayInCycle) ? (
                            <>
                                <Text variant="titleLarge" style={{ textAlign: 'center', marginBottom: -10 }}>
                                    {currentPartnerInsight.name}
                                </Text>
                                <Text variant="titleSmall" style={{ textAlign: 'center' }}>
                                    {`(${currentDayInCycle}${currentDayInCycle === 1 ? 'st' : currentDayInCycle === 2 ? 'nd' : currentDayInCycle === 3 ? 'rd' : 'th'} day in cycle)`}
                                </Text>
                                <Text variant="bodyLarge">{currentPartnerInsight.description}</Text>
                            </>
                        ) : (
                            <Text variant="titleLarge" style={{ textAlign: 'center', marginBottom: -10 }}>
                                No insights found
                            </Text>
                        )}
                    </View>
                </>
            ) : partnerTabMode === 'edit' ? (
                <>
                    <ScrollView style={{ marginHorizontal: 10, marginVertical: 10 }}>
                        <Divider />
                        {partnerInsights
                            .sort((a, b) => a.dayInCycle - b.dayInCycle)
                            .map((insight) => (
                                <React.Fragment key={insight.dayInCycle}>
                                    <List.Item
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
                                    <Divider />
                                </React.Fragment>
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

export default PartnerInfo
