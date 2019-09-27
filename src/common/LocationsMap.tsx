import React, { useLayoutEffect, useRef } from "react"
import { StyleSheet, Text } from "react-native"
import MapView, { Marker } from "react-native-maps"
import { GpsLocation } from "../irnTables/models"

export interface MapLocation {
  id?: number
  gpsLocation?: GpsLocation
  name: string
}
export type LocationsType = "District" | "County" | "Place"
interface LocationsMapProps {
  locationType: LocationsType
  mapLocations: MapLocation[]
  onLocationPress: (locationType: LocationsType, location: MapLocation) => void
}

export const LocationsMap: React.FC<LocationsMapProps> = ({ mapLocations, onLocationPress, locationType }) => {
  const map = useRef(null as MapView | null)

  useLayoutEffect(() => {
    const theMap = map.current as MapView
    setTimeout(() => {
      theMap.fitToElements(true)
    }, 1000)
  }, [locationType])

  const realMapLocations = mapLocations.filter(l => !!l.gpsLocation) as MapLocation[]

  return (
    <MapView
      ref={map}
      style={styles.map}
      zoomEnabled={true}
      zoomControlEnabled={true}
      zoomTapEnabled={true}
      toolbarEnabled={true}
      pitchEnabled={true}
    >
      {realMapLocations.map((mapLocation, i) => (
        <Marker
          key={i}
          coordinate={mapLocation.gpsLocation!}
          title={mapLocation.name}
          onPress={() => onLocationPress(locationType, mapLocation)}
        >
          <Text style={{ backgroundColor: "yellow", fontSize: 10 }}>{mapLocation.name}</Text>
        </Marker>
      ))}
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
})
