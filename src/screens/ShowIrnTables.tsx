import { SectionList, SectionListData, SectionListRenderItem, StyleSheet } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"

import { Text, View } from "native-base"
import sort from "ramda/es/sort"
import React from "react"
import { mergeIrnTables, sortTimes } from "../irnTables/main"
import { IrnTableSchedule } from "../irnTables/models"
import { useGlobalState } from "../state/main"
import { getCounty, getDistrict, getIrnTables } from "../state/selectors"

export const ShowIrnTablesScreen: React.FunctionComponent<AppScreenProps> = props => (
  <AppScreen {...props} content={() => <ShowIrnTablesContent {...props} />} title="Agendar CC" showAds={false} />
)

const ShowIrnTablesContent: React.FunctionComponent<AppScreenProps> = () => {
  const [globalState] = useGlobalState()

  const renderIrnTableSection: SectionListRenderItem<IrnTableSchedule> = ({ item }) => (
    <View>
      <Text>{item.date.toString()}</Text>
      {sort(sortTimes, item.times).map(time => (
        <Text key={time}>{time}</Text>
      ))}
    </View>
  )
  const renderSectionHeader = (info: { section: SectionListData<IrnTableSchedule> }) => (
    <View>
      <Text>HELLO 12345</Text>
      <Text>{getDistrict(globalState)(info.section.header.county.districtId)!.name}</Text>
      <Text>{getCounty(globalState)(info.section.header.county.countyId)!.name}</Text>
    </View>
  )

  const keyExtractor = (_: IrnTableSchedule, index: number) => index.toString()

  const { countyId, districtId } = globalState
  const irnTables = getIrnTables(globalState)({ countyId, districtId })

  const mergedTables = mergeIrnTables(irnTables.slice(20, 25))

  const sections = mergedTables.map(table => ({ header: table, data: table.schedules }))

  return (
    <View style={styles.container}>
      <SectionList
        keyExtractor={keyExtractor}
        renderItem={renderIrnTableSection}
        sections={sections}
        renderSectionHeader={renderSectionHeader}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
