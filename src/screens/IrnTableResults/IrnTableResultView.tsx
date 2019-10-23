import { Text, View } from "native-base"
import React from "react"
import EStyleSheet from "react-native-extended-stylesheet"
import { IrnTableResult } from "../../irnTables/models"
import { i18n } from "../../localization/i18n"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { locationStyle } from "../../styles/location"
import { formatDateLocale, formatTimeSlot } from "../../utils/formaters"
import { getDistrictName } from "../../utils/location"

interface IrnTableResultViewProps {
  irnTableResult: IrnTableResult
  referenceDataProxy: ReferenceDataProxy
}
export const IrnTableResultView: React.FC<IrnTableResultViewProps> = ({ irnTableResult, referenceDataProxy }) => {
  const { countyId, districtId, placeName, date, tableNumber, timeSlot } = irnTableResult
  const districtName = getDistrictName(referenceDataProxy)(districtId, countyId)

  return (
    <View>
      {districtName && <Text style={[styles.text, styles.district]}>{districtName}</Text>}
      <Text style={[styles.text, styles.place]}>{placeName}</Text>
      <Text style={[styles.text, styles.date]}>{formatDateLocale(date)}</Text>
      <Text style={[styles.text, styles.timeSlot]}>{formatTimeSlot(timeSlot)}</Text>
      <Text style={[styles.text, styles.table]}>{`${i18n.t("Results.Table")} ${tableNumber}`}</Text>
    </View>
  )
}

const styles = EStyleSheet.create({
  ...locationStyle,
  date: {
    fontSize: "1.3rem",
  },
  timeSlot: {
    fontSize: "1.3rem",
  },
  table: {
    fontSize: "1.0rem",
  },
})
