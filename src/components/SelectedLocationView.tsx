import { Body, Card, CardItem, Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTableFilterState } from "../state/models"
import { globalStateSelectors } from "../state/selectors"
import { getCountyName } from "../utils/formaters"

interface SelectedLocationViewProps {
  irnFilter: IrnTableFilterState
  onSelect: () => void
}
export const SelectedLocationView: React.FC<SelectedLocationViewProps> = ({
  irnFilter: { districtId, countyId, region, selectedPlaceName },
  onSelect,
}) => {
  const [globalState] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const county = stateSelectors.getCounty(countyId)
  const district = stateSelectors.getDistrict(districtId)
  const countyName = getCountyName(county, district)

  return (
    <View style={styles.container}>
      <Card>
        <CardItem button onPress={onSelect}>
          <Body>
            <Text>{region}</Text>
            <Text>{countyName}</Text>
            <Text>{selectedPlaceName}</Text>
          </Body>
        </CardItem>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
