import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalScreen, AppScreenProps } from "../../components/common/AppScreen"
import { TimeSlot } from "../../irnTables/models"
import { i18n } from "../../localization/i18n"
import { setRefineFilter } from "../../state/irnTablesSlice"
import { RootState } from "../../state/rootReducer"
import { enhancedNavigation } from "../screens"
import { SelectAnotherTimeSlotView } from "./SelectAnotherTimeSlotView"

export const SelectAnotherTimeSlotScreen: React.FC<AppScreenProps> = props => {
  const navigation = enhancedNavigation(props.navigation)

  const dispatch = useDispatch()

  const irnTableMatchResult = useSelector((state: RootState) => state.irnTablesData.irnTableMatchResult)

  const selectAnotherTimeSlotViewProps = {
    timeSlots: irnTableMatchResult.otherTimeSlots,
    onTimeSlotSelected: (timeSlot: TimeSlot) => {
      dispatch(setRefineFilter({ timeSlot }))
      navigation.goBack()
    },
  }
  return (
    <AppModalScreen title={i18n.t("Title.SelectAnotherTimeSlot")} {...props}>
      <SelectAnotherTimeSlotView {...selectAnotherTimeSlotViewProps} />
    </AppModalScreen>
  )
}
