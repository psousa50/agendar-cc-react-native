import { Body, Card, CardItem, Icon, Right } from "native-base"
import { Text, View } from "native-base"
import React from "react"
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { useGlobalState } from "../GlobalStateProvider"
import { District } from "../irnTables/models"
import { getDistricts } from "../state/selectors"

export const SelectDistrictsScreen: React.FunctionComponent<AppScreenProps> = props => (
  <AppScreen
    {...props}
    left={null}
    content={() => <SelectDistrictsContent {...props} />}
    title="Agendar CC"
    showAds={false}
  />
)

const SelectDistrictsContent: React.FunctionComponent<AppScreenProps> = props => {
  const [globalState, globalDispatch] = useGlobalState()

  const onDistrictPress = (districtId: number) => {
    globalDispatch({ type: "SET_DISTRICT_ID", payload: { districtId } })
    props.navigation.navigate("SelectCounties")
  }

  const renderDistrict = (info: ListRenderItemInfo<District>) => {
    const district = info.item

    return (
      <Card>
        <CardItem button onPress={() => onDistrictPress(district.districtId)}>
          <Body>
            <Text style={styles.districtText}>{district.name}</Text>
          </Body>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </CardItem>
      </Card>
    )
  }

  const keyExtractor = (item: District) => {
    return item.districtId.toString()
  }

  return (
    <View style={styles.container}>
      <FlatList renderItem={renderDistrict} data={getDistricts(globalState)} keyExtractor={keyExtractor} />
    </View>
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
