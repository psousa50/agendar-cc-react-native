import { Text, View } from "native-base"
import React from "react"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { useIrnDataFetch } from "../dataFetch/useIrnDataFetch"

export const IrnTablesDayScheduleScreen: React.FC<AppScreenProps> = props => {
  // const [globalState] = useGlobalState()
  // const { countyId, districtId } = globalState.irnFilter
  const { irnTablesData } = useIrnDataFetch()

  const renderContent = () => {
    return (
      <View>
        <Text>{irnTablesData.irnTables.length}</Text>
      </View>
    )
  }

  return <AppScreen {...props} content={renderContent} title="Horários" showAds={false} />
}
