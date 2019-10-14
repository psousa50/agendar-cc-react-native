import DateTimePicker from "@react-native-community/datetimepicker"
import { Button, Icon, Text, View } from "native-base"
import React, { useState } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { InfoCard } from "../../components/common/InfoCard"
import { i18n } from "../../localization/i18n"
import { DatePeriod, IrnTableFilter, IrnTableFilterLocation, TimePeriod } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { dateFromTime } from "../../utils/dates"
import { extractTime } from "../../utils/formaters"
import { AppScreenName } from "../screens"
import { DatePeriodView } from "./components/DatePeriodView"
import { LocationView } from "./components/LocationView"
import { SelectIrnServiceView } from "./components/SelectIrnServiceView"
import { TimePeriodView } from "./components/TimePeriodView"

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
  referenceDataProxy,
}) => {
  const { serviceId, startDate, endDate, startTime, endTime } = filter
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
  const onClearDatePeriod = () => onDatePeriodChange({ startDate: undefined, endDate: undefined })
  const onClearTimePeriod = () => onTimePeriodChange({ startTime: undefined, endTime: undefined })

  const onEditDatePeriod = () => {
    mergeState({ showStartDatePickerModal: true })
  }

  const onEditTimePeriod = () => {
    mergeState({ showStartTimePickerModal: true })
  }

  const onStartDateChange = (_: any, date?: Date) => {
    mergeState({ showStartDatePickerModal: false, showEndDatePickerModal: true })
    onDatePeriodChange({ startDate: date })
  }

  const onEndDateChange = (_: any, date?: Date) => {
    mergeState({ showEndDatePickerModal: false })
    onDatePeriodChange({ endDate: date })
  }

  const renderStartDatePicker = () => (
    <DateTimePicker value={startDate || new Date()} mode={"date"} display="default" onChange={onStartDateChange} />
  )

  const renderEndDatePicker = () => (
    <DateTimePicker
      value={startDate || endDate || new Date()}
      mode={"date"}
      display="default"
      onChange={onEndDateChange}
    />
  )

  const onStartTimeChange = (_: any, date?: Date) => {
    const newStartTime = date && extractTime(date)
    mergeState({ showStartTimePickerModal: false, showEndTimePickerModal: true })
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
    <ScrollView style={styles.container}>
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
        <DatePeriodView datePeriod={filter} onClear={onClearDatePeriod} onEdit={onEditDatePeriod} />
        <View style={{ borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: 3 }}></View>
        <TimePeriodView timePeriod={filter} onClear={onClearTimePeriod} onEdit={onEditTimePeriod} />
      </InfoCard>
      <Button style={styles.button} block success onPress={onSearch}>
        <Icon name="search" />
        <Text>{i18n.t("SearchTimetables")}</Text>
      </Button>
      {state.showStartDatePickerModal && renderStartDatePicker()}
      {state.showEndDatePickerModal && renderEndDatePicker()}
      {state.showStartTimePickerModal && renderStartTimePicker()}
      {state.showEndTimePickerModal && renderEndTimePicker()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginTop: 20,
  },
})
