import { Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { i18n } from "../../localization/i18n"
import { IrnTableResult } from "../../state/irnTablesSlice"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { shadow } from "../../styles/shadows"
import { appTheme } from "../../utils/appTheme"
import { formatDateLocale, formatTimeSlot } from "../../utils/formaters"
import { getDistrictName } from "../../utils/location"
import { responsiveFontScale as rfs, responsiveScale as rs } from "../../utils/responsive"

interface IrnTableResultViewProps {
  irnTableResult: IrnTableResult
  referenceDataProxy: ReferenceDataProxy
}
export const IrnTableResultView: React.FC<IrnTableResultViewProps> = ({ irnTableResult, referenceDataProxy }) => {
  const { serviceId, countyId, districtId, placeName, date, tableNumber, timeSlot } = irnTableResult
  const districtName = getDistrictName(referenceDataProxy)(districtId, countyId)

  const service = referenceDataProxy.getIrnService(serviceId)
  return (
    <View style={styles.container}>
      {service && <Text style={[styles.text, styles.service]}>{service.name}</Text>}
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
    marginBottom: rs(10),
    marginHorizontal: rs(5),
    paddingVertical: rs(10),
    paddingHorizontal: rs(20),
    backgroundColor: "white",
    borderRadius: rs(6),
    ...shadow,
  },
  text: {
    textAlign: "center",
    paddingVertical: rs(5),
  },
  service: {
    fontSize: rfs(14),
    fontWeight: "bold",
    color: appTheme.primaryColor,
  },
  district: {
    fontSize: rfs(16),
    fontWeight: "bold",
  },
  place: {
    fontSize: rfs(14),
    minHeight: rfs(50),
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
