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
    dispatch(getReferenceData())
    dispatch(getIrnPlaces())
  }, [dispatch])

  const homeViewProps: HomeViewProps = {
    filter,
    onDatePeriodChange: (datePeriod: DatePeriod) => dispatch(updateFilter(datePeriod)),
    onEditLocation: () => navigation.goTo("SelectLocationScreen"),
    onLocationChange: (location: IrnTableFilterLocation) => dispatch(updateFilter(location)),
    onSearch: () => {
      clearRefineFilter()
      navigation.goTo("IrnTablesResultsScreen")
    },
    onSelectFilter: (filterScreen: AppScreenName) => {
      clearRefineFilter()
      navigation.goTo(filterScreen)
    },
    onServiceIdChange: (serviceId: number) => dispatch(updateFilter({ serviceId })),
    onTimePeriodChange: (timePeriod: TimePeriod) => dispatch(updateFilter(timePeriod)),
    onSaturdaysChange: (onlyOnSaturdays: boolean) => dispatch(updateFilter({ onlyOnSaturdays })),
    referenceDataProxy,
  }

  return (
    <AppScreen {...props} loading={loading} backgroundImage={appBackgroundImage}>
      <HomeView {...homeViewProps} />
    </AppScreen>
  )
}
