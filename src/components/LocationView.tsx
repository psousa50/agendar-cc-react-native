import { Icon, Text, View } from "native-base"
import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { useGlobalState } from "../GlobalStateProvider"
import { i18n } from "../localization/i18n"
import { IrnTableFilter, regionNames } from "../state/models"
import { globalStateSelectors } from "../state/selectors"

interface SelectedLocationViewProps {
  irnFilter: IrnTableFilter
  onClear?: () => void
  onEdit?: () => void
}
export const LocationView: React.FC<SelectedLocationViewProps> = ({
  irnFilter: { districtId, countyId, region, placeName },
  onClear,
  onEdit,
}) => {
  const [globalState] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const county = stateSelectors.getCounty(countyId)
  const district = stateSelectors.getDistrict(districtId)

  const row = (title: string, name?: string) => (
    <View style={styles.row}>
      <View style={styles.col1}>
        <Text style={styles.text1}>{title}</Text>
      </View>
      <View style={styles.col2}>
        <Text style={styles.text2}> {name}</Text>
      </View>
    </View>
  )
  return (
    <View style={styles.container}>
      <View style={styles.rows}>
        {row(i18n.t("Where.Region"), region ? regionNames[region] : undefined)}
        {row(i18n.t("Where.District"), district ? district.name : undefined)}
        {row(i18n.t("Where.County"), county ? county.name : undefined)}
        {row(i18n.t("Where.Place"), placeName)}
      </View>
      <View style={styles.icons}>
        {district || county || placeName ? (
          <TouchableOpacity onPress={onClear}>
            <Icon style={styles.icon} name={"close-circle"} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={onEdit}>
          <Icon style={styles.icon} name={"create"} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  rows: {
    flex: 8,
  },
  row: {
    flexDirection: "row",
  },
  col1: {
    flex: 2,
  },
  text1: {
    fontSize: 12,
  },
  col2: {
    flex: 8,
  },
  text2: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  icons: {
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    flexDirection: "row",
  },
  icon: {
    padding: 5,
    fontSize: 16,
  },
})
