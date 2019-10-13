import React, { useEffect } from "react"
import { appBackgroundImage } from "../../assets/images/images"
import { AppScreen, AppScreenProps } from "../../components/common/AppScreen"
import { useGlobalState } from "../../GlobalStateProvider"
import { DatePeriod, IrnTableFilter, IrnTableFilterLocation, TimePeriod } from "../../state/models"
import { globalStateSelectors } from "../../state/selectors"
import { AppScreenName, navigate } from "../screens"
import { HomeView } from "./HomeView"

export const HomeScreen: React.FunctionComponent<AppScreenProps> = props => {
  const [globalState, globalDispatch] = useGlobalState()
  const navigation = navigate(props.navigation)
  const stateSelectors = globalStateSelectors(globalState)

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
      districtId: 12,
      countyId: 5,
      placeName:
        "Centro Comercial Arrábida Shoping - R. Manuel Moreira de Barros e Praceta Henrique Moreira 244, Afurada, loja A nº 029",
      startDate: new Date("2019-11-03"),
      endDate: new Date("2019-11-23"),
      startTime: "12:45",
      endTime: "15:50",
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
    updateGlobalFilter({ serviceId })
  }

  const onDatePeriodChanged = (datePeriod: DatePeriod) => {
    updateGlobalFilter(datePeriod)
  }

  const onTimePeriodChanged = (timePeriod: TimePeriod) => {
    updateGlobalFilter(timePeriod)
  }

  const onEditDatePeriod = () => {
    navigation.goTo("SelectDatePeriodScreen")
  }

  const onEditLocation = () => {
    navigation.goTo("SelectLocationScreen")
  }

  const onLocationChanged = (location: IrnTableFilterLocation) => {
    updateGlobalFilter({ ...location })
  }

  const homeViewProps = {
    irnFilter: stateSelectors.getIrnTablesFilter,
    onDatePeriodChanged,
    onEditDatePeriod,
    onEditLocation,
    onLocationChanged,
    onSearch,
    onSelectFilter,
    onServiceIdChanged,
    onTimePeriodChanged,
  }

  return (
    <AppScreen {...props} loading={stateSelectors.getStaticData.loading} backgroundImage={appBackgroundImage}>
      <HomeView {...homeViewProps} />
    </AppScreen>
  )
}
