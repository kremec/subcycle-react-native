import { View } from "react-native";

import { AppContext } from "../AppContext";

import CycleStatus from "../../components/CycleStatus";
import Calendar from "../../components/Calendar";
import TabletCheckbox from "../../components/TabletCheckbox";

const Home = () => {
    return (
        <AppContext>
            <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10, gap: 10 }}>
                <View style={{ justifyContent: 'center' }}>
                    <CycleStatus />
                </View>
                
                <View style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
                    <Calendar />
                </View>
                
                <View style={{ justifyContent: 'center' }}>
                    <TabletCheckbox />
                </View>
            </View>
        </AppContext>
    );
};

export default Home;