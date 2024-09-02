import { View } from "react-native";

import CycleStatus from "../../components/CycleStatus";
import Calendar from "../../components/Calendar";
import SymptomsOverview from "../../components/SymptomsOverview";

const Home = () => {
    return (
        <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10, gap: 10 }}>
            <View style={{ justifyContent: 'center' }}>
                <CycleStatus />
            </View>

            <View style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
                <Calendar />
            </View>

            <View style={{ justifyContent: 'center' }}>
                <SymptomsOverview />
            </View>
        </View>
    );
};

export default Home;