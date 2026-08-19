import "./IntensityKnob.css";
import IntensityKnob from "./IntensityKnob";
import { useEffect, useState } from "react";
import type { Intensity } from "./constants";
import "./Components.css";
import { intensityValues } from "./constants";

interface ScheduleMakerProp {
    onSave: (intensity: Intensity) => void;
    hasAvailability: boolean;
    meetingCount: number;
}

function ScheduleMaker({ onSave, hasAvailability, meetingCount }: ScheduleMakerProp) {
    const [value, setValue] = useState<Intensity>("moderate");
    const [meetingsPerDay, setMeetingsPerDay] = useState("");
    const [meetingDuration, setMeetingDuration] = useState("");
    const [breakTime, setBreakTime] = useState("");
    const [cycleLength, setCycleLength] = useState("");

    useEffect(() => {
        setMeetingsPerDay(intensityValues.find(item => item.key === value)?.value.meetingsPerDay.toString() || "");
        setMeetingDuration(intensityValues.find(item => item.key === value)?.value.meetingDuration.toString() || "");
        setBreakTime(intensityValues.find(item => item.key === value)?.value.break.toString() || "");
        setCycleLength(intensityValues.find(item => item.key === value)?.value.cycleLength.toString() || "");
    }, [value]);

    useEffect(() => {
        if (meetingsPerDay && meetingDuration && breakTime && cycleLength) {
            intensityValues.forEach(item => {
                if (
                    meetingsPerDay === item.value.meetingsPerDay.toString() &&
                    meetingDuration === item.value.meetingDuration.toString() &&
                    breakTime === item.value.break.toString() &&
                    cycleLength === item.value.cycleLength.toString()
                ) {
                    setValue(item.key as Intensity);
                }
            });
        }
    }, [meetingsPerDay, meetingDuration, breakTime, cycleLength]);

    const canSave = hasAvailability && meetingCount > 0;

    const handleClick = () => {
        if (!canSave) return;
        onSave(value);
    };

    return (
        <div className="component-card schedule-maker">
            <IntensityKnob value={value} onChange={setValue} />
            <div className="schedule-inputs">
                <div className="schedule-input-row">
                    <label className="schedule-input-label">Meetings per Day</label>
                    <input className="schedule-input" onChange={e => setMeetingsPerDay(e.target.value)} value={meetingsPerDay} />
                </div>
                <div className="schedule-input-row">
                    <label className="schedule-input-label">Meeting Duration</label>
                    <input className="schedule-input" onChange={e => setMeetingDuration(e.target.value)} value={meetingDuration} />
                </div>
                <div className="schedule-input-row">
                    <label className="schedule-input-label">Break</label>
                    <input className="schedule-input" onChange={e => setBreakTime(e.target.value)} value={breakTime} />
                </div>
                <div className="schedule-input-row">
                    <label className="schedule-input-label">Cycle Length</label>
                    <input className="schedule-input" onChange={e => setCycleLength(e.target.value)} value={cycleLength} />
                </div>
            </div>
            {!canSave && (
                <p className="validation-hint">
                    {!hasAvailability ? "Set your availability first." : "Create at least one meeting first."}
                </p>
            )}
            <button className="component-button" onClick={handleClick} disabled={!canSave}>
                Save Schedule Intensity
            </button>
        </div>
    );
}

export default ScheduleMaker;
