import { View } from "react-native";
import { Divider, Text } from "react-native-paper";

import { SQLiteDb } from "../database/DbManager";

import CycleTime from "../components/CycleTime";
import Calendar from "../components/Calendar";
import TabletCheckbox from "../components/TabletCheckbox";

const Home = () => {
    return (
        <SQLiteDb>
            <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10, gap: 10 }}>
                <View style={{ justifyContent: 'center' }}>
                    <CycleTime />
                </View>
                
                <View style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
                    <Calendar />
                </View>
                
                <View style={{ justifyContent: 'center' }}>
                    <TabletCheckbox />
                </View>
            </View>
        </SQLiteDb>
    );
};

export default Home;