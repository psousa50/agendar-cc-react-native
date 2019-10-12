import React from "react"
import { appBackgroundImage } from "../../assets/images/images"
import { AppScreen } from "../../components/common/AppScreen"
import { AppScreenProps } from "../../components/common/AppScreen"
import { useIrnDataFetch } from "../../dataFetch/useIrnDataFetch"
import { useGlobalState } from "../../GlobalStateProvider"
import { refineFilterIrnTable } from "../../irnTables/main"
import { globalStateSelectors } from "../../state/selectors"
import { navigate } from "../screens"
import { IrnTablesResultsView } from "./IrnTablesResultsView"

export const IrnTablesResultsScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState] = useGlobalState()
  const { irnTablesData } = useIrnDataFetch()

  const stateSelectors = globalStateSelectors(globalState)

  const filter = stateSelectors.getIrnTablesFilter
  const refineFilter = stateSelectors.getIrnTablesRefineFilter
  const irnTablesFiltered = irnTablesData.irnTables.filter(refineFilterIrnTable(refineFilter))

  const irnTablesResultsViewProps = {
    filter,
    refineFilter,
    irnTables: irnTablesFiltered,
    referenceData: stateSelectors,
    onSearchLocation: () => navigation.goTo("SelectAnotherLocationScreen"),
    onSearchDate: () => navigation.goTo("SelectAnotherDateScreen"),
    onSchedule: () => undefined,
    onNewSearch: () => navigation.goBack(),
  }

  const loading = stateSelectors.getStaticData.loading || irnTablesData.loading
  return (
    <AppScreen {...props} loading={loading} backgroundImage={appBackgroundImage}>
      <IrnTablesResultsView {...irnTablesResultsViewProps} />
    </AppScreen>
  )
}
