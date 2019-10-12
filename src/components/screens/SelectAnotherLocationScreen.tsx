import React, { useState } from "react"
import { useGlobalState } from "../../GlobalStateProvider"
import { IrnTableRefineFilterLocation } from "../../state/models"
import { globalStateSelectors } from "../../state/selectors"
import { AppModalScreen, AppScreenProps } from "../common/AppScreen"
import { ButtonIcons } from "../common/ToolbarIcons"
import { SelectAnotherLocationView } from "../views/SelectAnotherLocationView"
import { navigate } from "./screens"

export const SelectAnotherLocationScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)
  const initialLocation: IrnTableRefineFilterLocation = {}
  const [location, setLocation] = useState(initialLocation)

  const updateRefineFilter = (newFilter: Partial<IrnTableRefineFilterLocation>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_REFINE_FILTER",
      payload: { filter: newFilter },
    })
  }

  const updateLocation = (newLocation: Partial<IrnTableRefineFilterLocation>) => {
    setLocation({ ...location, ...newLocation })
  }
  const updateRefineFilterAndGoBack = () => {
    updateRefineFilter(location)
    navigation.goBack()
  }

  const selectAnotherLocationViewProps = {
    irnTables: stateSelectors.getIrnTables,
    location,
    referenceData: stateSelectors,
    onLocationChange: updateLocation,
    onLocationSelected: updateRefineFilterAndGoBack,
  }

  return (
    <AppModalScreen {...props} right={() => ButtonIcons.Checkmark(() => updateRefineFilterAndGoBack())}>
      <SelectAnotherLocationView {...selectAnotherLocationViewProps} />
    </AppModalScreen>
  )
}
