import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalScreen, AppScreenProps } from "../../components/common/AppScreen"
import { setRefineFilter } from "../../state/irnTablesSlice"
import { RootState } from "../../state/rootReducer"
import { enhancedNavigation } from "../screens"
import { SelectAnotherDateView } from "./SelectAnotherDateView"

export const SelectAnotherDateScreen: React.FC<AppScreenProps> = props => {
  const navigation = enhancedNavigation(props.navigation)

  const dispatch = useDispatch()

  const irnTables = useSelector((state: RootState) => state.irnTablesData.irnTables)

  const onDateSelected = (date: Date) => {
    dispatch(setRefineFilter({ date }))
    navigation.goBack()
  }

  const selectAnotherDateViewProps = {
    irnTables,
    onDateSelected,
  }
  return (
    <AppModalScreen {...props}>
      <SelectAnotherDateView {...selectAnotherDateViewProps} />
    </AppModalScreen>
  )
}
