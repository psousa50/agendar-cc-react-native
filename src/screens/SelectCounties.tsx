import { Body, Card, CardItem, Icon, Right, Text, View } from "native-base"
import React from "react"
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { Counties, County } from "../models"
import { useStateValue } from "../state/main"
import { fetchJson } from "../utils/fetch"
import { useDataApi } from "../utils/fetchApi"

export const SelectCountiesScreen: React.FunctionComponent<AppScreenProps> = props => (
  <AppScreen
    {...props}
    left={null}
    content={() => <SelectCountiesContent {...props} />}
    title="Agendar CC"
    showAds={false}
  />
)

export const SelectCountiesContent: React.FunctionComponent<AppScreenProps> = () => {
  const [globalState] = useStateValue()

  const renderResourceRow = (info: ListRenderItemInfo<County>) => {
    const county = info.item

    return (
      <Card>
        <CardItem button onPress={() => undefined}>
          <Body>
            <Text style={styles.countyText}>{county.name}</Text>
          </Body>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </CardItem>
      </Card>
    )
  }

  const keyExtractor = (item: County) => {
    return item.countyId.toString()
  }
  const [state] = useDataApi(
    () => fetchJson<Counties>(`http://192.168.1.105:3000/api/v1/counties/${globalState.districtId}`),
    [] as Counties,
  )

  return (
    <View style={styles.container}>
      <FlatList renderItem={renderResourceRow} data={state.data} keyExtractor={keyExtractor} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  countyText: {
    fontSize: 16,
  },
})
