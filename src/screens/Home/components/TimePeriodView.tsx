import DateTimePicker from "@react-native-community/datetimepicker"
import React, { useState } from "react"
import { TimeSlot } from "../../../irnTables/models"
import { i18n } from "../../../localization/i18n"
import { TimePeriod } from "../../../state/models"
import { dateFromTime } from "../../../utils/dates"
import { extractTime, formatTimeSlot } from "../../../utils/formaters"
import { PeriodRow } from "./PeriodRow"

interface TimePeriodViewProps {
  startTime?: TimeSlot
  endTime?: TimeSlot
  onTimePeriodChange: (timePeriod: TimePeriod) => void
}

interface TimePeriodViewState {
  showStartTimePickerModal: boolean
  showEndTimePickerModal: boolean
}

export const TimePeriodView: React.FC<TimePeriodViewProps> = ({ startTime, endTime, onTimePeriodChange }) => {
  const initialState: TimePeriodViewState = {
    showStartTimePickerModal: false,
    showEndTimePickerModal: false,
  }
  const [state, setState] = useState(initialState)

  const mergeState = (newState: Partial<TimePeriodViewState>) => setState(oldState => ({ ...oldState, ...newState }))

  const clearStartTime = () => onTimePeriodChange({ startTime: undefined })
  const clearEndTime = () => onTimePeriodChange({ endTime: undefined })

  const showStartTimePicker = () => {
    mergeState({ showStartTimePickerModal: true })
  }

  const showEndTimePicker = () => {
    mergeState({ showEndTimePickerModal: true })
  }

  const onStartTimeChange = (_: any, date?: Date) => {
    mergeState({ showStartTimePickerModal: false })
    if (date) {
      const newStartTime = extractTime(date)
      onTimePeriodChange({ startTime: newStartTime })
    }
  }

  const onEndTimeChange = (_: any, date?: Date) => {
    mergeState({ showEndTimePickerModal: false })
    if (date) {
      const newEndTime = extractTime(date)
      onTimePeriodChange({ endTime: newEndTime })
    }
  }

  const renderStartTimePicker = () => (
    <DateTimePicker
      value={dateFromTime(startTime, "08:00")}
      mode={"time"}
      is24Hour={true}
      display="default"
      onChange={onStartTimeChange}
    />
  )

  const renderEndTimePicker = () => (
    <DateTimePicker
      value={dateFromTime(endTime, startTime || "20:00")}
      mode={"time"}
      is24Hour={true}
      display="default"
      onChange={onEndTimeChange}
    />
  )

  return (
    <>
      <PeriodRow
        active={!!startTime}
        title={i18n.t("TimePeriod.From")}
        value={formatTimeSlot(startTime, "")}
        onEdit={showStartTimePicker}
        onClear={clearStartTime}
      />
      <PeriodRow
        active={!!endTime}
        title={i18n.t("TimePeriod.To")}
        value={formatTimeSlot(endTime, "")}
        onEdit={showEndTimePicker}
        onClear={clearEndTime}
      />
      {state.showStartTimePickerModal && renderStartTimePicker()}
      {state.showEndTimePickerModal && renderEndTimePicker()}
    </>
  )
}
