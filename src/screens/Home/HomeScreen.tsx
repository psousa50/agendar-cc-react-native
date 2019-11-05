import React, { useEffect } from "react"
import { Image } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { appBackgroundImage, appIcon } from "../../assets/images/images"
import { AppScreen, AppScreenProps } from "../../components/common/AppScreen"
import { i18n } from "../../localization/i18n"
import { getIrnPlaces } from "../../state/irnPlacesSlice"
import { clearRefineFilter, updateFilter } from "../../state/irnTablesSlice"
import { DatePeriod, IrnTableFilterLocation, TimePeriod } from "../../state/models"
import { buildReferenceDataProxy, getReferenceData } from "../../state/referenceDataSlice"
import { RootState } from "../../state/rootReducer"
import { responsiveScale as rs } from "../../utils/responsive"
import { AppScreenName, enhancedNavigation } from "../screens"
import { HomeView, HomeViewProps } from "./HomeView"

interface HomeScreenProps extends AppScreenProps {
  loading: boolean
}

export const HomeScreen: React.FunctionComponent<HomeScreenProps> = props => {
  const navigation = enhancedNavigation(props.navigation)

  const dispatch = useDispatch()

  const { filter, loaded, loading, referenceDataProxy } = useSelector((state: RootState) => ({
    filter: state.irnTablesData.filter,
    loading: state.referenceData.loading || state.irnPlacesData.loading,
    loaded: state.referenceData.loaded || state.irnPlacesData.loaded,
    referenceDataProxy: buildReferenceDataProxy(state.referenceData),
  }))

  const onClearRefineFilter = () => {
    dispatch(clearRefineFilter())
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
      onClearRefineFilter()
      navigation.goTo("IrnTablesResultsScreen")
    },
    onSelectFilter: (filterScreen: AppScreenName) => {
      onClearRefineFilter()
      navigation.goTo(filterScreen)
    },
    onServiceIdChange: (serviceId: number) => dispatch(updateFilter({ serviceId })),
    onTimePeriodChange: (timePeriod: TimePeriod) => dispatch(updateFilter(timePeriod)),
    onSaturdaysChange: (onlyOnSaturdays: boolean) => dispatch(updateFilter({ onlyOnSaturdays })),
    referenceDataProxy,
  }

  return (
    <AppScreen
      {...props}
      title={i18n.t("Search.Title")}
      loading={!loaded && loading}
      backgroundImage={appBackgroundImage}
      left={() => <Image source={appIcon} style={{ width: rs(32), height: rs(32) }} />}
    >
      <HomeView {...homeViewProps} />
    </AppScreen>
  )
}
