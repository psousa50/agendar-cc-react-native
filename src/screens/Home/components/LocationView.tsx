import { Icon, Text, View } from "native-base"
import React from "react"
import { TouchableOpacity } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { useGlobalState } from "../../../GlobalStateProvider"
import { IrnTableFilterLocation, regionNames } from "../../../state/models"
import { globalStateSelectors } from "../../../state/selectors"

interface LocationViewProps {
  location: IrnTableFilterLocation
  onClear?: () => void
  onEdit?: () => void
}
export const LocationView: React.FC<LocationViewProps> = ({
  location: { districtId, countyId, placeName, region },
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
      {isDefined && onClear && (
        <TouchableOpacity style={styles.close} onPress={onClear}>
          <Icon style={styles.closeIcon} name={"close"} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = EStyleSheet.create({
  container: {},
  text: {
    fontSize: "1rem",
    textAlign: "center",
    paddingVertical: 5,
  },
  region: {
    fontSize: "1.3rem",
    fontWeight: "bold",
  },
  district: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  county: {
    fontSize: "1.1rem",
    fontWeight: "bold",
  },
  place: {
    fontSize: "0.7rem",
  },
  close: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  closeIcon: {
    padding: "0.2rem",
    fontSize: "1rem",
  },
})
