import { View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { LocationsMap, MapLocation } from "../../components/common/LocationsMap"
import { IrnTableFilterLocation, ReferenceData } from "../../state/models"
import { getMapLocations, LocationsType } from "../../utils/location"

interface SelectLocationByMapViewProps {
  location: IrnTableFilterLocation
  referenceData: ReferenceData
  onLocationChange: (location: IrnTableFilterLocation) => void
}
export const SelectLocationByMapView: React.FC<SelectLocationByMapViewProps> = ({
  location,
  referenceData,
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

  {
    const { mapLocations, locationType } = getMapLocations(referenceData)(location)
    return (
      <View style={styles.container}>
        <LocationsMap mapLocations={mapLocations} locationType={locationType} onLocationPress={onLocationPress} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
