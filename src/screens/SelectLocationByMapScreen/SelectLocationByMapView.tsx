import { View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { LocationsMap, MapLocation } from "../../components/common/LocationsMap"
import { IrnPlacesProxy } from "../../state/irnPlacesSlice"
import { IrnTableFilterLocation } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { getMapLocations, LocationsType } from "../../utils/location"

interface SelectLocationByMapViewProps {
  location: IrnTableFilterLocation
  irnPlacesProxy: IrnPlacesProxy
  referenceDataProxy: ReferenceDataProxy
  onLocationChange: (location: IrnTableFilterLocation) => void
}
export const SelectLocationByMapView: React.FC<SelectLocationByMapViewProps> = ({
  location,
  irnPlacesProxy,
  referenceDataProxy,
  onLocationChange,
}) => {
  const onLocationPress = (type: LocationsType, mapLocation: MapLocation) => {
    if (type === "District") {
      onLocationChange({ ...location, districtId: mapLocation.id, countyId: undefined })
    }
    if (type === "County") {
      onLocationChange({ ...location, countyId: mapLocation.id })
    }
    if (type === "Place") {
      onLocationChange({ ...location, placeName: mapLocation.name })
    }
  }

  const render = () => {
    const { mapLocations, locationType } = getMapLocations(referenceDataProxy, irnPlacesProxy)(location)
    return (
      <View style={styles.container}>
        <LocationsMap mapLocations={mapLocations} locationType={locationType} onLocationPress={onLocationPress} />
      </View>
    )
  }

  return render()
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
