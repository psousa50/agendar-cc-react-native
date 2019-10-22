import DateTimePicker from "@react-native-community/datetimepicker"
import React, { useState } from "react"
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

  const onStartDateChange = (_: any, date?: Date) => {
    mergeState({ showStartDatePickerModal: false })
    if (date) {
      onDatePeriodChange({ startDate: toDateString(date) })
    }
  }

  const onEndDateChange = (_: any, date?: Date) => {
    mergeState({ showEndDatePickerModal: false })
    if (date) {
      onDatePeriodChange({ endDate: toDateString(date) })
    }
  }

  const renderStartDatePicker = () => (
    <DateTimePicker
      value={toUtcMaybeDate(startDate) || new Date()}
      mode={"date"}
      display="default"
      onChange={onStartDateChange}
    />
  )

  const renderEndDatePicker = () => (
    <DateTimePicker
      value={toUtcMaybeDate(startDate) || toUtcMaybeDate(endDate) || new Date()}
      mode={"date"}
      display="default"
      onChange={onEndDateChange}
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
