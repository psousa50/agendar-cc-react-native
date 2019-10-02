import DateTimePicker from "@react-native-community/datetimepicker"
import { Button, Text, View } from "native-base"
import React, { useState } from "react"
import { StyleSheet, Switch } from "react-native"
import Collapsible from "react-native-collapsible"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { ButtonIcons } from "../common/ToolbarIcons"
import { SelectedDateTimeView } from "../components/SelectedDateTimeView"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTableFilterState } from "../state/models"
import { globalStateSelectors } from "../state/selectors"
import { dateFromTime } from "../utils/dates"
import { extractTime, formatDate, formatTimeSlot } from "../utils/formaters"
import { navigate } from "./screens"

interface SelectDateTimeScreenState {
  useDatePeriod: boolean
  showStartDate: boolean
  showEndDate: boolean
  showStartTime: boolean
  showEndTime: boolean
  useTimeSlot: boolean
}
export const SelectDateTimeScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const irnFilter = stateSelectors.getIrnTablesFilterForEdit

  const initialState: SelectDateTimeScreenState = {
    useDatePeriod: !!irnFilter.startDate || !!irnFilter.endDate,
    showStartDate: false,
    showEndDate: false,
    showStartTime: false,
    showEndTime: false,
    useTimeSlot: !!irnFilter.startTime || !!irnFilter.endTime,
  }
  const [state, setState] = useState(initialState)

  const mergeState = (newState: Partial<SelectDateTimeScreenState>) =>
    setState(oldState => ({ ...oldState, ...newState }))

  const updateGlobalFilterForEdit = (filter: Partial<IrnTableFilterState>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER_FOR_EDIT",
      payload: { filter: { ...stateSelectors.getIrnTablesFilterForEdit, ...filter } },
    })
  }

  const updateGlobalFilterAndGoBack = () => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER",
      payload: {
        filter: {
          ...stateSelectors.getIrnTablesFilterForEdit,
          ...(state.useTimeSlot ? {} : { startTime: undefined, endTime: undefined }),
          ...(state.useDatePeriod ? {} : { startDate: undefined, endDate: undefined }),
        },
      },
    })
    navigation.goBack()
  }

  const onUseDatePeriod = () => mergeState({ useDatePeriod: !state.useDatePeriod })

  const onUseTimeSlot = () => mergeState({ useTimeSlot: !state.useTimeSlot })

  const onStartDateChange = (_: any, date?: Date) => {
    mergeState({ showStartDate: false })
    updateGlobalFilterForEdit({ startDate: date })
  }

  const onEndDateChange = (_: any, date?: Date) => {
    mergeState({ showEndDate: false })
    updateGlobalFilterForEdit({ endDate: date })
  }

  const onStartTimeChange = (_: any, date?: Date) => {
    const startTime = date && extractTime(date)
    mergeState({ showStartTime: false })
    updateGlobalFilterForEdit({ startTime })
  }

  const onEndTimeChange = (_: any, date?: Date) => {
    const endTime = date && extractTime(date)
    mergeState({ showEndTime: false })
    updateGlobalFilterForEdit({ endTime })
  }

  const renderContent = () => {
    return (
      <View style={styles.container}>
        <SelectedDateTimeView irnFilter={irnFilter} />
        <View style={styles.switch}>
          <Text>{"Num determinado período:"}</Text>
          <Switch value={state.useDatePeriod} onValueChange={onUseDatePeriod} />
        </View>
        <Collapsible collapsed={!state.useDatePeriod}>
          <View style={styles.datePeriod}>
            <Button rounded onPress={() => mergeState({ showStartDate: true })}>
              <Text>{formatDate(irnFilter.startDate)}</Text>
            </Button>
            {state.showStartDate ? (
              <DateTimePicker
                value={irnFilter.startDate || new Date()}
                mode={"date"}
                display="default"
                onChange={onStartDateChange}
              />
            ) : null}
            <Button rounded onPress={() => mergeState({ showEndDate: true })}>
              <Text>{formatDate(irnFilter.endDate)}</Text>
            </Button>
            {state.showEndDate ? (
              <DateTimePicker
                value={irnFilter.endDate || new Date()}
                mode={"date"}
                display="default"
                onChange={onEndDateChange}
              />
            ) : null}
          </View>
        </Collapsible>
        <View style={styles.switch}>
          <Text>{"Num determinado horário:"}</Text>
          <Switch value={state.useTimeSlot} onValueChange={onUseTimeSlot} />
        </View>
        <Collapsible collapsed={!state.useTimeSlot}>
          <View style={styles.timeSlot}>
            <Button rounded onPress={() => mergeState({ showStartTime: true })}>
              <Text>{formatTimeSlot(irnFilter.startTime)}</Text>
            </Button>
            {state.showStartTime ? (
              <DateTimePicker
                value={dateFromTime(irnFilter.startTime, "08:00")}
                mode={"time"}
                is24Hour={true}
                display="default"
                onChange={onStartTimeChange}
              />
            ) : null}
            <Button rounded onPress={() => mergeState({ showEndTime: true })}>
              <Text>{formatTimeSlot(irnFilter.endTime)}</Text>
            </Button>
            {state.showEndTime ? (
              <DateTimePicker
                value={dateFromTime(irnFilter.endTime, "21:00")}
                mode={"time"}
                is24Hour={true}
                display="default"
                onChange={onEndTimeChange}
              />
            ) : null}
          </View>
        </Collapsible>
        <View style={styles.switch}>
          <Text>{"Só aos Sábados"}</Text>
          <Switch
            value={irnFilter.onlySaturdays}
            onValueChange={onlySaturdays => updateGlobalFilterForEdit({ onlySaturdays })}
          />
        </View>
      </View>
    )
  }
  return (
    <AppScreen
      {...props}
      content={renderContent}
      title="Quando"
      showAds={false}
      right={() => ButtonIcons.Checkmark(() => updateGlobalFilterAndGoBack())}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalClose: {
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "white",
    padding: 5,
  },
  switch: {
    flexDirection: "row",
    paddingLeft: 14,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  datePeriod: {
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeSlot: {
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 50,
    alignItems: "center",
    justifyContent: "space-between",
  },
  useTimeSlotText: {
    paddingLeft: 20,
    fontSize: 14,
  },
})
