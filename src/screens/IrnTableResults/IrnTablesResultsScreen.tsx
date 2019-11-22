import { isNil } from "ramda"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppScreenProps, leftBackButton } from "../../components/common/AppScreen"
import { AppScreen } from "../../components/common/AppScreen"
import { i18n } from "../../localization/i18n"
import { useFetchIrnTableMatch } from "../../state/fetchHooks"
import { buildIrnPlacesProxy } from "../../state/irnPlacesSlice"
import { clearRefineFilter, IrnTableResult, setError, setSelectedIrnTableResult } from "../../state/irnTablesSlice"
import { buildReferenceDataProxy } from "../../state/referenceDataSlice"
import { RootState } from "../../state/rootReducer"
import { useErrorCheck } from "../../utils/hooks"
import { enhancedNavigation } from "../screens"
import { IrnTablesResultsView } from "./IrnTablesResultsView"

export const IrnTablesResultsScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = enhancedNavigation(props.navigation)

  const dispatch = useDispatch()

  const { irnTableMatchResult, refineFilter, loading, error } = useFetchIrnTableMatch()

  const { irnPlacesProxy, referenceDataProxy } = useSelector((state: RootState) => ({
    irnPlacesProxy: buildIrnPlacesProxy(state.irnPlacesData),
    referenceDataProxy: buildReferenceDataProxy(state.referenceData),
  }))

  const onClearRefineFilter = () => {
    dispatch(clearRefineFilter())
  }

  const clearErrorAndGoBack = () => {
    dispatch(setError(undefined))
    navigation.goBack()
  }

  const onSchedule = (selectedIrnTableResult?: IrnTableResult) => {
    if (selectedIrnTableResult) {
      dispatch(setSelectedIrnTableResult(selectedIrnTableResult))
      navigation.goTo("ScheduleIrnTableScreen")
    }
  }

  useErrorCheck(error, clearErrorAndGoBack)

  const irnTablesResultsViewProps = {
    refineFilter,
    irnTableMatchResult,
    irnPlacesProxy,
    referenceDataProxy,
    onClearRefineFilter,
    onSearchLocation: () => navigation.goTo("SelectAnotherLocationScreen"),
    onSearchDate: () => navigation.goTo("SelectAnotherDateScreen"),
    onSearchTimeSlot: () => navigation.goTo("SelectAnotherTimeSlotScreen"),
    onSchedule,
    onNewSearch: () => navigation.goBack(),
  }

  return (
    <AppScreen
      {...props}
      title={i18n.t("Results.Title")}
      loading={loading}
      {...leftBackButton(props.navigation.goBack)}
    >
      {isNil(error) ? <IrnTablesResultsView {...irnTablesResultsViewProps} /> : null}
    </AppScreen>
  )
}
