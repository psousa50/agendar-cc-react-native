import React, { useState } from "react"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { i18n } from "../../../localization/i18n"
import { DatePeriod } from "../../../state/models"
import { DateString, toDateString, toUtcMaybeDate } from "../../../utils/dates"
import { formatDateLocale } from "../../../utils/formaters"
import { PeriodRow } from "./PeriodRow"

interface DatePeriodViewProps {
  startDate?: DateString
  endDate?: DateString
  onDatePeriodChange: (datePeriod: DatePeriod) => void
}

interface DatePeriodViewState {
  showStartDatePickerModal: boolean
  showEndDatePickerModal: boolean
}

export const DatePeriodView: React.FC<DatePeriodViewProps> = ({ startDate, endDate, onDatePeriodChange }) => {
  const initialState: DatePeriodViewState = {
    showStartDatePickerModal: false,
    showEndDatePickerModal: false,
  }
  const [state, setState] = useState(initialState)

  const mergeState = (newState: Partial<DatePeriodViewState>) => setState(oldState => ({ ...oldState, ...newState }))

  const clearStartDate = () => onDatePeriodChange({ startDate: undefined })
  const clearEndDate = () => onDatePeriodChange({ endDate: undefined })

  const showStartDatePicker = () => {
    mergeState({ showStartDatePickerModal: true })
  }

  const showEndDatePicker = () => {
    mergeState({ showEndDatePickerModal: true })
  }

  const hideStartDatePicker = () => {
    mergeState({ showStartDatePickerModal: false })
  }

  const hideEndDatePicker = () => {
    mergeState({ showEndDatePickerModal: false })
  }

  const confirmStartDate = (date: Date) => {
    mergeState({ showStartDatePickerModal: false })
    onDatePeriodChange({ startDate: toDateString(date) })
  }

  const confirmEndDate = (date?: Date) => {
    mergeState({ showEndDatePickerModal: false })
    onDatePeriodChange({ endDate: toDateString(date) })
  }

  const oldVersionProps = {
    headerTextIOS: "",
  }
  const renderStartDatePicker = () => (
    <DateTimePickerModal
      isVisible={state.showStartDatePickerModal}
      date={toUtcMaybeDate(startDate)}
      mode={"date"}
      onCancel={hideStartDatePicker}
      onConfirm={confirmStartDate}
      confirmTextIOS={i18n.t("DatePeriod.Confirm")}
      cancelTextIOS={i18n.t("DatePeriod.Cancel")}
      {...oldVersionProps}
    />
  )

  const renderEndDatePicker = () => (
    <DateTimePickerModal
      isVisible={state.showEndDatePickerModal}
      date={toUtcMaybeDate(startDate) || toUtcMaybeDate(endDate)}
      mode={"date"}
      onCancel={hideEndDatePicker}
      onConfirm={confirmEndDate}
      confirmTextIOS={i18n.t("DatePeriod.Confirm")}
      cancelTextIOS={i18n.t("DatePeriod.Cancel")}
      {...oldVersionProps}
    />
  )

  return (
    <>
      <PeriodRow
        active={!!startDate}
        title={i18n.t("DatePeriod.From")}
        value={formatDateLocale(startDate)}
        onEdit={showStartDatePicker}
        onClear={clearStartDate}
      />
      <PeriodRow
        active={!!endDate}
        title={i18n.t("DatePeriod.To")}
        value={formatDateLocale(endDate)}
        onEdit={showEndDatePicker}
        onClear={clearEndDate}
      />
      {state.showStartDatePickerModal && renderStartDatePicker()}
      {state.showEndDatePickerModal && renderEndDatePicker()}
    </>
  )
}
