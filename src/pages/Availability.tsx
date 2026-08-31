import { useState, useEffect } from "react";
import AvailabilityDisplay from "../components/AvailabilityDisplay";
import AvailabilityForm from "../components/AvailabilityForm";
import Navbar from "../components/Navbar";
import type { Availability, CreateAvailability } from "../types/availability";
import { createAvailability, getAvailability } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Availability() {
    const { userId } = useAuth();
    const [availability, setAvailability] = useState<Availability | null>(null);

    useEffect(() => {
        if (userId) {
            getAvailability(userId)
                .then(setAvailability)
                .catch(console.error);
        }
    }, [userId]);

    const handleCreateOrUpdate = async (data: CreateAvailability) => {
        try {
            const newAvailability = await createAvailability(data);
            setAvailability(newAvailability);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="page-container">
                {userId && <AvailabilityForm userId={userId} onSave={handleCreateOrUpdate} />}
                {availability && <AvailabilityDisplay availability={availability} />}
            </div>
        </>
    );
}
