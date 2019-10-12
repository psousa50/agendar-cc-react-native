import { Button, Icon, Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { InfoCard } from "../../components/common/InfoCard"
import {
  getIrnTableResultSummary,
  refineFilterIrnTable,
  selectOneIrnTableResultByClosestDate,
  selectOneIrnTableResultByClosestPlace,
} from "../../irnTables/main"
import { IrnRepositoryTables } from "../../irnTables/models"
import { i18n } from "../../localization/i18n"
import { IrnTableFilter, IrnTableRefineFilter, ReferenceData } from "../../state/models"
import { IrnTableResultView } from "./IrnTableResultView"

interface IrnTablesResultsViewProps {
  filter: IrnTableFilter
  refineFilter: IrnTableRefineFilter
  irnTables: IrnRepositoryTables
  referenceData: ReferenceData
  onSearchLocation: () => void
  onSearchDate: () => void
  onSchedule: () => void
  onNewSearch: () => void
}
export const IrnTablesResultsView: React.FC<IrnTablesResultsViewProps> = ({
  filter,
  refineFilter,
  irnTables,
  referenceData,
  onSearchDate,
  onSearchLocation,
  onNewSearch,
  onSchedule,
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

  const irnTableResultSummary = getIrnTableResultSummary(irnTables)

  const title = irnTableResult
    ? isAsap
      ? i18n.t("Results.Soonest")
      : i18n.t("Results.Closest")
    : i18n.t("Results.NoneTitle")

  console.log("=====>", irnTableResultSummary)
  return (
    <View style={styles.container}>
      <InfoCard iconType={"MaterialIcons"} iconName="schedule" title={title}>
        {irnTableResult ? (
          <IrnTableResultView irnTableResult={irnTableResult} referenceData={referenceData} />
        ) : (
          <View>
            <Text>{i18n.t("Results.None")}</Text>
          </View>
        )}
      </InfoCard>
      {irnTableResultSummary.irnPlaceNames.length > 1 && (
        <Button style={styles.button} block success onPress={onSearchLocation}>
          <Icon type={"MaterialIcons"} name="location-on" />
          <Text>{i18n.t("Results.ChooseLocation")}</Text>
        </Button>
      )}
      {irnTableResultSummary.dates.length > 1 && (
        <Button style={styles.button} block success onPress={onSearchDate}>
          <Icon name="calendar" />
          <Text>{i18n.t("Results.ChooseDate")}</Text>
        </Button>
      )}
      <Button style={styles.button} block danger onPress={onSchedule}>
        <Icon type={"MaterialIcons"} name="schedule" />
        <Text>{i18n.t("Results.Schedule")}</Text>
      </Button>
      <Button style={styles.button} block info onPress={onNewSearch}>
        <Icon name="search" />
        <Text>{i18n.t("Results.NewSearch")}</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  button: {
    marginTop: 20,
  },
})
