import { Text, View } from "native-base"
import React from "react"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { useGlobalState } from "../GlobalStateProvider"
import { getIrnTablesFilter } from "../state/selectors"

export const IrnTablesDayScheduleScreen: React.FC<AppScreenProps> = props => {
  const [globalState] = useGlobalState()

  const renderContent = () => {
    return (
      <View>
        <Text>{getIrnTablesFilter(globalState).selectedDate!.toDateString()}</Text>
      </View>
    )
  }

  return <AppScreen {...props} content={renderContent} title="Horários" showAds={false} />
}
