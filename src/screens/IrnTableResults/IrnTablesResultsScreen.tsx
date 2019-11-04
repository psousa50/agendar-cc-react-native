import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { appBackgroundImage } from "../../assets/images/images"
import { AppScreen } from "../../components/common/AppScreen"
import { AppScreenProps } from "../../components/common/AppScreen"
import { buildIrnPlacesProxy } from "../../state/irnPlacesSlice"
import { clearRefineFilter, getIrnTableMatch } from "../../state/irnTablesSlice"
import { buildReferenceDataProxy } from "../../state/referenceDataSlice"
import { RootState } from "../../state/rootReducer"
import { enhancedNavigation } from "../screens"
import { IrnTablesResultsView } from "./IrnTablesResultsView"

export const IrnTablesResultsScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = enhancedNavigation(props.navigation)

  const dispatch = useDispatch()

  const { irnTableMatchResult, filter, refineFilter, loading, irnPlacesProxy, referenceDataProxy } = useSelector(
    (state: RootState) => ({
      irnTableMatchResult: state.irnTablesData.irnTableMatchResult,
      filter: state.irnTablesData.filter,
      refineFilter: state.irnTablesData.refineFilter,
      loading: state.irnTablesData.loading || state.referenceData.loading || state.irnPlacesData.loading,
      irnPlacesProxy: buildIrnPlacesProxy(state.irnPlacesData),
      referenceDataProxy: buildReferenceDataProxy(state.referenceData),
    }),
  )
  const irnTablesDataState = useSelector((state: RootState) => state.irnTablesData)

  const onClearRefineFilter = () => {
    dispatch(clearRefineFilter())
  }

  useEffect(() => {
    dispatch(getIrnTableMatch(irnTablesDataState))
  }, [filter, refineFilter])

  const irnTablesResultsViewProps = {
    refineFilter,
    irnTableMatchResult,
    irnPlacesProxy,
    referenceDataProxy,
    onClearRefineFilter,
    onSearchLocation: () => navigation.goTo("SelectAnotherLocationScreen"),
    onSearchDate: () => navigation.goTo("SelectAnotherDateScreen"),
    onSearchTimeSlot: () => navigation.goTo("SelectAnotherTimeSlotScreen"),
    onSchedule: () => navigation.goTo("ScheduleIrnTableScreen"),

    onNewSearch: () => navigation.goBack(),
  }

  return (
    <AppScreen {...props} loading={loading} backgroundImage={appBackgroundImage}>
      <IrnTablesResultsView {...irnTablesResultsViewProps} />
    </AppScreen>
  )
}
