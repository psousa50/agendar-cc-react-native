import { equals, isNil } from "ramda"
import { TimeSlot } from "../irnTables/models"
import { IrnTableFilter, TimeSlotsFilter } from "../state/models"

export const filtersAreEqual = (filter1: IrnTableFilter, filter2: IrnTableFilter) => equals(filter1, filter2)

export const filterTimeSlots = ({ endTime, startTime, timeSlot }: TimeSlotsFilter) => (ts: TimeSlot) =>
  (isNil(timeSlot) || ts === timeSlot) && (isNil(startTime) || startTime <= ts) && (isNil(endTime) || endTime >= ts)
