import { useEffect, useState } from "react";
import MeetingForm from "../components/MeetingForm";
import MeetingList from "../components/MeetingList";
import Navbar from "../components/Navbar";
import { getMeetings, createMeeting } from "../services/api";
import type { Meeting, CreateMeeting } from "../types/meeting";
import { useAuth } from "../context/AuthContext";

export default function Meetings() {
    const { userId } = useAuth();
    const [meetings, setMeetings] = useState<Meeting[]>([]);

    useEffect(() => {
        if (!userId) return;
        getMeetings(userId)
            .then(setMeetings)
            .catch(console.error);
    }, [userId]);

    const handleCreate = async (meeting: CreateMeeting) => {
        try {
            const newMeeting = await createMeeting(meeting);
            setMeetings(prev => [...prev, newMeeting]);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="page-container">
                {userId && <MeetingForm userId={userId} onCreate={handleCreate} />}
                <MeetingList meetings={meetings} />
            </div>
        </>
    );
}
