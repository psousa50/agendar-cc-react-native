import React, { useEffect, useRef } from "react"
import { StyleSheet } from "react-native"
import MapView, { Marker } from "react-native-maps"
import { GpsLocation } from "../../irnTables/models"

export type LocationsType = "District" | "County" | "Place"

export interface MapLocation {
  id?: number
  gpsLocation?: GpsLocation
  name: string
  pinColor?: string
  locationType: LocationsType
}
export type MapLocations = MapLocation[]

interface LocationsMapProps {
  mapLocations: MapLocation[]
  onLocationPress: (mapLocation: MapLocation) => void
}

export const LocationsMap: React.FC<LocationsMapProps> = ({ mapLocations, onLocationPress }) => {
  const map = useRef(null as MapView | null)

  const fitToElements = () => {
    const theMap = map.current as MapView
    theMap && theMap.fitToElements(true)
  }

  useEffect(() => {
    setTimeout(() => {
      fitToElements()
    }, 200)
  }, [mapLocations[0]])

  const validMapLocations = mapLocations.filter(l => !!l.gpsLocation) as MapLocation[]

  return (
    <MapView
      ref={map}
      style={styles.map}
      zoomEnabled={true}
      zoomControlEnabled={true}
      zoomTapEnabled={true}
      toolbarEnabled={true}
      pitchEnabled={true}
      onMapReady={fitToElements}
    >
      {validMapLocations.map((mapLocation, i) => (
        <Marker
          key={i}
          coordinate={mapLocation.gpsLocation!}
          title={mapLocation.name}
          pinColor={mapLocation.pinColor}
          onCalloutPress={() => onLocationPress(mapLocation)}
        />
      ))}
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
})
