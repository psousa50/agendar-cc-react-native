import { Icon, Text, View } from "native-base"
import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTableFilter, regionNames } from "../state/models"
import { globalStateSelectors } from "../state/selectors"

interface SelectedLocationViewProps {
  irnFilter: IrnTableFilter
  onClear?: () => void
  onEdit?: () => void
}
export const LocationView: React.FC<SelectedLocationViewProps> = ({
  irnFilter: { districtId, countyId, placeName, region },
  onClear,
  onEdit,
}) => {
  const [globalState] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const regionName = region && regionNames[region]
  const county = stateSelectors.getCounty(countyId)
  const district = stateSelectors.getDistrict(districtId)

  const isDefined = district || county || placeName
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onEdit}>
        {isDefined ? (
          <>
            {district && <Text style={[styles.text, styles.district]}>{district.name}</Text>}
            {county && <Text style={[styles.text, styles.county]}>{county.name}</Text>}
            {placeName && <Text style={[styles.text, styles.place]}>{placeName}</Text>}
          </>
        ) : (
          regionName && <Text style={[styles.text, styles.region]}>{regionName}</Text>
        )}
      </TouchableOpacity>
      {isDefined && (
        <TouchableOpacity style={styles.close} onPress={onClear}>
          <Icon style={styles.closeIcon} name={"close"} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5,
  },
  region: {
    fontSize: 20,
  },
  district: {
    fontSize: 18,
  },
  county: {},
  place: {
    fontSize: 11,
  },
  close: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  closeIcon: {
    padding: 5,
    fontSize: 16,
  },
})
