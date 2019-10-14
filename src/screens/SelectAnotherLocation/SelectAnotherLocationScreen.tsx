import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalScreen, AppScreenProps } from "../../components/common/AppScreen"
import { ButtonIcons } from "../../components/common/ToolbarIcons"
import { buildIrnPlacesProxy } from "../../state/irnPlacesSlice"
import { setRefineFilter } from "../../state/irnTablesSlice"
import { IrnTableRefineFilterLocation } from "../../state/models"
import { buildReferenceDataProxy } from "../../state/referenceDataSlice"
import { RootState } from "../../state/rootReducer"
import { enhancedNavigation } from "../screens"
import { SelectAnotherLocationView } from "./SelectAnotherLocationView"

export const SelectAnotherLocationScreen: React.FunctionComponent<AppScreenProps> = props => {
  const navigation = enhancedNavigation(props.navigation)
  const initialLocation: IrnTableRefineFilterLocation = {}
  const [location, setLocation] = useState(initialLocation)

  const dispatch = useDispatch()

  const { irnTables, irnPlacesProxy, referenceDataProxy } = useSelector((state: RootState) => ({
    irnTables: state.irnTablesData.irnTables,
    irnPlacesProxy: buildIrnPlacesProxy(state.irnPlacesData),
    referenceDataProxy: buildReferenceDataProxy(state.referenceData),
  }))

  const onLocationChange = (newLocation: Partial<IrnTableRefineFilterLocation>, isLast: boolean) => {
    if (isLast) {
      dispatch(setRefineFilter)(location)
      navigation.goBack()
    } else {
      setLocation(newLocation)
    }
  }

  const updateRefineFilterAndGoBack = () => {
    dispatch(setRefineFilter)(location)
    navigation.goBack()
  }

  const selectAnotherLocationViewProps = {
    irnTables,
    location,
    irnPlacesProxy,
    referenceDataProxy,
    onLocationChange,
  }

  return (
    <AppModalScreen {...props} right={() => ButtonIcons.Checkmark(() => updateRefineFilterAndGoBack())}>
      <SelectAnotherLocationView {...selectAnotherLocationViewProps} />
    </AppModalScreen>
  )
}
