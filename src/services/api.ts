import type { Meeting, CreateMeeting } from "../types/meeting";
import type {CreateAvailability,Availability} from "../types/availability";
import type { Schedule } from "../types/schedule";
import type { Intensity } from "../components/constants";
import type {User,CreateUser,LoginUser} from "../types/user"
const API_URL = "http://localhost:5000/api";

export async function createMeeting(meeting: CreateMeeting): Promise<Meeting> {
    const response = await fetch(
        `${API_URL}/meetings`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(meeting)
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create Meeting");
    }

    return response.json();
}

export async function getMeetings(userId: string): Promise<Meeting[]> {
    const response = await fetch(
        `${API_URL}/meetings/${userId}`
    );

    if (!response.ok) {
        throw new Error("Failed to get Meetings");
    }

    return response.json();
}

export async function getMeeting(userId: string): Promise<Meeting[]> {
    const response = await fetch(
        `${API_URL}/meetings/${userId}`
    );

    if (!response.ok) {
        throw new Error("Failed to get Meeting");
    }

    return response.json();
}

export async function updateMeeting(meetingId: string, data: Partial<Meeting>): Promise<Meeting> {
    const response = await fetch(
        `${API_URL}/meetings/${meetingId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update Meeting");
    }

    return response.json();
}

export async function createAvailability(availability: CreateAvailability): Promise<Availability> {
    const response = await fetch(
        `${API_URL}/availabilities`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(availability)
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create Availability");
    }

    return response.json();
}

export async function getAvailabilities(): Promise<Availability[]> {
    const response = await fetch(
        `${API_URL}/availabilities`
    );

    if (!response.ok) {
        throw new Error("Failed to get Availabilities");
    }

    return response.json();
}

export async function getAvailability(userId: string): Promise<Availability> {
    const response = await fetch(
        `${API_URL}/availabilities/${userId}`
    );

    if (!response.ok) {
        throw new Error("Failed to get Availability");
    }

    return response.json();
}

export async function createSchedule(userId: string,intensity: Intensity): Promise<Schedule> {
    const response = await fetch(
        `${API_URL}/schedules`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId,
                intensity
            })
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create Schedule");
    }

    return response.json();
}

export async function getSchedules(): Promise<Schedule[]> {
    const response = await fetch(
        `${API_URL}/schedules`
    );

    if (!response.ok) {
        throw new Error("Failed to get Schedules");
    }

    return response.json();
}

export async function getSchedule(userId: string): Promise<Schedule> {
    const response = await fetch(
        `${API_URL}/schedules/${userId}`
    );

    if (!response.ok) {
        throw new Error("Failed to get Schedule");
    }

    return response.json();
}

export async function completeMeetingApi(meetingId: string, userId: string): Promise<Schedule> {
    const response = await fetch(
        `${API_URL}/schedules/complete/${meetingId}?userId=${userId}`,
        {
            method: "PUT"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to complete meeting");
    }

    return response.json();
}

export async function skipMeetingApi(meetingId: string, userId: string): Promise<Schedule> {
    const response = await fetch(
        `${API_URL}/schedules/skip/${meetingId}?userId=${userId}`,
        {
            method: "PUT"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to skip meeting");
    }

    return response.json();
}

export async function rescheduleSkippedApi(userId: string): Promise<Schedule> {
    const response = await fetch(
        `${API_URL}/schedules/reschedule/${userId}`,
        {
            method: "PUT"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to reschedule");
    }

    return response.json();
}

export async function createUser(user: CreateUser): Promise<User> {

    const response = await fetch(
        `${API_URL}/users/signup`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to create user"
        );
    }

    return response.json();
}

export async function loginUser(user: LoginUser): Promise<User> {

    const response = await fetch(
        `${API_URL}/users/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)
        }
    );

    if (!response.ok) {
        throw new Error(
            "Invalid email or password"
        );
    }

    return response.json();
}
