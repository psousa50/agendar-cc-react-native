import { View } from "native-base"
import React from "react"
import { Calendar, DateObject } from "react-native-calendars"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { ButtonIcons } from "../common/ToolbarIcons"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTableFilterState } from "../state/models"
import { globalStateSelectors } from "../state/selectors"
import { addDays, createDateRange, dateOnly, datesEqual } from "../utils/dates"
import { formatDateYYYYMMDD } from "../utils/formaters"
import { navigate } from "./screens"

export const SelectDateTimeScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const updateGlobalFilterForEdit = (filter: Partial<IrnTableFilterState>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER_FOR_EDIT",
      payload: { filter: { ...stateSelectors.getIrnTablesFilterForEdit, ...filter } },
    })
  }

  const updateGlobalFilterAndGoBack = () => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER",
      payload: { filter: stateSelectors.getIrnTablesFilterForEdit },
    })
    navigation.goBack()
  }

  const irnFilter = stateSelectors.getIrnTablesFilterForEdit

  const onDayPress = (dateObject: DateObject) => {
    const date = dateOnly(new Date(dateObject.dateString))
    const { startDate, endDate } = irnFilter
    if (!startDate || endDate) {
      updateGlobalFilterForEdit({ startDate: date, endDate: undefined })
    } else {
      updateGlobalFilterForEdit(datesEqual(date, startDate) ? { startDate: undefined } : { endDate: date })
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

    return (
      <View>
        <Calendar
          markedDates={markedDates}
          markingType="period"
          onDayPress={onDayPress}
          theme={{
            "stylesheet.day.period": {
              base: {
                overflow: "hidden",
                height: 34,
                alignItems: "center",
                width: 38,
              },
            },
          }}
        />
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
