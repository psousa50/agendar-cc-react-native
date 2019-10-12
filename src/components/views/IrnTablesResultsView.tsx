import { Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import {
  refineFilterIrnTable,
  selectOneIrnTableResultByClosestDate,
  selectOneIrnTableResultByClosestPlace,
} from "../../irnTables/main"
import { IrnRepositoryTables } from "../../irnTables/models"
import { i18n } from "../../localization/i18n"
import { IrnTableFilter, IrnTableRefineFilter, ReferenceData } from "../../state/models"
import { InfoCard } from "../common/InfoCard"
import { IrnTableResultView } from "../common/IrnTableResultView"

interface IrnTablesResultsViewProps {
  filter: IrnTableFilter
  refineFilter: IrnTableRefineFilter
  irnTables: IrnRepositoryTables
  referenceData: ReferenceData
}
export const IrnTablesResultsView: React.FC<IrnTablesResultsViewProps> = ({
  filter,
  refineFilter,
  irnTables,
  referenceData,
}) => {
  const { startDate, endDate } = filter
  const irnTablesFiltered = irnTables.filter(refineFilterIrnTable(refineFilter))

  const { countyId, districtId, gpsLocation } = filter
  const { date: refinedDate } = refineFilter
  const county = referenceData.getCounty(countyId)
  const district = referenceData.getDistrict(districtId)
  const location = gpsLocation || (county && county.gpsLocation) || (district && district.gpsLocation)

  const timeSlotsFilter = {
    endTime: filter.endTime,
    startTime: filter.startTime,
    timeSlot: refineFilter.timeSlot,
  }
  const isAsap = !startDate && !endDate && !refinedDate
  const irnTableResult =
    isAsap || !location
      ? selectOneIrnTableResultByClosestDate(referenceData)(irnTablesFiltered, location, timeSlotsFilter)
      : selectOneIrnTableResultByClosestPlace(referenceData)(irnTablesFiltered, location, timeSlotsFilter)

  // const irnTableResultSummary = getIrnTableResultSummary(irnTables)

  const title = irnTableResult
    ? isAsap
      ? i18n.t("Results.Closest")
      : i18n.t("Results.Soonest")
    : i18n.t("Results.NoneTitle")
  return (
    <View style={styles.container}>
      <InfoCard title={title}>
        {irnTableResult ? (
          <IrnTableResultView irnTableResult={irnTableResult} referenceData={referenceData} />
        ) : (
          <View>
            <Text>{i18n.t("Results.None")}</Text>
          </View>
        )}
      </InfoCard>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
})
