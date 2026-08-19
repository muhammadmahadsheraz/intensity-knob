import type {Meeting} from  "../types/meeting"
import "./Components.css";
interface MeetingListProps{
    meetings:Meeting[]
}
export default function MeetingList({meetings}:MeetingListProps){

   return(
    <div className="component-card meeting-list">
    <h2 className="component-title">Meetings</h2>

    {meetings.map(meeting => (
        <div className="meeting-card" key={meeting._id}>
                    <h3>{meeting.title}</h3>

                    <p>
                        Description: {meeting.description}
                    </p>

                    <p>
                        Participants: {meeting.participants.join(", ")}
                    </p>

                    <p>
                        Duration: {meeting.duration} minutes
                    </p>

                    <p>
                        Deadline:{" "}
                        {new Date(meeting.deadline).toLocaleString()}
                    </p>

                    <p>
                        Status: {meeting.status}
                    </p>
                </div>
            ))}
        </div>
   ) 
}