import DateTimePicker from "@react-native-community/datetimepicker"
import { Button, Text, View } from "native-base"
import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { i18n } from "../../localization/i18n"
import { DatePeriod, IrnTableFilter, TimePeriod } from "../../state/models"
import { dateFromTime } from "../../utils/dates"
import { extractTime } from "../../utils/formaters"
import { InfoCard } from "../common/InfoCard"
import { DatePeriodView } from "../DatePeriodView"
import { AppScreenName } from "../screens/screens"
import { SelectedLocationView } from "../SelectedLocationView"
import { SelectIrnServiceView } from "../SelectIrnServiceView"
import { TimePeriodView } from "../TimePeriodView"

interface HomeViewProps {
  irnFilter: IrnTableFilter
  onDatePeriodChanged: (dateOPeriod: DatePeriod) => void
  onEditDatePeriod: () => void
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
  onSearch,
  onSelectFilter,
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
    <View>
      <InfoCard title={i18n.t("Service.Name")}>
        <SelectIrnServiceView serviceId={serviceId} onServiceIdChanged={onServiceIdChanged} />
      </InfoCard>
      <InfoCard title={i18n.t("Where.Name")}>
        <SelectedLocationView irnFilter={irnFilter} onSelect={() => onSelectFilter("SelectLocationScreen")} />
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
        <Text>{"Pesquisar Horários"}</Text>
      </Button>
      {state.showStartTime && renderStartTimePicker()}
      {state.showEndTime && renderEndTimePicker()}
    </View>
  )
}
