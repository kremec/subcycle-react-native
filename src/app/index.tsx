import { View } from "react-native";
import { Divider } from "react-native-paper";

import { SQLiteDb } from "../database/DbManager";

import CycleTime from "../components/CycleTime";
import Calendar from "../components/Calendar";
import TabletCheckbox from "../components/TabletCheckbox";

const Home = () => {
    return (
        <SQLiteDb>
            <View style={{ paddingHorizontal: 10, gap: 10 }}>
                <CycleTime />
                <Divider />
                <Calendar />
                <Divider />
                <TabletCheckbox />
            </View>
        </SQLiteDb>
    );
};

export default Home;