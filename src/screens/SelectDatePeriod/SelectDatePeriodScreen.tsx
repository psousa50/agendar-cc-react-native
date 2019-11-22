import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalScreen, AppScreenProps } from "../../components/common/AppScreen"
import { ButtonIcons } from "../../components/common/ToolbarIcons"
import { normalizeFilter } from "../../irnTables/main"
import { updateFilter } from "../../state/irnTablesSlice"
import { DatePeriod } from "../../state/models"
import { RootState } from "../../state/rootReducer"
import { enhancedNavigation } from "../screens"
import { SelectDatePeriodView } from "./SelectDatePeriodView"

export const SelectDatePeriodScreen: React.FC<AppScreenProps> = props => {
  const navigation = enhancedNavigation(props.navigation)

  const dispatch = useDispatch()

  const { filter } = useSelector((state: RootState) => ({
    filter: state.irnTablesData.filter,
  }))

  const [datePeriod, setDatePeriod] = useState<DatePeriod>(filter)

  const onConfirm = () => {
    dispatch(updateFilter(datePeriod))
    navigation.goBack()
  }

  const onDateChange = (newDatePeriod: DatePeriod) => {
    setDatePeriod(normalizeFilter(newDatePeriod))
  }

  return (
    <AppModalScreen {...props} right={() => ButtonIcons.Checkmark(onConfirm)}>
      <SelectDatePeriodView datePeriod={datePeriod} onDatePeriodChange={onDateChange} />
    </AppModalScreen>
  )
}
