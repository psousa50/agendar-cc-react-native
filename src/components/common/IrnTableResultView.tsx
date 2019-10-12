import { Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { IrnTableResult } from "../../irnTables/models"
import { i18n } from "../../localization/i18n"
import { ReferenceData } from "../../state/models"
import { formatDateLocale, formatTimeSlot } from "../../utils/formaters"

interface IrnTableResultViewProps {
  irnTableResult: IrnTableResult
  referenceData: ReferenceData
}
export const IrnTableResultView: React.FC<IrnTableResultViewProps> = ({ irnTableResult, referenceData }) => {
  const { countyId, districtId, placeName, date, tableNumber, timeSlot } = irnTableResult
  const county = referenceData.getCounty(countyId)
  const district = referenceData.getDistrict(districtId)
  const countyCount = referenceData.getCounties(districtId).length

  return (
    <View>
      {district && <Text style={[styles.text, styles.district]}>{district.name}</Text>}
      {county && countyCount > 1 && <Text style={[styles.text, styles.county]}>{county.name}</Text>}
      <Text style={[styles.text, styles.date]}>{formatDateLocale(date)}</Text>
      <Text style={[styles.text, styles.timeSlot]}>{formatTimeSlot(timeSlot)}</Text>
      <Text style={[styles.text, styles.place]}>{placeName}</Text>
      <Text style={[styles.text, styles.table]}>{`${i18n.t("Results.Table")} ${tableNumber}`}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5,
  },
  district: {
    fontSize: 18,
  },
  county: {},
  place: {
    fontSize: 11,
  },
  date: {},
  timeSlot: {},
  table: {},
})
