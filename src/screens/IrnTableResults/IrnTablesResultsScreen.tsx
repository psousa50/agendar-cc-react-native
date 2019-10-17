import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { appBackgroundImage } from "../../assets/images/images"
import { AppScreen } from "../../components/common/AppScreen"
import { AppScreenProps } from "../../components/common/AppScreen"
import { IrnTableResult } from "../../irnTables/models"
import { buildIrnPlacesProxy } from "../../state/irnPlacesSlice"
import { getIrnTables, setIrnTableResult } from "../../state/irnTablesSlice"
import { buildReferenceDataProxy } from "../../state/referenceDataSlice"
import { RootState } from "../../state/rootReducer"
import { enhancedNavigation } from "../screens"
import { IrnTablesResultsView } from "./IrnTablesResultsView"

export const IrnTablesResultsScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = enhancedNavigation(props.navigation)

  const dispatch = useDispatch()

  const { irnTables, filter, refineFilter, loading, irnPlacesProxy, referenceDataProxy } = useSelector(
    (state: RootState) => ({
      irnTables: state.irnTablesData.irnTables,
      filter: state.irnTablesData.filter,
      refineFilter: state.irnTablesData.refineFilter,
      loading: state.irnTablesData.loading || state.referenceData.loading || state.irnPlacesData.loading,
      irnPlacesProxy: buildIrnPlacesProxy(state.irnPlacesData),
      referenceDataProxy: buildReferenceDataProxy(state.referenceData),
    }),
  )
  const irnTablesDataState = useSelector((state: RootState) => state.irnTablesData)

  useEffect(() => {
    dispatch(getIrnTables(irnTablesDataState))
  }, [filter])

  const irnTablesResultsViewProps = {
    filter,
    refineFilter,
    irnTables,
    irnPlacesProxy,
    referenceDataProxy,
    onSearchLocation: () => navigation.goTo("SelectAnotherLocationScreen"),
    onSearchDate: () => navigation.goTo("SelectAnotherDateScreen"),
    onSchedule: (irnTableResult: IrnTableResult) => {
      dispatch(setIrnTableResult(irnTableResult))
      navigation.goTo("ScheduleIrnTableScreen")
    },
    onNewSearch: () => navigation.goBack(),
  }

  return (
    <AppScreen {...props} loading={loading} backgroundImage={appBackgroundImage}>
      <IrnTablesResultsView {...irnTablesResultsViewProps} />
    </AppScreen>
  )
}
