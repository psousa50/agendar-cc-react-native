import { Icon, Text, View } from "native-base"
import React from "react"
import { TouchableOpacity } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { IrnTableFilterLocation, regionNames } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"

interface LocationViewProps {
  location: IrnTableFilterLocation
  referenceDataProxy: ReferenceDataProxy
  onClear?: () => void
  onEdit?: () => void
}
export const LocationView: React.FC<LocationViewProps> = ({
  location: { districtId, countyId, placeName, region },
  onClear,
  onEdit,
  referenceDataProxy,
}) => {
  const regionName = region && regionNames[region]
  const county = referenceDataProxy.getCounty(countyId)
  const district = referenceDataProxy.getDistrict(districtId)

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
  container: {
    backgroundColor: "white",
  },
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
    right: 0,
    top: 0,
    padding: "0.5rem",
  },
  closeIcon: {
    padding: "0.2rem",
    fontSize: "1rem",
  },
})
