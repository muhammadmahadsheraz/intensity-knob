{/*Intensity Type and Values*/}

export type Intensity = "low" | "mild" | "moderate" | "intense" | "extreme";

export const intensityValues = [
    {
        key:'low',
        value:{
        meetingsPerDay:2,
        meetingDuration:60,
        break:90,
        cycleLength:15,
    }
},
    {
        key:'mild',
        value:{
        meetingsPerDay:3,
        meetingDuration:45,
        break:60,
        cycleLength:12,
    }
},
    {
        key:'moderate',
        value:{
        meetingsPerDay:4,
        meetingDuration:30,
        break:45,
        cycleLength:10,
    }
},
    {
        key:'intense',
        value:{
        meetingsPerDay:5,
        meetingDuration:30,
        break:30,
        cycleLength:7,
    }
},
    {
        key:'extreme',
        value:{
        meetingsPerDay:7,
        meetingDuration:20,
        break:15,
        cycleLength:5,
    }
}
]

{/*Progress Bar Constants*/}
export const progressRadius = 67;
export const circumference = 2 * Math.PI * progressRadius;
export const PROGRESS_OFFSETS: Record<Intensity, number> = {
    low: circumference - 5,
    mild: circumference * (7 / 8),
    moderate: circumference * (6 / 8),
    intense: circumference * (5 / 8),
    extreme: circumference * (4 / 8),
}

{/*Needle Rotation Constants*/}

export const rotation =
  {
  "low": 4,
  "mild":  45,
  "moderate": 90,
  "intense": 135,
  "extreme":176,
  }