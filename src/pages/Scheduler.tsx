import { useState, useEffect, useCallback } from "react";
import ScheduleMaker from "../components/ScheduleMaker";
import ScheduleView from "../components/ScheduleView";
import Navbar from "../components/Navbar";
import type { Schedule } from "../types/schedule";
import { createSchedule, getSchedule, getAvailability, getMeetings } from "../services/api";
import type { Intensity } from "../components/constants";
import { useAuth } from "../context/AuthContext";
import type { Day } from "../types/availability";

export default function Scheduler() {
    const { userId } = useAuth();
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [hasAvailability, setHasAvailability] = useState(false);
    const [meetingCount, setMeetingCount] = useState(0);

    const fetchSchedule = useCallback(() => {
        if (!userId) return;
        getSchedule(userId)
            .then(setSchedule)
            .catch(() => setSchedule(null));
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

        getAvailability(userId)
            .then(() => setHasAvailability(true))
            .catch(() => setHasAvailability(false));

        getMeetings(userId)
            .then(meetings => setMeetingCount(meetings.filter(m => m.status !== "completed" && m.status !== "cancelled" && m.status !== "scheduled").length))
            .catch(() => setMeetingCount(0));

        fetchSchedule();
    }, [userId, fetchSchedule]);

    const handleCreateOrUpdate = async (intensity: Intensity,skipDays:Day[] = []) => {
        try {
            const id = userId ? userId : "null";
            const newSchedule = await createSchedule(id, intensity,skipDays);
            setSchedule(newSchedule);
            getMeetings(userId!)
                .then(meetings => setMeetingCount(meetings.filter(m => m.status !== "completed" && m.status !== "cancelled" && m.status !== "scheduled").length))
                .catch(() => setMeetingCount(0));
        } catch (error) {
            console.error(error);
        }
    };

    const handleScheduleUpdate = (updated: Schedule) => {
        setSchedule(updated);
    };

    return (
        <>
            <Navbar />
            <div className="page-container">
                <ScheduleMaker
                    onSave={handleCreateOrUpdate}
                    hasAvailability={hasAvailability}
                    meetingCount={meetingCount}
                />
                {schedule && userId && (
                    <ScheduleView
                        userId={userId}
                        schedule={schedule}
                        onScheduleUpdate={handleScheduleUpdate}
                    />
                )}
            </div>
        </>
    );
}
