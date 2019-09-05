import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { fold } from "fp-ts/lib/TaskEither"
import React, { useEffect, useState } from "react"
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { District, Districts } from "../models"
import { fetchJson } from "../utils/fetch"

export const SelectDistrictsScreen: React.FunctionComponent<AppScreenProps> = props => (
  <AppScreen {...props} content={() => <SelectDistrictsContent {...props} />} title="Select a District" />
)

export const SelectDistrictsContent: React.FunctionComponent<AppScreenProps> = () => {
  const [data, setData] = useState({ districts: [] as Districts })
  const [error, setError] = useState("")

  const renderResourceRow = (info: ListRenderItemInfo<District>) => {
    const district = info.item

    return (
      <View key={district.districtId}>
        <Text>{district.districtName}</Text>
      </View>
    )
  }

  const keyExtractor = (item: District, _: number) => {
    return item.districtId.toString()
  }

  const fetch = async () => {
    const action = pipe(
      fetchJson<Districts>("http://192.168.1.105:3000/api/v1/districts"),
      fold(
        e => {
          setError(e.message)
          return task.of(e as any)
        },
        districts => {
          setData({ districts })
          return task.of(undefined)
        },
      ),
    )
    await action()
  }

  useEffect(() => {
    fetch()
  }, [])

  return (
    <>
      <Text>{error}</Text>
      <View style={styles.container}>
        <FlatList renderItem={renderResourceRow} data={data.districts} keyExtractor={keyExtractor} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: "red",
  },
})
