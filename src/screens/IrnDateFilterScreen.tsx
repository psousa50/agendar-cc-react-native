import { View } from "native-base"
import React, { useState } from "react"
import { Calendar, DateObject } from "react-native-calendars"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { ButtonIcons } from "../common/ToolbarIcons"
import { useGlobalState } from "../GlobalStateProvider"
import { normalizeFilter } from "../state/main"
import { IrnTableFilterState } from "../state/models"
import { getIrnTablesFilter } from "../state/selectors"
import { addDays, createDateRange, datesEqual } from "../utils/dates"
import { formatDateYYYYMMDD } from "../utils/formaters"
import { navigate } from "./screens"

export const IrnDateFilterScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const [filter, setFilter] = useState(getIrnTablesFilter(globalState))

  const updateFilter = (newFilter: Partial<IrnTableFilterState>) => {
    setFilter(oldFilter => normalizeFilter({ ...oldFilter, ...newFilter }))
  }

  const updateGlobalFilter = () => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER",
      payload: { filter },
    })
    navigation.goBack()
  }

  const onDayPress = (dateObject: DateObject) => {
    const date = new Date(dateObject.dateString)
    const { startDate, endDate } = filter
    if (!startDate || endDate) {
      updateFilter({ startDate: date, endDate: undefined })
    } else {
      updateFilter(datesEqual(date, startDate) ? { startDate: undefined } : { endDate: date })
    }
  }

  const renderContent = () => {
    const { startDate, endDate } = filter

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
      right={() => ButtonIcons.Checkmark(() => updateGlobalFilter())}
    />
  )
}
