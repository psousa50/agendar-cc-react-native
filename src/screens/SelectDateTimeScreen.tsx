import DateTimePicker from "@react-native-community/datetimepicker"
import { Button, Icon, Text, View } from "native-base"
import React, { useState } from "react"
import { StyleSheet, Switch } from "react-native"
import { Calendar, CalendarTheme, DateObject } from "react-native-calendars"
import Collapsible from "react-native-collapsible"
import Modal from "react-native-modal"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { ButtonIcons } from "../common/ToolbarIcons"
import { SelectedDateTimeView } from "../components/SelectedDateTimeView"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTableFilterState } from "../state/models"
import { globalStateSelectors } from "../state/selectors"
import { addDays, createDateRange, dateOnly, datesEqual } from "../utils/dates"
import { dateFromTime } from "../utils/dates"
import { extractTime, formatDateLocale, formatTimeSlot } from "../utils/formaters"
import { formatDateYYYYMMDD } from "../utils/formaters"
import { navigate } from "./screens"

interface SelectDateTimeScreenState {
  useDatePeriod: boolean
  showDatePeriod: boolean
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
    showDatePeriod: false,
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
        filter: { ...stateSelectors.getIrnTablesFilterForEdit },
        ...(state.useTimeSlot ? {} : { startTime: undefined, endTime: undefined }),
        ...(state.useDatePeriod ? {} : { startDate: undefined, endDate: undefined }),
      },
    })
    navigation.goBack()
  }

  const onDayPress = (dateObject: DateObject) => {
    const date = dateOnly(new Date(dateObject.dateString))
    const { startDate, endDate } = irnFilter
    if (!startDate || endDate) {
      updateGlobalFilterForEdit({ startDate: date, endDate: undefined })
    } else {
      updateGlobalFilterForEdit(datesEqual(date, startDate) ? { startDate: undefined } : { endDate: date })
    }
  }

  const onUseDatePeriod = () =>
    mergeState({ useDatePeriod: !state.useDatePeriod, showDatePeriod: !state.useDatePeriod })

  const openDatePeriod = () => mergeState({ showDatePeriod: true })
  const closeDatePeriod = () => mergeState({ showDatePeriod: false })

  const onUseTimeSlot = () => mergeState({ useTimeSlot: !state.useTimeSlot })

  const onStartTimeChange = (_: any, date?: Date) => {
    const startTime = date && extractTime(date)
    if (startTime) {
      mergeState({ showStartTime: false })
      updateGlobalFilterForEdit({ startTime })
    }
  }

  const onEndTimeChange = (_: any, date?: Date) => {
    const endTime = date && extractTime(date)
    if (endTime) {
      mergeState({ showEndTime: false })
      updateGlobalFilterForEdit({ endTime })
    }
  }

  const renderContent = () => {
    const { startDate, endDate } = irnFilter

    const hasBothDates = !!startDate && !!endDate
    const dateRange = startDate && endDate ? createDateRange(addDays(startDate, 1), addDays(endDate, -1)) : []
    const markedDates = {
      ...(startDate
        ? { [formatDateYYYYMMDD(startDate)]: { selected: true, color: "green", startingDay: hasBothDates } }
        : {}),
      ...dateRange.reduce(
        (acc, date) => ({
          ...acc,
          [formatDateYYYYMMDD(date)]: { selected: true, color: "green" },
        }),
        {},
      ),
      ...(endDate
        ? { [formatDateYYYYMMDD(endDate)]: { selected: true, color: "green", endingDay: hasBothDates } }
        : {}),
    }

    const dates =
      startDate && endDate
        ? `No período entre ${formatDateLocale(startDate)} e ${formatDateLocale(endDate)}`
        : startDate
        ? `A partir do dia ${formatDateLocale(startDate)}`
        : "O mais depressa possível"

    return (
      <View style={styles.container}>
        <SelectedDateTimeView irnFilter={irnFilter} />
        <View style={styles.switch}>
          <Text>{state.useDatePeriod ? "Neste período:" : "O mais depressa possível"}</Text>
          <Switch value={state.useDatePeriod} onValueChange={onUseDatePeriod} />
        </View>
        <Collapsible collapsed={!state.useDatePeriod}>
          <View style={styles.timeSlot}>
            <Text onPress={openDatePeriod}>{dates}</Text>
          </View>
        </Collapsible>
        <Modal isVisible={state.showDatePeriod}>
          <View style={styles.modalClose}>
            <Icon type="Ionicons" name="close-circle" onPress={closeDatePeriod} />
          </View>
          <Calendar markedDates={markedDates} markingType="period" onDayPress={onDayPress} theme={calendarTheme} />
        </Modal>
        <View style={styles.switch}>
          <Text>{state.useTimeSlot ? "Neste horário:" : "Em qualquer horário"}</Text>
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
                display="clock"
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
                display="clock"
                onChange={onEndTimeChange}
              />
            ) : null}
          </View>
        </Collapsible>
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

const calendarTheme: CalendarTheme = {
  "stylesheet.day.period": {
    base: {
      overflow: "hidden",
      height: 34,
      alignItems: "center",
      width: 38,
    },
  },
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
})
