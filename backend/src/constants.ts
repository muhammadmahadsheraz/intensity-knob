import {Day} from "./models/Availability"
export const intensityValues = {
    low:{
        key:'low',
        value:{
        meetingsPerDay:2,
        meetingDuration:60,
        break:90,
        cycleLength:15,
    }
},
    mild:{
        value:{
        meetingsPerDay:3,
        meetingDuration:45,
        break:60,
        cycleLength:12,
    }
},
    moderate:{
        value:{
        meetingsPerDay:4,
        meetingDuration:30,
        break:45,
        cycleLength:10,
    }
},
    intense:{
        value:{
        meetingsPerDay:5,
        meetingDuration:30,
        break:30,
        cycleLength:7,
    }
},
  extreme:  {
        value:{
        meetingsPerDay:7,
        meetingDuration:20,
        break:15,
        cycleLength:5,
    }
}
} as const;
export type Intensity = keyof typeof intensityValues;
export const days: Day[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
];