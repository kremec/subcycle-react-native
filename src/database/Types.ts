export type MenstrualEvent = {
    date: Date;
};

export type OvulationEvent = {
    date: Date;
};

export type TabletEvent = {
    date: Date;
};

export type DbData = {
    menstrualEvents: MenstrualEvent[];
    ovulationEvents: OvulationEvent[];
    tabletEvents: TabletEvent[];
    addMenstrualEvent: (date: Date) => void;
};