import React, { useState } from "react"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { ButtonIcons } from "../common/ToolbarIcons"
import { SelectDatePeriodView } from "../components/SelectDatePeriodView"
import { useGlobalState } from "../GlobalStateProvider"
import { normalizeFilter } from "../state/main"
import { DatePeriod, IrnTableFilter } from "../state/models"
import { globalStateSelectors } from "../state/selectors"
import { navigate } from "./screens"

export const SelectPeriodScreen: React.FC<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)
  const { startDate, endDate } = stateSelectors.getIrnTablesFilter
  const [datePeriod, setDatePeriod] = useState({ startDate, endDate } as DatePeriod)

  const updateGlobalFilter = (filter: Partial<IrnTableFilter>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER",
      payload: { filter: { ...stateSelectors.getIrnTablesFilter, ...filter } },
    })
  }

  const goBack = () => {
    navigation.goBack()
  }

  const updateGlobalFilterAndGoBack = () => {
    updateGlobalFilter(datePeriod)
    goBack()
  }

  const onDateChange = (dp: DatePeriod) => {
    setDatePeriod(normalizeFilter(dp))
  }

  const renderContent = () => {
    return <SelectDatePeriodView datePeriod={datePeriod} onDateChange={onDateChange} />
  }
  return (
    <AppScreen {...props} right={() => ButtonIcons.Checkmark(() => updateGlobalFilterAndGoBack())}>
      {renderContent()}
    </AppScreen>
  )
}
