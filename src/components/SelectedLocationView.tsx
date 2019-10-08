import { Body, Card, CardItem, Text } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTableFilter } from "../state/models"
import { globalStateSelectors } from "../state/selectors"
import { getCountyName } from "../utils/formaters"

interface SelectedLocationViewProps {
  irnFilter: IrnTableFilter
  onSelect?: () => void
}
export const SelectedLocationView: React.FC<SelectedLocationViewProps> = ({
  irnFilter: { districtId, countyId, region, placeName, distanceRadiusKm: distanceRadius },
  onSelect,
}) => {
  const [globalState] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const county = stateSelectors.getCounty(countyId)
  const district = stateSelectors.getDistrict(districtId)
  const countyName = getCountyName(county, district)

  return (
    <Card style={styles.card}>
      <CardItem button onPress={onSelect}>
        <Body>
          <Text>{region}</Text>
          <Text>{countyName}</Text>
          <Text>{placeName}</Text>
          <Text>{distanceRadius}</Text>
        </Body>
      </CardItem>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 0,
  },
})
