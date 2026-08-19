# Plan: Validations, Status Sync, Reschedule Logic

## Summary
Add validations to Availability/Schedule, sync meeting status with schedule entries,
add checkbox + confirm/skip detection in ScheduleView, and implement sequence-based
reschedule with cascade shift.

---

## 1. Backend Model Changes

### `backend/src/models/Schedule.ts`
- Add `sequence: number` to `IEntry` interface and `entrySchema`
- Add `"pending"` to the `status` enum in `IEntry`

### `backend/src/models/Meetings.ts`
- Add `"pending"` to the `status` enum

---

## 2. Backend Service Changes

### `backend/src/services/scheduleServices.ts`

**`createScheduleService`:**
- Change the query to also exclude `status: "scheduled"` (currently only excludes completed/cancelled)
- After creating entries, bulk-update all matching meeting documents to `status: "scheduled"`
- Assign `sequence: j` (the cycle day index) to each entry
- Return `null` if no unscheduled meetings exist (nothing to schedule)

**New `completeMeetingService(meetingId, userId)`:**
- Update the meeting document to `status: "completed"`
- Find the user's schedule, find the entry with that meetingId, update entry status to `"completed"`
- Return the updated schedule

**New `skipMeetingService(meetingId, userId)`:**
- Update the meeting document to `status: "skipped"`
- Find the user's schedule, find the entry with that meetingId, update entry status to `"skipped"`
- Return the updated schedule

**New `rescheduleSkippedService(userId)`:**
- Find the user's schedule
- Find all skipped entries, sorted by sequence ascending
- For each skipped entry:
  1. Remove it from the entries array
  2. Find the next sequence group (sequence + 1)
  3. Insert the skipped meeting at the START of that sequence group
  4. Cascade: the first meeting of that sequence takes the removed meeting's old date/start
     - Actually: the inserted meeting inherits the first meeting's date and start time
     - The original first meeting takes the second meeting's start time
     - The original last meeting takes the first meeting's date + start time of the NEXT sequence group
     - Continue cascading through all subsequent sequence groups
  5. The meeting that falls off the end of the cycle: set entry status to `"pending"`, meeting status to `"pending"`
- Save and return the updated schedule

---

## 3. Backend Controller + Route Changes

### `backend/src/controllers/scheduleControllers.ts`
- Add `completeMeeting` controller: reads `req.params.id` (meetingId), calls `completeMeetingService`
- Add `skipMeeting` controller: reads `req.params.id` (meetingId), calls `skipMeetingService`
- Add `rescheduleSkipped` controller: reads userId from `req.params.id`, calls `rescheduleSkippedService`

### `backend/src/routes/scheduleRoutes.ts`
- `PUT /schedules/complete/:id` → `completeMeeting` (id = meetingId)
- `PUT /schedules/skip/:id` → `skipMeeting` (id = meetingId)
- `PUT /schedules/reschedule/:id` → `rescheduleSkipped` (id = userId)

---

## 4. Frontend Type Changes

### `src/types/schedule.ts`
- Add `sequence?: number` to `Entry`
- Add `"pending"` to status union

### `src/types/meeting.ts`
- Add `"pending"` to status union in `Meeting`

---

## 5. Frontend API Changes

### `src/services/api.ts`
- Add `completeMeeting(meetingId: string): Promise<Schedule>` → PUT `/schedules/complete/${meetingId}`
- Add `skipMeeting(meetingId: string): Promise<Schedule>` → PUT `/schedules/skip/${meetingId}`
- Add `rescheduleSkipped(userId: string): Promise<Schedule>` → PUT `/schedules/reschedule/${userId}`

---

## 6. Frontend Component Changes

### `src/components/AvailabilityForm.tsx`
- Compute `isIncomplete`: true if any day has empty start OR empty end
- Disable the Save button when `isIncomplete` is true (add `disabled` prop + grey styling)

### `src/components/ScheduleMaker.tsx`
- Accept new optional props: `hasAvailability: boolean`, `meetingCount: number`
- Disable the Save button if `!hasAvailability || meetingCount === 0`
- Show small hint text when disabled

### `src/pages/Scheduler.tsx`
- Fetch availability existence + meeting count, pass to ScheduleMaker
- After reschedule call, update the schedule state from the response

### `src/components/ScheduleView.tsx` (major rework)
- On load / on a timer, auto-detect skipped entries: any entry with status `"scheduled"` whose `date + start` time has passed → call `skipMeeting` API to mark it skipped
- For each entry with status `"scheduled"` and whose start time has NOT passed:
  - Show a checkbox next to it
  - On check: show a confirm button directly below
  - On confirm: call `completeMeeting` API → update local state
- Show skipped count + "Reschedule" button at the top when skipped entries exist
- On reschedule click: call `rescheduleSkipped` API → update local state
- Show "pending" status badge on pending entries

---

## 7. CSS Changes

### `src/components/Components.css`
- Add `.disabled-button` style (greyed out, no cursor)
- Add `.skip-banner` style (small container for skipped count + reschedule)
- Add `.meeting-complete-btn` / `.meeting-confirm-btn` styles
- Add `.pending-badge` style

---

## File Change Order
1. Backend models (Schedule.ts, Meetings.ts)
2. Backend services (scheduleServices.ts)
3. Backend controllers (scheduleControllers.ts)
4. Backend routes (scheduleRoutes.ts)
5. Frontend types (schedule.ts, meeting.ts)
6. Frontend API (api.ts)
7. AvailabilityForm.tsx (validation)
8. ScheduleMaker.tsx (validation props)
9. Scheduler.tsx (pass data, handle reschedule)
10. ScheduleView.tsx (checkbox, confirm, skip detect, reschedule UI)
11. Components.css (styles)
