import DateTimePicker from "@react-native-community/datetimepicker"
import { Text, View } from "native-base"
import React, { useState } from "react"
import { Switch, TouchableOpacity } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { InfoCard } from "../../components/common/InfoCard"
import { LocationView } from "../../components/common/LocationView"
import { Separator } from "../../components/common/Separator"
import { i18n } from "../../localization/i18n"
import { DatePeriod, IrnTableFilter, IrnTableFilterLocation, TimePeriod } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { appTheme } from "../../utils/appTheme"
import { dateFromTime, toDateString, toUtcMaybeDate } from "../../utils/dates"
import { extractTime, formatDateLocale, formatTimeSlot } from "../../utils/formaters"
import { AppScreenName } from "../screens"
import { MainButton } from "./components/MainButton"
import { PeriodRow } from "./components/PeriodRow"
import { SelectIrnServiceView } from "./components/SelectIrnServiceView"

export interface HomeViewProps {
  filter: IrnTableFilter
  referenceDataProxy: ReferenceDataProxy
  onDatePeriodChange: (dateOPeriod: DatePeriod) => void
  onEditLocation: () => void
  onLocationChange: (location: IrnTableFilterLocation) => void
  onSearch: () => void
  onSelectFilter: (filterScreen: AppScreenName) => void
  onServiceIdChange: (serviceId: number) => void
  onTimePeriodChange: (timePeriod: TimePeriod) => void
  onSaturdaysChange: (value: boolean) => void
}

interface HomeViewState {
  showStartDatePickerModal: boolean
  showEndDatePickerModal: boolean
  showStartTimePickerModal: boolean
  showEndTimePickerModal: boolean
}

export const HomeView: React.FC<HomeViewProps> = ({
  filter,
  onDatePeriodChange,
  onEditLocation,
  onLocationChange,
  onSearch,
  onServiceIdChange,
  onTimePeriodChange,
  onSaturdaysChange,
  referenceDataProxy,
}) => {
  const { serviceId, startDate, endDate, startTime, endTime, onlyOnSaturdays } = filter
  const initialState: HomeViewState = {
    showStartDatePickerModal: false,
    showEndDatePickerModal: false,
    showStartTimePickerModal: false,
    showEndTimePickerModal: false,
  }
  const [state, setState] = useState(initialState)

  const mergeState = (newState: Partial<HomeViewState>) => setState(oldState => ({ ...oldState, ...newState }))

  const onClearLocation = () =>
    onLocationChange({ region: "Continente", districtId: undefined, countyId: undefined, placeName: undefined })

  const clearStartDate = () => onDatePeriodChange({ startDate: undefined })
  const clearEndDate = () => onDatePeriodChange({ endDate: undefined })

  const showStartDatePicker = () => {
    mergeState({ showStartDatePickerModal: true })
  }

  const showEndDatePicker = () => {
    mergeState({ showEndDatePickerModal: true })
  }

  const onStartDateChange = (_: any, date?: Date) => {
    if (date) {
      mergeState({ showStartDatePickerModal: false })
      onDatePeriodChange({ startDate: toDateString(date) })
    }
  }

  const onEndDateChange = (_: any, date?: Date) => {
    if (date) {
      mergeState({ showEndDatePickerModal: false })
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

  const clearStartTime = () => onTimePeriodChange({ startTime: undefined })
  const clearEndTime = () => onTimePeriodChange({ endTime: undefined })

  const showStartTimePicker = () => {
    mergeState({ showStartTimePickerModal: true })
  }

  const showEndTimePicker = () => {
    mergeState({ showEndTimePickerModal: true })
  }

  const onStartTimeChange = (_: any, date?: Date) => {
    const newStartTime = date && extractTime(date)
    mergeState({ showStartTimePickerModal: false })
    onTimePeriodChange({ startTime: newStartTime })
  }

  const onEndTimeChange = (_: any, date?: Date) => {
    const newEndTime = date && extractTime(date)
    mergeState({ showEndTimePickerModal: false })
    onTimePeriodChange({ endTime: newEndTime })
  }

  const renderStartTimePicker = () => (
    <DateTimePicker
      value={dateFromTime(filter.startTime, "08:00")}
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
    <View style={styles.container}>
      <InfoCard title={i18n.t("Service.Name")} iconType={"AntDesign"} iconName="idcard">
        <SelectIrnServiceView serviceId={serviceId} onServiceIdChanged={onServiceIdChange} />
      </InfoCard>
      <InfoCard title={i18n.t("Where.Name")} iconType={"MaterialIcons"} iconName="location-on" onPress={onEditLocation}>
        <LocationView
          location={filter}
          onClear={onClearLocation}
          onEdit={onEditLocation}
          referenceDataProxy={referenceDataProxy}
        />
      </InfoCard>
      <InfoCard title={i18n.t("When.Name")} iconType={"AntDesign"} iconName="calendar">
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
        <Separator />
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
        <Separator />
        <View style={styles.switchContainer}>
          <TouchableOpacity onPress={() => onSaturdaysChange(!onlyOnSaturdays)}>
            <Text style={[styles.onlyOnSaturdays, !onlyOnSaturdays && styles.onlyOnSaturdaysDimmed]}>
              {i18n.t("DatePeriod.OnlyOnSaturdays")}
            </Text>
          </TouchableOpacity>
          <Switch style={styles.switch} value={onlyOnSaturdays} onValueChange={onSaturdaysChange} />
        </View>
      </InfoCard>
      <MainButton onPress={onSearch} text={i18n.t("SearchTimetables")} iconName={"search"} />
      {state.showStartDatePickerModal && renderStartDatePicker()}
      {state.showEndDatePickerModal && renderEndDatePicker()}
      {state.showStartTimePickerModal && renderStartTimePicker()}
      {state.showEndTimePickerModal && renderEndTimePicker()}
    </View>
  )
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    marginTop: "0.5rem",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  switchContainer: {
    flexDirection: "row",
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  onlyOnSaturdays: {
    fontSize: "0.9rem",
    textAlignVertical: "center",
    paddingHorizontal: "0.5rem",
    color: appTheme.secondaryText,
  },
  onlyOnSaturdaysDimmed: {
    color: appTheme.secondaryTextDimmed,
  },
  switch: {
    transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
  },
})
