import {useState} from "react"
import React from "react"
import "./Components.css";
import type {CreateMeeting,MeetingFormData} from "../types/meeting"

interface MeetingFormProps {
    userId:string,
    onCreate :(meeting:CreateMeeting) => void;
}
export default function MeetingFrom ({userId,onCreate}:MeetingFormProps){
    const [form,setForm] = useState<MeetingFormData>({
        title:"",
        description:"",
        participants:"",
        duration:"",
        deadline:"",
        
        }
    )
    const handleChange = (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        const {name,value} = e.target;
        setForm(prev =>({
            ...prev,
            [name]:value

               }
            )
        )
    }
    const submitForm = (e :React.FormEvent) =>{
        e.preventDefault()
        const Meeting : CreateMeeting = {
            userId :userId,
            title :form.title,
            description :form.description,
            participants :form.participants.split(",")
            .map(p=>p.trim())
            .filter(Boolean),
            duration : Number(form.duration),
            deadline : new Date(form.deadline),
        } 
        onCreate(Meeting);
    }
    return (
        <form className="component-card meeting-form" onSubmit={submitForm}>
            <h2 className="component-title">Create Meeting</h2>

            <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Meeting Title"
                required
            />

            <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Meeting Description"
                required
            />

            <input
                name="participants"
                value={form.participants}
                onChange={handleChange}
                placeholder="Participant names separated by ,"
                required
            />

            <input
                name="duration"
                type="number"
                value={form.duration}
                onChange={handleChange}
                placeholder="Meeting Duration"
                required
            />

            <input
                name="deadline"
                type="datetime-local"
                value={form.deadline}
                onChange={handleChange}
                required
            />

            <button className="component-button" type="submit">
                Create Meeting
            </button>
        </form>

    );

}