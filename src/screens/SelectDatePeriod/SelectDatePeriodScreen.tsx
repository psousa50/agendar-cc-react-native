import React, { useState } from "react"
import { AppScreen, AppScreenProps } from "../../components/common/AppScreen"
import { ButtonIcons } from "../../components/common/ToolbarIcons"
import { useGlobalState } from "../../GlobalStateProvider"
import { normalizeFilter } from "../../state/main"
import { DatePeriod, IrnTableFilter } from "../../state/models"
import { globalStateSelectors } from "../../state/selectors"
import { navigate } from "../screens"
import { SelectDatePeriodView } from "./SelectDatePeriodView"

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
