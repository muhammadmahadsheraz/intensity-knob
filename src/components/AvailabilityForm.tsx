import type { CreateAvailability, Day, TimeSlot } from "../types/availability";
import { useState, useMemo } from "react";
import "./Components.css";

const days: Day[] = [
    "monday", "tuesday", "wednesday",
    "thursday", "friday", "saturday", "sunday"
];

const emptySlot: TimeSlot = { start: "", end: "" };

interface AvailabilityFormProps {
    userId: string;
    onSave: (availability: CreateAvailability) => void;
}

export default function AvailabilityForm({ userId, onSave }: AvailabilityFormProps) {
    const [form, setForm] = useState<CreateAvailability>({
        userId,
        monday: [{ ...emptySlot }],
        tuesday: [{ ...emptySlot }],
        wednesday: [{ ...emptySlot }],
        thursday: [{ ...emptySlot }],
        friday: [{ ...emptySlot }],
        saturday: [{ ...emptySlot }],
        sunday: [{ ...emptySlot }],
    });

    const isIncomplete = useMemo(() => {
        return days.some(day => {
            const slot = form[day][0];
            return !slot.start || !slot.end;
        });
    }, [form]);

    const handleChange = (day: Day, field: "start" | "end", value: string) => {
        setForm(prev => ({
            ...prev,
            [day]: [{ ...prev[day][0], [field]: value }]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isIncomplete) return;
        onSave(form);
        setForm({
            userId,
            monday: [{ ...emptySlot }],
            tuesday: [{ ...emptySlot }],
            wednesday: [{ ...emptySlot }],
            thursday: [{ ...emptySlot }],
            friday: [{ ...emptySlot }],
            saturday: [{ ...emptySlot }],
            sunday: [{ ...emptySlot }],
        });
    };

    return (
        <form className="component-card availability-form" onSubmit={handleSubmit}>
            <h2 className="component-title">Availability</h2>

            <div className="availability-days">
                {days.map((day) => (
                    <div className="availability-day" key={day}>
                        <h3>
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                        </h3>
                        <div className="availability-time">
                            <label>Start</label>
                            <input
                                type="time"
                                value={form[day][0].start}
                                onChange={e => handleChange(day, "start", e.target.value)}
                            />
                            <label>End</label>
                            <input
                                type="time"
                                value={form[day][0].end}
                                onChange={e => handleChange(day, "end", e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {isIncomplete && (
                <p className="validation-hint">Fill in start and end times for all days before saving.</p>
            )}

            <button className="component-button" type="submit" disabled={isIncomplete}>
                Save
            </button>
        </form>
    );
}
