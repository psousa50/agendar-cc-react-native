import React, { useEffect } from "react"
import { appBackgroundImage } from "../../assets/images/images"
import { useGlobalState } from "../../GlobalStateProvider"
import { DatePeriod, IrnTableFilter, TimePeriod } from "../../state/models"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { HomeView } from "../views/HomeView"
import { AppScreenName, navigate } from "./screens"

export const HomeScreen: React.FunctionComponent<AppScreenProps> = props => {
  const [globalState, globalDispatch] = useGlobalState()
  const navigation = navigate(props.navigation)

  const irnFilter = globalState.irnTablesData.filter

  const updateGlobalFilter = (filter: Partial<IrnTableFilter>) => {
    globalDispatch({
      type: "IRN_TABLES_UPDATE_FILTER",
      payload: { filter },
    })
  }

  const clearRefineFilter = () => {
    globalDispatch({
      type: "IRN_TABLES_SET_REFINE_FILTER",
      payload: { filter: {} },
    })
  }

  useEffect(() => {
    updateGlobalFilter({
      region: "Continente",
      serviceId: 1,
      endDate: new Date("2019-10-04"),
      startDate: new Date("2019-10-12"),
      startTime: "11:35",
      endTime: "15:40",
    })
  }, [])

  const onSearch = () => {
    clearRefineFilter()
    navigation.goTo("IrnTablesResultsScreen")
  }

  const onSelectFilter = (filterScreen: AppScreenName) => {
    clearRefineFilter()
    navigation.goTo(filterScreen)
  }

  const onServiceIdChanged = (serviceId: number) => {
    updateGlobalFilter({ ...irnFilter, serviceId })
  }

  const onDatePeriodChanged = (datePeriod: DatePeriod) => {
    updateGlobalFilter({ ...irnFilter, ...datePeriod })
  }

  const onTimePeriodChanged = (timePeriod: TimePeriod) => {
    updateGlobalFilter({ ...timePeriod })
  }

  const onEditDatePeriod = () => {
    navigation.goTo("SelectPeriodScreen")
  }

  return (
    <AppScreen {...props} backgroundImage={appBackgroundImage}>
      <HomeView
        irnFilter={globalState.irnTablesData.filter}
        onDatePeriodChanged={onDatePeriodChanged}
        onEditDatePeriod={onEditDatePeriod}
        onSearch={onSearch}
        onSelectFilter={onSelectFilter}
        onServiceIdChanged={onServiceIdChanged}
        onTimePeriodChanged={onTimePeriodChanged}
      />
    </AppScreen>
  )
}
