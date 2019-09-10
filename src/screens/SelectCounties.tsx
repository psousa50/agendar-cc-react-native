import { Body, Card, CardItem, Icon, Right, Text, View } from "native-base"
import React from "react"
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { County } from "../irnTables/models"
import { useGlobalState } from "../state/main"
import { getCounties } from "../state/selectors"

export const SelectCountiesScreen: React.FunctionComponent<AppScreenProps> = props => (
  <AppScreen {...props} content={() => <SelectCountiesContent {...props} />} title="Agendar CC" showAds={false} />
)

const SelectCountiesContent: React.FunctionComponent<AppScreenProps> = props => {
  const [globalState, globalDispatch] = useGlobalState()

  const onCountyPress = (countyId: number) => {
    globalDispatch({ type: "SET_COUNTY_ID", payload: { countyId } })
    props.navigation.navigate("ShowIrnTables")
  }

  const renderCounty = (info: ListRenderItemInfo<County>) => {
    const county = info.item

    return (
      <Card>
        <CardItem button onPress={() => onCountyPress(county.countyId)}>
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

  return (
    <View style={styles.container}>
      <FlatList
        renderItem={renderCounty}
        data={getCounties(globalState)(globalState.districtId)}
        keyExtractor={keyExtractor}
      />
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
