import { Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTableResult } from "../irnTables/models"
import { globalStateSelectors } from "../state/selectors"
import { formatDateLocale, formatTimeSlot, getCountyName } from "../utils/formaters"

export const IrnTableResultView: React.FC<IrnTableResult> = ({
  countyId,
  districtId,
  date,
  placeName,
  timeSlot,
  tableNumber,
}) => {
  const [globalState] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const county = stateSelectors.getCounty(countyId)
  const district = stateSelectors.getDistrict(districtId)
  const countyName = getCountyName(county, district)

  return (
    <View style={styles.container}>
      <Text>{countyName}</Text>
      <Text>{formatDateLocale(date)}</Text>
      <Text>{placeName}</Text>
      <Text>{`Hora: ${formatTimeSlot(timeSlot)} - Mesa: ${tableNumber}`}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
