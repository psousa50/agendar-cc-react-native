import React, { useState } from "react"
import { useGlobalState } from "../../GlobalStateProvider"
import { normalizeFilter } from "../../state/main"
import { DatePeriod, IrnTableFilter } from "../../state/models"
import { globalStateSelectors } from "../../state/selectors"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { ButtonIcons } from "../common/ToolbarIcons"
import { SelectDatePeriodView } from "../views/SelectDatePeriodView"
import { navigate } from "./screens"

export const SelectDatePeriodScreen: React.FC<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)
  const { startDate, endDate } = stateSelectors.getIrnTablesFilter
  const [datePeriod, setDatePeriod] = useState({ startDate, endDate } as DatePeriod)

  const updateGlobalFilter = (filter: Partial<IrnTableFilter>) => {
    globalDispatch({
      type: "IRN_TABLES_UPDATE_FILTER",
      payload: { filter },
    })
  }

  const goBack = () => {
    navigation.goBack()
  }

  const updateGlobalFilterAndGoBack = () => {
    updateGlobalFilter(datePeriod)
    goBack()
  }

  const onDateChange = (newDatePeriod: DatePeriod) => {
    setDatePeriod(normalizeFilter(newDatePeriod))
  }

  return (
    <AppScreen {...props} right={() => ButtonIcons.Checkmark(() => updateGlobalFilterAndGoBack())}>
      <SelectDatePeriodView datePeriod={datePeriod} onDateChange={onDateChange} />
    </AppScreen>
  )
}
