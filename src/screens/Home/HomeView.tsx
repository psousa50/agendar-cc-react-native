import DateTimePicker from "@react-native-community/datetimepicker"
import moment from "moment"
import "moment/locale/pt"
import { Button, Icon, Text, View } from "native-base"
import React, { useState } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { InfoCard } from "../../components/common/InfoCard"
import { i18n } from "../../localization/i18n"
import { DatePeriod, IrnTableFilter, IrnTableFilterLocation, TimePeriod } from "../../state/models"
import { dateFromTime } from "../../utils/dates"
import { extractTime } from "../../utils/formaters"
import { AppScreenName } from "../screens"
import { DatePeriodView } from "./components/DatePeriodView"
import { LocationView } from "./components/LocationView"
import { SelectIrnServiceView } from "./components/SelectIrnServiceView"
import { TimePeriodView } from "./components/TimePeriodView"

moment.locale("pt")

interface HomeViewProps {
  irnFilter: IrnTableFilter
  onDatePeriodChanged: (dateOPeriod: DatePeriod) => void
  onEditLocation: () => void
  onLocationChanged: (location: IrnTableFilterLocation) => void
  onSearch: () => void
  onSelectFilter: (filterScreen: AppScreenName) => void
  onServiceIdChanged: (serviceId: number) => void
  onTimePeriodChanged: (timePeriod: TimePeriod) => void
}

interface HomeViewState {
  showStartDatePickerModal: boolean
  showEndDatePickerModal: boolean
  showStartTimePickerModal: boolean
  showEndTimePickerModal: boolean
}

export const HomeView: React.FC<HomeViewProps> = ({
  irnFilter,
  onDatePeriodChanged,
  onEditLocation,
  onLocationChanged,
  onSearch,
  onServiceIdChanged,
  onTimePeriodChanged,
}) => {
  const { serviceId, startDate, endDate, startTime, endTime } = irnFilter
  const initialState: HomeViewState = {
    showStartDatePickerModal: false,
    showEndDatePickerModal: false,
    showStartTimePickerModal: false,
    showEndTimePickerModal: false,
  }
  const [state, setState] = useState(initialState)

  console.log("state=====>", state)
  console.log("SD=====>", startDate)
  console.log("ED=====>", endDate)

  const mergeState = (newState: Partial<HomeViewState>) => setState(oldState => ({ ...oldState, ...newState }))

  const onClearLocation = () =>
    onLocationChanged({ region: "Continente", districtId: undefined, countyId: undefined, placeName: undefined })
  const onClearDatePeriod = () => onDatePeriodChanged({ startDate: undefined, endDate: undefined })
  const onClearTimePeriod = () => onTimePeriodChanged({ startTime: undefined, endTime: undefined })

  const onEditDatePeriod = () => {
    mergeState({ showStartDatePickerModal: true })
  }

  const onEditTimePeriod = () => {
    mergeState({ showStartTimePickerModal: true })
  }

  const onStartDateChange = (_: any, date?: Date) => {
    mergeState({ showStartDatePickerModal: false, showEndDatePickerModal: true })
    onDatePeriodChanged({ startDate: date })
  }

  const onEndDateChange = (_: any, date?: Date) => {
    mergeState({ showEndDatePickerModal: false })
    onDatePeriodChanged({ endDate: date })
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
    onTimePeriodChanged({ startTime: newStartTime })
  }

  const onEndTimeChange = (_: any, date?: Date) => {
    const newEndTime = date && extractTime(date)
    mergeState({ showEndTimePickerModal: false })
    onTimePeriodChanged({ endTime: newEndTime })
  }

  const renderStartTimePicker = () => (
    <DateTimePicker
      value={dateFromTime(irnFilter.startTime, "08:00")}
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
        <SelectIrnServiceView serviceId={serviceId} onServiceIdChanged={onServiceIdChanged} />
      </InfoCard>
      <InfoCard title={i18n.t("Where.Name")} iconType={"MaterialIcons"} iconName="location-on" onPress={onEditLocation}>
        <LocationView irnFilter={irnFilter} onClear={onClearLocation} onEdit={onEditLocation} />
      </InfoCard>
      <InfoCard title={i18n.t("When.Name")} iconType={"AntDesign"} iconName="calendar">
        <DatePeriodView datePeriod={irnFilter} onClear={onClearDatePeriod} onEdit={onEditDatePeriod} />
        <View style={{ borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: 3 }}></View>
        <TimePeriodView timePeriod={irnFilter} onClear={onClearTimePeriod} onEdit={onEditTimePeriod} />
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
