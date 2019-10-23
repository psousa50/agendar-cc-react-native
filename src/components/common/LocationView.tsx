import { Icon, Text, View } from "native-base"
import React from "react"
import { TouchableOpacity } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { IrnTableFilterLocation, regionNames } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { locationStyle } from "../../styles/location"
import { getDistrictName } from "../../utils/location"

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
  const districtName = getDistrictName(referenceDataProxy)(districtId, countyId)

  const isDefined = districtId || countyId || placeName
  return (
    <View style={styles.container}>
      <TouchableOpacity disabled={!onEdit} onPress={onEdit}>
        {isDefined ? (
          <>
            {districtName && <Text style={[styles.text, styles.district]}>{`${districtName}`}</Text>}
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
  ...locationStyle,
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
