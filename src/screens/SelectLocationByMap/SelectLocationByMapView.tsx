import { View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { LocationsMap, MapLocation } from "../../components/common/LocationsMap"
import { IrnPlacesProxy } from "../../state/irnPlacesSlice"
import { IrnTableFilterLocation } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { getAllMapLocations } from "../../utils/location"

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
  const onLocationPress = (mapLocation: MapLocation) => {
    switch (mapLocation.locationType) {
      case "District":
        onLocationChange({ ...location, districtId: mapLocation.id, countyId: undefined, placeName: undefined })
        break
      case "County":
        onLocationChange({ ...location, countyId: mapLocation.id, placeName: undefined })
        break
      case "Place":
        onLocationChange({ ...location, placeName: mapLocation.name })
        break
    }
  }

  const render = () => {
    const { districtLocations, countyLocations, irnPlacesLocations } = getAllMapLocations(
      referenceDataProxy.getDistricts(),
      referenceDataProxy.getCounties(),
      irnPlacesProxy.getIrnPlaces({}),
      location,
    )

    const mapLocations =
      districtLocations.length !== 1
        ? districtLocations
        : countyLocations.length !== 1
        ? countyLocations
        : irnPlacesLocations

    return (
      <View style={styles.container}>
        <LocationsMap mapLocations={mapLocations} onLocationPress={onLocationPress} />
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
