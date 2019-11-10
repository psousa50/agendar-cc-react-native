import React, { useEffect } from "react"
import { Image } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { appIcon } from "../../assets/images/images"
import { AppScreen, AppScreenProps } from "../../components/common/AppScreen"
import { i18n } from "../../localization/i18n"
import { getIrnPlaces, setError as irnPlacesSetError } from "../../state/irnPlacesSlice"
import { clearRefineFilter, updateFilter } from "../../state/irnTablesSlice"
import { DatePeriod, IrnTableFilterLocation, TimePeriod } from "../../state/models"
import {
  buildReferenceDataProxy,
  getReferenceData,
  setError as referenceDataSetError,
} from "../../state/referenceDataSlice"
import { RootState } from "../../state/rootReducer"
import { setDisclaimerShown } from "../../state/userSlice"
import { useErrorCheck } from "../../utils/hooks"
import { responsiveScale as rs } from "../../utils/responsive"
import { AppScreenName, enhancedNavigation } from "../screens"
import { DisclaimerView } from "./DisclaimerView"
import { HomeView, HomeViewProps } from "./HomeView"

interface HomeScreenProps extends AppScreenProps {
  loading: boolean
}

export const HomeScreen: React.FunctionComponent<HomeScreenProps> = props => {
  const navigation = enhancedNavigation(props.navigation)

  const dispatch = useDispatch()

  const { filter, referenceDataProxy, error, disclaimerShown } = useSelector((state: RootState) => ({
    filter: state.irnTablesData.filter,
    referenceDataProxy: buildReferenceDataProxy(state.referenceData),
    error: state.referenceData.error || state.irnPlacesData.error,
    disclaimerShown: state.userData.disclaimerShown,
  }))

  const onClearRefineFilter = () => {
    dispatch(clearRefineFilter())
  }

  useEffect(() => {
    dispatch(getReferenceData())
    dispatch(getIrnPlaces())
  }, [dispatch])

  const clearErrors = () => {
    dispatch(referenceDataSetError(undefined))
    dispatch(irnPlacesSetError(undefined))
  }

  const onDisclaimerDismiss = () => {
    dispatch(setDisclaimerShown())
  }

  useErrorCheck(error, clearErrors)

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
      title={i18n.t("Home.Title")}
      left={() => <Image source={appIcon} style={{ width: rs(32), height: rs(32) }} />}
    >
      {disclaimerShown ? <HomeView {...homeViewProps} /> : <DisclaimerView onDismiss={onDisclaimerDismiss} />}
    </AppScreen>
  )
}
