import DateTimePicker from "@react-native-community/datetimepicker"
import { Button, Icon, Text, View } from "native-base"
import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { i18n } from "../../localization/i18n"
import { DatePeriod, IrnTableFilter, IrnTableFilterLocation, TimePeriod } from "../../state/models"
import { dateFromTime } from "../../utils/dates"
import { extractTime } from "../../utils/formaters"
import { InfoCard } from "../common/InfoCard"
import { DatePeriodView } from "../DatePeriodView"
import { LocationView } from "../LocationView"
import { AppScreenName } from "../screens/screens"
import { SelectIrnServiceView } from "../SelectIrnServiceView"
import { TimePeriodView } from "../TimePeriodView"

interface HomeViewProps {
  irnFilter: IrnTableFilter
  onDatePeriodChanged: (dateOPeriod: DatePeriod) => void
  onEditDatePeriod: () => void
  onEditLocation: () => void
  onLocationChanged: (location: IrnTableFilterLocation) => void
  onSearch: () => void
  onSelectFilter: (filterScreen: AppScreenName) => void
  onServiceIdChanged: (serviceId: number) => void
  onTimePeriodChanged: (timePeriod: TimePeriod) => void
}

interface HomeViewState {
  showStartTime: boolean
  showEndTime: boolean
}

export const HomeView: React.FC<HomeViewProps> = ({
  irnFilter,
  onDatePeriodChanged,
  onEditDatePeriod,
  onEditLocation,
  onLocationChanged,
  onSearch,
  onServiceIdChanged,
  onTimePeriodChanged,
}) => {
  const { serviceId, startTime, endTime } = irnFilter
  const initialState: HomeViewState = {
    showStartTime: false,
    showEndTime: false,
  }
  const [state, setState] = useState(initialState)

  const mergeState = (newState: Partial<HomeViewState>) => setState(oldState => ({ ...oldState, ...newState }))

  const onClearDatePeriod = () => onDatePeriodChanged({ startDate: undefined, endDate: undefined })
  const onClearTimePeriod = () => onTimePeriodChanged({ startTime: undefined, endTime: undefined })
  const onClearLocation = () =>
    onLocationChanged({ region: "Continente", districtId: undefined, countyId: undefined, placeName: undefined })

  const onStartTimeChange = (_: any, date?: Date) => {
    const newStartTime = date && extractTime(date)
    mergeState({ showStartTime: false, showEndTime: true })
    onTimePeriodChanged({ startTime: newStartTime })
  }

  const onEndTimeChange = (_: any, date?: Date) => {
    const newEndTime = date && extractTime(date)
    mergeState({ showEndTime: false })
    onTimePeriodChanged({ endTime: newEndTime })
  }

  const onEditTimePeriod = () => {
    mergeState({ showStartTime: true })
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
    <View style={styles.container}>
      <InfoCard title={i18n.t("Service.Name")}>
        <SelectIrnServiceView serviceId={serviceId} onServiceIdChanged={onServiceIdChanged} />
      </InfoCard>
      <InfoCard title={i18n.t("Where.Name")} onPress={onEditLocation}>
        <LocationView irnFilter={irnFilter} onClear={onClearLocation} onEdit={onEditLocation} />
      </InfoCard>
      <InfoCard title={i18n.t("When.Name")}>
        <DatePeriodView
          datePeriod={irnFilter}
          onClearDatePeriod={onClearDatePeriod}
          onEditDatePeriod={onEditDatePeriod}
        />
        <View style={{ borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: 3 }}></View>
        <TimePeriodView
          timePeriod={irnFilter}
          onClearTimePeriod={onClearTimePeriod}
          onEditTimePeriod={onEditTimePeriod}
        />
      </InfoCard>
      <Button block success onPress={onSearch}>
        <Icon name="search" />
        <Text>{i18n.t("SearchTimetables")}</Text>
      </Button>
      {state.showStartTime && renderStartTimePicker()}
      {state.showEndTime && renderEndTimePicker()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
})
