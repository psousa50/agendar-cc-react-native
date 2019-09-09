import { SectionList, SectionListData, SectionListRenderItem, StyleSheet } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"

import { Text, View } from "native-base"
import sort from "ramda/es/sort"
import React from "react"
import { mergeIrnTables, sortTimes } from "../irnTables/main"
import { IrnRepositoryTables, IrnTableSchedule } from "../irnTables/models"
import { useGlobalState } from "../state/main"
import { fetchJson } from "../utils/fetch"
import { useDataApi } from "../utils/fetchApi"

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
      <Text>{info.section.location.locationName}</Text>
    </View>
  )

  const keyExtractor = (_: IrnTableSchedule, index: number) => index.toString()

  const { countyId, districtId } = globalState
  const [state] = useDataApi(
    () =>
      fetchJson<IrnRepositoryTables>(
        `http://192.168.1.105:3000/api/v1/irnTables?districtId:${districtId}&countyId=${countyId}`,
      ),
    [] as IrnRepositoryTables,
  )

  const mergedTables = mergeIrnTables(state.data)

  const sections = mergedTables.map(t => ({ location: t, data: t.schedules }))

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
