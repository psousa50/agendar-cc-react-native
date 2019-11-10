import { Icon, Text, View } from "native-base"
import React, { useEffect, useRef } from "react"
import { StyleSheet } from "react-native"
import MapView, { Callout, Marker } from "react-native-maps"
import { GpsLocation } from "../../irnTables/models"
import { responsiveFontScale as rfs, responsiveScale as rs } from "../../utils/responsive"

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
          pinColor={mapLocation.pinColor}
          onCalloutPress={() => onLocationPress(mapLocation)}
        >
          <Callout>
            <View style={styles.callout}>
              <Text>{mapLocation.name}</Text>
              <Icon style={styles.calloutIcon} type="FontAwesome" name="angle-right" />
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  callout: {
    flexDirection: "row",
    alignItems: "center",
  },
  calloutIcon: {
    marginLeft: rs(10),
    fontSize: rfs(20),
  },
})
