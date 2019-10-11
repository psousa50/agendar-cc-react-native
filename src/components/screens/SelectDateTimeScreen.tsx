import DateTimePicker from "@react-native-community/datetimepicker"
import { Text, View } from "native-base"
import React, { useState } from "react"
import { StyleSheet, Switch } from "react-native"
import Collapsible from "react-native-collapsible"
import { useGlobalState } from "../../GlobalStateProvider"
import { IrnTableFilter } from "../../state/models"
import { globalStateSelectors } from "../../state/selectors"
import { dateFromTime } from "../../utils/dates"
import { extractTime, formatDate, formatTimeSlot } from "../../utils/formaters"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { ButtonIcons } from "../common/ToolbarIcons"
import { SelectedDateTimeView } from "../SelectedDateTimeView"
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

  const updateGlobalFilterForEdit = (filter: Partial<IrnTableFilter>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER_FOR_EDIT",
      payload: { filter: { ...stateSelectors.getIrnTablesFilterForEdit, ...filter } },
    })
  }

  const updateGlobalFilterAndGoBack = () => {
    globalDispatch({
      type: "IRN_TABLES_UPDATE_FILTER",
      payload: {
        filter: {
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
          <Text>{"Neste período:"}</Text>
          <Switch value={state.useDatePeriod} onValueChange={onUseDatePeriod} />
        </View>
        <Collapsible collapsed={!state.useDatePeriod}>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>{"De"}</Text>
            <Text style={styles.inputText} onPress={() => mergeState({ showStartDate: true })}>
              {formatDate(irnFilter.startDate)}
            </Text>
            <Text style={styles.text}>{"a"}</Text>
            <Text style={styles.inputText} onPress={() => mergeState({ showEndDate: true })}>
              {formatDate(irnFilter.endDate)}
            </Text>
            {state.showStartDate ? (
              <DateTimePicker
                value={irnFilter.startDate || new Date()}
                mode={"date"}
                display="default"
                onChange={onStartDateChange}
              />
            ) : null}
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
          <Text>{"Neste horário:"}</Text>
          <Switch value={state.useTimeSlot} onValueChange={onUseTimeSlot} />
        </View>
        <Collapsible collapsed={!state.useTimeSlot}>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>{"Das"}</Text>
            <Text style={styles.inputText} onPress={() => mergeState({ showStartTime: true })}>
              {formatTimeSlot(irnFilter.startTime)}
            </Text>
            <Text style={styles.text}>{"às"}</Text>
            <Text style={styles.inputText} onPress={() => mergeState({ showEndTime: true })}>
              {formatTimeSlot(irnFilter.endTime)}
            </Text>
            {state.showStartTime ? (
              <DateTimePicker
                value={dateFromTime(irnFilter.startTime, "08:00")}
                mode={"time"}
                is24Hour={true}
                display="default"
                onChange={onStartTimeChange}
              />
            ) : null}
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
            value={irnFilter.onlyOnSaturdays}
            onValueChange={onlyOnSaturdays => updateGlobalFilterForEdit({ onlyOnSaturdays })}
          />
        </View>
      </View>
    )
  }
  return (
    <AppScreen {...props} right={() => ButtonIcons.Checkmark(() => updateGlobalFilterAndGoBack())}>
      {renderContent()}
    </AppScreen>
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
  inputContainer: {
    flexDirection: "row",
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  inputText: {
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "#EEEEEE",
    padding: 5,
    fontSize: 10,
  },
  text: {
    paddingHorizontal: 15,
    fontSize: 10,
  },
})