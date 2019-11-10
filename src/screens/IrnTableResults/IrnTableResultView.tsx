import { Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { i18n } from "../../localization/i18n"
import { IrnTableResult } from "../../state/irnTablesSlice"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { formatDateLocale, formatTimeSlot } from "../../utils/formaters"
import { getDistrictName } from "../../utils/location"
import { responsiveFontScale as rfs, responsiveScale as rs } from "../../utils/responsive"

interface IrnTableResultViewProps {
  irnTableResult: IrnTableResult
  referenceDataProxy: ReferenceDataProxy
}
export const IrnTableResultView: React.FC<IrnTableResultViewProps> = ({ irnTableResult, referenceDataProxy }) => {
  const { countyId, districtId, placeName, date, tableNumber, timeSlot } = irnTableResult
  const districtName = getDistrictName(referenceDataProxy)(districtId, countyId)

  return (
    <View style={styles.container}>
      {districtName && <Text style={[styles.text, styles.district]}>{districtName}</Text>}
      <Text style={[styles.text, styles.place]}>{placeName}</Text>
      <Text style={[styles.text, styles.date]}>{formatDateLocale(date)}</Text>
      <Text style={[styles.text, styles.timeSlot]}>{formatTimeSlot(timeSlot)}</Text>
      <Text style={[styles.text, styles.table]}>{`${i18n.t("Results.Table")} ${tableNumber}`}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: rs(10),
    marginHorizontal: rs(5),
    backgroundColor: "white",
  },
  text: {
    textAlign: "center",
    paddingVertical: rs(5),
  },
  district: {
    fontSize: rfs(18),
    fontWeight: "bold",
  },
  place: {
    fontSize: rfs(14),
  },
  date: {
    fontSize: rfs(17),
  },
  timeSlot: {
    fontSize: rfs(17),
  },
  table: {
    fontSize: rfs(13),
  },
})
