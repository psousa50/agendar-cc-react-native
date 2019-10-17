import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalScreen, AppScreenProps } from "../../components/common/AppScreen"
import { i18n } from "../../localization/i18n"
import { setRefineFilter } from "../../state/irnTablesSlice"
import { RootState } from "../../state/rootReducer"
import { DateOnly } from "../../utils/dates"
import { enhancedNavigation } from "../screens"
import { SelectAnotherDateView } from "./SelectAnotherDateView"

export const SelectAnotherDateScreen: React.FC<AppScreenProps> = props => {
  const navigation = enhancedNavigation(props.navigation)

  const dispatch = useDispatch()

  const irnTables = useSelector((state: RootState) => state.irnTablesData.irnTables)

  const selectAnotherDateViewProps = {
    irnTables,
    onDateSelected: (date: DateOnly) => {
      dispatch(setRefineFilter({ date }))
      navigation.goBack()
    },
  }
  return (
    <AppModalScreen title={i18n.t("Title.SelectAnotherDate")} {...props}>
      <SelectAnotherDateView {...selectAnotherDateViewProps} />
    </AppModalScreen>
  )
}
