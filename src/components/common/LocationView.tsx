import { Icon, Text, View } from "native-base"
import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { i18n } from "../../localization/i18n"
import { IrnTableFilterLocation, regionNames } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { getDistrictName } from "../../utils/location"
import { responsiveFontScale as rfs, responsiveScale as rs } from "../../utils/responsive"

interface LocationViewProps {
  location: IrnTableFilterLocation
  referenceDataProxy: ReferenceDataProxy
  onClear?: () => void
  onEdit?: () => void
}
export const LocationView: React.FC<LocationViewProps> = ({
  location: { districtId, countyId, placeName, region, distanceRadiusKm },
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
            {distanceRadiusKm && (
              <Text style={[styles.text, styles.distanceRadiusKm]}>
                {`${i18n.t("Where.UseRange")} ${distanceRadiusKm}Km`}
              </Text>
            )}
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

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    paddingVertical: rs(5),
  },
  region: {
    fontSize: rfs(18),
    fontWeight: "600",
  },
  district: {
    fontSize: rfs(16),
    fontWeight: "600",
  },
  county: {
    fontSize: rfs(12),
    fontWeight: "600",
  },
  place: {
    fontSize: rfs(10),
  },
  distanceRadiusKm: {
    fontSize: rfs(12),
    paddingVertical: rs(1),
  },
  container: {
    backgroundColor: "white",
  },
  close: {
    position: "absolute",
    right: 0,
    top: 0,
    paddingHorizontal: rfs(12),
  },
  closeIcon: {
    fontSize: rfs(12),
  },
})
