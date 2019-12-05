import React, { useState } from "react"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { TimeSlot } from "../../../irnTables/models"
import { i18n } from "../../../localization/i18n"
import { TimePeriod } from "../../../state/models"
import { dateFromTime, extractTime } from "../../../utils/dates"
import { formatTimeSlot } from "../../../utils/formaters"
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

  const hideStartTimePicker = () => {
    mergeState({ showStartTimePickerModal: false })
  }

  const hideEndTimePicker = () => {
    mergeState({ showEndTimePickerModal: false })
  }

  const confirmStartTime = (date: Date) => {
    mergeState({ showStartTimePickerModal: false })
    onTimePeriodChange({ startTime: extractTime(date) })
  }

  const confirmEndTime = (date: Date) => {
    mergeState({ showEndTimePickerModal: false })
    onTimePeriodChange({ endTime: extractTime(date) })
  }

  const oldVersionProps = {
    headerTextIOS: "",
  }

  const pickerStartTime = dateFromTime(startTime, "08:00")
  const renderStartTimePicker = () => (
    <DateTimePickerModal
      isVisible={state.showStartTimePickerModal}
      date={pickerStartTime}
      mode={"time"}
      onCancel={hideStartTimePicker}
      onConfirm={confirmStartTime}
      is24Hour={true}
      minuteInterval={5}
      confirmTextIOS={i18n.t("TimePeriod.Confirm")}
      cancelTextIOS={i18n.t("TimePeriod.Cancel")}
      {...oldVersionProps}
    />
  )

  const renderEndTimePicker = () => (
    <DateTimePickerModal
      isVisible={state.showEndTimePickerModal}
      date={dateFromTime(endTime, startTime || "20:00")}
      minimumDate={pickerStartTime}
      mode={"time"}
      onCancel={hideEndTimePicker}
      onConfirm={confirmEndTime}
      is24Hour={true}
      minuteInterval={5}
      confirmTextIOS={i18n.t("TimePeriod.Confirm")}
      cancelTextIOS={i18n.t("TimePeriod.Cancel")}
      {...oldVersionProps}
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
        placeholder={i18n.t("TimePeriod.FromPlaceHolder")}
      />
      <PeriodRow
        active={!!endTime}
        title={i18n.t("TimePeriod.To")}
        value={formatTimeSlot(endTime, "")}
        onEdit={showEndTimePicker}
        onClear={clearEndTime}
        placeholder={i18n.t("TimePeriod.ToPlaceHolder")}
      />
      {state.showStartTimePickerModal && renderStartTimePicker()}
      {state.showEndTimePickerModal && renderEndTimePicker()}
    </>
  )
}
