import Geolocation from "@react-native-community/geolocation"
import { useEffect } from "react"
import { Alert } from "react-native"
import { GpsLocation } from "../irnTables/models"
import { i18n } from "../localization/i18n"

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

export const useErrorCheck = (error: string | undefined, onPress: () => void) => {
  useEffect(() => {
    if (error) {
      Alert.alert(i18n.t("Errors.Title"), i18n.t("Errors.Connect"), [{ text: i18n.t("Errors.Ok"), onPress }])
    }
  }, [error])
}
