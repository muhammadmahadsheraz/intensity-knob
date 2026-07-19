import './IntensityKnob.css';
import IntensityKnob from './IntensityKnob';
import { useEffect, useState } from 'react';
import type { Intensity } from './constants';
import { intensityValues } from './constants';

function ScheduleIntensityDemo(){
    //state to keep track of knob value
    const [value,setValue] = useState<Intensity>("moderate");
    // state to keep track of input values
    const [meetingsPerDay,setMeetingsPerDay] = useState("");
    const [meetingDuration,setMeetingDuration] = useState("");
    const [breakTime,setBreakTime] = useState("");
    const [cycleLength,setCycleLength] = useState("");
    //use effect fnction to update the input fields on knob value change
    useEffect(()=>{
        setMeetingsPerDay(intensityValues.find(item =>item.key === value)?.value.meetingsPerDay.toString() || "")
        setMeetingDuration(intensityValues.find(item =>item.key === value)?.value.meetingDuration.toString() || "")
        setBreakTime(intensityValues.find(item =>item.key === value)?.value.break.toString() || "")
        setCycleLength(intensityValues.find(item =>item.key === value)?.value.cycleLength.toString() || "")
    },[value])
    //use effect function update knob value when input fields change 
    useEffect(()=>{
        if(meetingsPerDay && meetingDuration && breakTime && cycleLength){
           intensityValues.forEach(item=>{
            if(meetingsPerDay === item.value.meetingsPerDay.toString() &&
               meetingDuration === item.value.meetingDuration.toString() &&
               breakTime === item.value.break.toString() &&
               cycleLength === item.value.cycleLength.toString())
               {
                setValue(item.key as Intensity);
               }
            })
        }
    }, [meetingsPerDay, meetingDuration, breakTime, cycleLength]);
        //main return function to render the component
    return (
        <div className = "container">
            {/* knob component */}
            <IntensityKnob value = {value} onChange = {setValue}/>
            {/*input field container*/}
            <div className = "input-feild-container">
                <div className = "input-feild-row">
                    <label className = "input-feild-label">Meetings per Day</label>
                    <input onChange={(e) => setMeetingsPerDay(e.target.value)} className = "input-feild" value = {meetingsPerDay}></input>
                </div>
                <div className = "input-feild-row">
                    <label className = "input-feild-label">Meeting Duration</label>
                    <input onChange={(e) => setMeetingDuration(e.target.value)} className = "input-feild" value = {meetingDuration}></input>
                </div>
                <div className = "input-feild-row">
                    <label className = "input-feild-label">Break</label>
                    <input onChange={(e) => setBreakTime(e.target.value)} className = "input-feild" value =  {breakTime}></input>
                </div>
                <div className = "input-feild-row">
                    <label className = "input-feild-label">Cycle Length</label>
                    <input onChange={(e) => setCycleLength(e.target.value)} className = "input-feild" value = {cycleLength} ></input>
                </div>
            </div>

        </div>
    );
}
export default ScheduleIntensityDemo;