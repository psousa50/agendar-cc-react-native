import { Body, Card, CardItem, Icon, Right } from "native-base"
import React from "react"
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { District, Districts } from "../models"
import { fetchJson } from "../utils/fetch"
import { useDataApi } from "../utils/fetchApi"

export const SelectDistrictsScreen: React.FunctionComponent<AppScreenProps> = props => (
  <AppScreen
    {...props}
    left={null}
    content={() => <SelectDistrictsContent {...props} />}
    title="Agendar CC"
    showAds={false}
  />
)

export const SelectDistrictsContent: React.FunctionComponent<AppScreenProps> = () => {
  const renderResourceRow = (info: ListRenderItemInfo<District>) => {
    const district = info.item

    return (
      <Card>
        <CardItem button onPress={() => undefined}>
          <Body>
            <Text style={styles.districtText}>{district.districtName}</Text>
          </Body>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </CardItem>
      </Card>
    )
  }

  const keyExtractor = (item: District, _: number) => {
    return item.districtId.toString()
  }

  const [state] = useDataApi(() => fetchJson<Districts>("http://192.168.1.105:3000/api/v1/districts"), [] as Districts)

  return (
    <>
      <Text>{state.error}</Text>
      <View style={styles.container}>
        <FlatList renderItem={renderResourceRow} data={state.data} keyExtractor={keyExtractor} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  districtText: {
    fontSize: 16,
  },
})
