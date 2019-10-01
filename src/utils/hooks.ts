import Geolocation from "@react-native-community/geolocation"
import { useEffect } from "react"
import { GpsLocation } from "../irnTables/models"

export const useCurrentGpsLocation = (callback: (gpsLocation?: GpsLocation) => void) => {
  const getCurrentGpsLocation = () => {
    Geolocation.getCurrentPosition(
      pos =>
        pos && pos.coords
          ? callback({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            })
          : callback(undefined),
      () => callback(undefined),
    )
  }

  useEffect(() => {
    getCurrentGpsLocation()
  }, [])
}
