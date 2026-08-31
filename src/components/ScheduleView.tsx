import type { Schedule } from "../types/schedule";
import { getMeeting, completeMeetingApi, skipMeetingApi, rescheduleSkippedApi } from "../services/api";
import type { Meeting } from "../types/meeting";
import { useState, useEffect, useCallback } from "react";
import "./Components.css";

interface ScheduleViewProps {
    userId: string;
    schedule: Schedule;
    onScheduleUpdate: (schedule: Schedule) => void;
}

export default function ScheduleView({ userId, schedule, onScheduleUpdate }: ScheduleViewProps) {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [confirmId, setConfirmId] = useState<string | null>(null);

    const fetchMeetings = useCallback(() => {
        getMeeting(userId)
            .then(setMeetings)
            .catch(console.error);
    }, [userId]);

    useEffect(() => {
        fetchMeetings();
    }, [fetchMeetings]);

    const meetingMap = new Map(meetings.map(m => [m._id, m]));

    const now = new Date();

    useEffect(() => {
        schedule.entries.forEach(entry => {
            if (entry.status !== "scheduled") return;
            const entryTime = new Date(entry.date);
            const [h, m] = entry.start.split(":").map(Number);
            entryTime.setHours(h, m, 0, 0);
            if (now > entryTime) {
                skipMeetingApi(entry.meetingId, userId)
                    .then(onScheduleUpdate)
                    .catch(console.error);
            }
        });
    }, [schedule.entries, userId, onScheduleUpdate]);

    const handleComplete = async (meetingId: string) => {
        try {
            const updated = await completeMeetingApi(meetingId, userId);
            onScheduleUpdate(updated);
            setConfirmId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleReschedule = async () => {
        try {
            const updated = await rescheduleSkippedApi(userId);
            onScheduleUpdate(updated);
        } catch (error) {
            console.error(error);
        }
    };

    const skippedCount = schedule.entries.filter(e => e.status === "skipped").length;

    const getEntryStatus = (entry: typeof schedule.entries[0]) => {
        if (entry.status === "completed") return "completed";
        if (entry.status === "skipped") return "skipped";
        if (entry.status === "pending") return "pending";
        const entryTime = new Date(entry.date);
        const [h, m] = entry.start.split(":").map(Number);
        entryTime.setHours(h, m, 0, 0);
        return now > entryTime ? "skipped" : "scheduled";
    };

    return (
        <div className="component-card schedule-view">
            <p className="schedule-intensity">
                Intensity: {schedule.intensity}
            </p>

            {skippedCount > 0 && (
                <div className="skip-banner">
                    <span>{skippedCount} skipped meeting{skippedCount > 1 ? "s" : ""}</span>
                    <button className="component-button reschedule-btn" onClick={handleReschedule}>
                        Reschedule
                    </button>
                </div>
            )}

            <div className="schedule-meetings">
                {schedule.entries.map(entry => {
                    const meeting = meetingMap.get(entry.meetingId);
                    if (!meeting) return null;

                    const displayStatus = getEntryStatus(entry);
                    const entryTime = new Date(entry.date);
                    const [h, m] = entry.start.split(":").map(Number);
                    entryTime.setHours(h, m, 0, 0);
                    const canCheck = displayStatus === "scheduled" && now < entryTime;

                    return (
                        <div className="schedule-meeting-card" key={entry.meetingId}>
                            <div className="meeting-card-header">
                                <h3>{meeting.title}</h3>
                                <span className={`status-badge status-${displayStatus}`}>
                                    {displayStatus}
                                </span>
                            </div>

                            <p>Description: {meeting.description}</p>
                            <p>Date: {new Date(entry.date).toDateString()}</p>
                            <p>Start: {entry.start}</p>

                            {canCheck && (
                                <div className="meeting-actions">
                                    {confirmId === entry.meetingId ? (
                                        <div className="confirm-row">
                                            <span>Mark as completed?</span>
                                            <button
                                                className="component-button confirm-btn"
                                                onClick={() => handleComplete(entry.meetingId)}
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                className="component-button cancel-btn"
                                                onClick={() => setConfirmId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                onChange={() => setConfirmId(entry.meetingId)}
                                            />
                                            Mark complete
                                        </label>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
