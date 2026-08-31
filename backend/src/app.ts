import express from "express"
import cors from "cors"
import userRoutes from "./routes/userRoutes"
import meetingRoutes from "./routes/meetingRoutes"
import availabilityRoutes from "./routes/availabilityRoutes"
import scheduleRoutes from "./routes/scheduleRoutes"

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/users", userRoutes)
app.use("/api/meetings", meetingRoutes)
app.use("/api/availabilities", availabilityRoutes)
app.use("/api/schedules", scheduleRoutes)
app.get("/",(req,res) =>{
    res.json("Intensity Knob API");
})
export default app;