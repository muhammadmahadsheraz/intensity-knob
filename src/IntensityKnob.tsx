
import { useEffect, useRef,useId } from 'react';
import './IntensityKnob.css';
import { PROGRESS_OFFSETS, circumference, rotation,intensityValues} from './constants';
import type { Intensity } from './constants';
//props Interface for the IntensityKnob component
type IntensityKnobProps = {
    
    value : Intensity,

    onChange:(value : Intensity) => void
}

function IntensityKnob ({value, onChange}:IntensityKnobProps){
    const safeValue = intensityValues.find(item => item.key === value) ? value : 'moderate'

    //for unique ids 
    const id = useId();
    const progressGradientId = `progressarc-${id}`; 
    //ref to manipulate the needle
    const needle = useRef<HTMLDivElement>(null);

    //use effect function to manipulate teh needle and knob
    useEffect(()=>{
        if(needle.current){
            needle.current.style.transform = `rotate(${rotation[safeValue]}deg)`;
        }
    },[safeValue])
    //main return function to render the component
    return (
        <div className = "container">
            <h1 className = "knob-title">Intensity Knob</h1>
        <div className = "knob-container">
            {/*Intensity Knob Radio Elements*/}
            <div aria-label="Schedule-intensity">

            <div className = "radio-container radio-steady" >
                <input id = "radio-low" className = "radio-input" type = "radio" name = "intensity" value = "low" checked = {safeValue === "low"} onChange = {()=>onChange("low")}></input>
                <label htmlFor = "radio-low" className = "label-design">Steady</label>
            </div>
            <div className = "radio-container radio-mild">
                <input id = "radio-mild" className = "radio-input" type = "radio" name = "intensity" value = "mild" checked = {safeValue === "mild"} onChange = {()=>onChange("mild")}></input>
                <label htmlFor = "radio-mild" className = "label-design">Mild</label>
            </div>
            <div className = "radio-container radio-moderate">
                <input id = "radio-moderate" className = "radio-input" type = "radio" name = "intensity" value = "moderate" checked = {safeValue === "moderate"} onChange = {()=>onChange("moderate")}></input>
                <label htmlFor = "radio-moderate" className = "label-design">Moderate</label>
            </div>
            <div className = "radio-container radio-intense">
                <input id = "radio-intense" className = "radio-input" type = "radio" name = "intensity" value = "intense" checked = {safeValue === "intense"} onChange = {()=>onChange("intense")}></input>
                <label htmlFor = "radio-intense" className = "label-design">Intense</label>
            </div>
            <div className = "radio-container radio-extreme">
                <input id = "radio-extreme" className = "radio-input" type = "radio" name = "intensity" value = "extreme" checked = {safeValue === "extreme"} onChange = {()=>onChange("extreme")}></input>
                <label htmlFor = "radio-extreme" className = "label-design">Extreme!</label>
            </div>
            </div>
            {/*Intensity Knob tick-marks*/}
            <div className = "tick-marks mark-one"></div>
            <div className = "tick-marks mark-two"></div>
            <div className = "tick-marks mark-three"></div>
            <div className = "tick-marks mark-four"></div>
            <div className = "tick-marks mark-five"></div>
            <div className = "tick-marks mark-six"></div>
            <div className = "tick-marks mark-seven"></div>
            <div className = "tick-marks mark-eight"></div>
            <div className = "tick-marks mark-nine"></div>
            <div className = "tick-marks mark-ten"></div>
            <div className = "tick-marks mark-eleven"></div>
            {/*Intensity Knob Layers*/}
            <div className = "knob-outer">
            <svg width = "156" height = "156" style = {{position:'absolute'}} aria-hidden="true">
                <defs>
                    <linearGradient id = {progressGradientId}>
                        <stop offset="0%" stopColor="#FF5D47"></stop>
                        <stop offset="33%" stopColor="#FEF32A"></stop>
                        <stop offset="66%" stopColor="#50F1B6"></stop>
                    </linearGradient>
                </defs>

            <circle className='progress-bar' stroke ={ `url(#${progressGradientId})`} cx="78" cy="78" r="67" fill="none" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={PROGRESS_OFFSETS[safeValue]}/>
            </svg>
                <div className = "knob-inner">
                    <div className = "knob-center" >
                        <div className = "needle-pointer" ref = {needle}></div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}
export default IntensityKnob;