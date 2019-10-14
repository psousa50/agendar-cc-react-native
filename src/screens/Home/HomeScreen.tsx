import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { appBackgroundImage } from "../../assets/images/images"
import { AppScreen, AppScreenProps } from "../../components/common/AppScreen"
import { getIrnPlaces } from "../../state/irnPlacesSlice"
import { setRefineFilter, updateFilter } from "../../state/irnTablesSlice"
import { DatePeriod, IrnTableFilterLocation, TimePeriod } from "../../state/models"
import { buildReferenceDataProxy, getReferenceData } from "../../state/referenceDataSlice"
import { RootState } from "../../state/rootReducer"
import { AppScreenName, enhancedNavigation } from "../screens"
import { HomeView, HomeViewProps } from "./HomeView"

interface HomeScreenProps extends AppScreenProps {
  loading: boolean
}

export const HomeScreen: React.FunctionComponent<HomeScreenProps> = props => {
  const navigation = enhancedNavigation(props.navigation)

  const dispatch = useDispatch()

  const { filter, loading, referenceDataProxy } = useSelector((state: RootState) => ({
    filter: state.irnTablesData.filter,
    loading: state.irnTablesData.loading || state.referenceData.loading || state.irnPlacesData.loading,
    referenceDataProxy: buildReferenceDataProxy(state.referenceData),
  }))

  const clearRefineFilter = () => {
    setRefineFilter({})
  }

  useEffect(() => {
    const fetch = async () => {
      await getReferenceData(dispatch)
      await getIrnPlaces(dispatch)
    }
    fetch()
    dispatch(
      updateFilter({
        region: "Continente",
        serviceId: 1,
        // districtId: 12,
        // countyId: 5,
        // placeName:
        // tslint:disable-next-line: max-line-length
        //   "Centro Comercial Arrábida Shoping - R. Manuel Moreira de Barros e Praceta Henrique Moreira 244, Afurada, loja A nº 029",
        // startDate: new Date("2019-11-03"),
        // endDate: new Date("2019-11-23"),
        // startTime: "12:45",
        // endTime: "15:50",
      }),
    )
  }, [])

  const onSearch = () => {
    clearRefineFilter()
    navigation.goTo("IrnTablesResultsScreen")
  }

  const onSelectFilter = (filterScreen: AppScreenName) => {
    clearRefineFilter()
    navigation.goTo(filterScreen)
  }

  const onServiceIdChange = (serviceId: number) => {
    dispatch(updateFilter({ serviceId }))
  }

  const onDatePeriodChange = (datePeriod: DatePeriod) => {
    dispatch(updateFilter(datePeriod))
  }

  const onTimePeriodChange = (timePeriod: TimePeriod) => {
    dispatch(updateFilter(timePeriod))
  }

  const onEditLocation = () => {
    navigation.goTo("SelectLocationScreen")
  }

  const onLocationChange = (location: IrnTableFilterLocation) => {
    dispatch(updateFilter({ ...location }))
  }

  const homeViewProps: HomeViewProps = {
    filter,
    onDatePeriodChange,
    onEditLocation,
    onLocationChange,
    onSearch,
    onSelectFilter,
    onServiceIdChange,
    onTimePeriodChange,
    referenceDataProxy,
  }

  return (
    <AppScreen {...props} loading={loading} backgroundImage={appBackgroundImage}>
      <HomeView {...homeViewProps} />
    </AppScreen>
  )
}
