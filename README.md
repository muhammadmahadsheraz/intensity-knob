# Intensity Knob

## Setup
npm install
npm run dev

## State Flow
ScheduleIntensityDemo owns state, passes value and onChange to IntensityKnob which then updates it based on user input and sends it back. The parent then changes it's state which causes both it and it's child to re-render.

## Assumptions
- The css properties for teh field input boxes and their labels were not given    hence assumed based on existing color pallete.
- No tick marks position dictated so calculated as feasible.
- Container width does not support equal gapping between teh radio labels and the knob on both sides hence cause for improvisation.

## Bonus
- Bidirectional flow implemented. In custom mode needle stays at previous intensity unless the input user enters in all four fileds matches teh corresponding field values for one of the prefdefined knob levels.