import { View } from "react-native";
import { Divider } from "react-native-paper";

import CycleTime from "../components/CycleTime";
import Calendar from "../components/Calendar";
import TabletCheckbox from "../components/TabletCheckbox";

const Home = () => {
    return (
        <View style={{ paddingHorizontal: 10, gap: 10 }}>
            <CycleTime />
            <Divider />
            <Calendar />
            <Divider />
            <TabletCheckbox />
        </View>
    );
};

export default Home;