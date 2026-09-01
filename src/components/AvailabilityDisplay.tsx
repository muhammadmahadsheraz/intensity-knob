import type { Day,Availability } from "../types/availability"; 
import "./Components.css";
interface AvailabilityDisplayProps{
    availability:Availability
}
const days :Day[] =[
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
]
export default function AvailabilityDisplay({availability}:AvailabilityDisplayProps){
    return(
        <div className="component-card availability-display">
            <h2 className="component-title">Your Availability</h2>

            {days.map(day => (
                <div className="availability-row" key={day}>
                    <strong>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                    </strong>

                    <span>
                        {availability[day][0].start}
                        {" - "}
                        {availability[day][0].end}
                    </span>
                </div>
            ))}
        </div>
    )

}