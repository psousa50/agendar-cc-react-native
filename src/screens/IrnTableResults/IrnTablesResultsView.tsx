import { Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { InfoCard } from "../../components/common/InfoCard"
import {
  byIrnTableRefineFilter,
  getIrnTableResultSummary,
  selectOneIrnTableResultByClosestDate,
  selectOneIrnTableResultByClosestPlace,
} from "../../irnTables/main"
import { IrnRepositoryTables, IrnTableResult } from "../../irnTables/models"
import { i18n } from "../../localization/i18n"
import { IrnPlacesProxy } from "../../state/irnPlacesSlice"
import { IrnTableFilter, IrnTableRefineFilter } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { MainButton } from "../Home/components/MainButton"
import { IrnTableResultView } from "./IrnTableResultView"

interface IrnTablesResultsViewProps {
  filter: IrnTableFilter
  refineFilter: IrnTableRefineFilter
  irnTables: IrnRepositoryTables
  referenceDataProxy: ReferenceDataProxy
  irnPlacesProxy: IrnPlacesProxy
  onSearchLocation: () => void
  onSearchDate: () => void
  onSchedule: (irnTableResult: IrnTableResult) => void
  onNewSearch: () => void
}
export const IrnTablesResultsView: React.FC<IrnTablesResultsViewProps> = ({
  filter,
  refineFilter,
  irnTables,
  irnPlacesProxy,
  referenceDataProxy,
  onSearchDate,
  onSearchLocation,
  onNewSearch,
  onSchedule,
}) => {
  const { startDate, endDate } = filter
  const irnTablesFiltered = irnTables.filter(byIrnTableRefineFilter(refineFilter))

  const { countyId, districtId, gpsLocation } = filter
  const { date: refinedDate } = refineFilter
  const county = referenceDataProxy.getCounty(countyId)
  const district = referenceDataProxy.getDistrict(districtId)
  const location = gpsLocation || (county && county.gpsLocation) || (district && district.gpsLocation)

  const timeSlotsFilter = {
    endTime: filter.endTime,
    startTime: filter.startTime,
    timeSlot: refineFilter.timeSlot,
  }
  const isAsap = !startDate && !endDate && !refinedDate
  const irnTableResult =
    isAsap || !location
      ? selectOneIrnTableResultByClosestDate(irnPlacesProxy)(irnTablesFiltered, location, timeSlotsFilter)
      : selectOneIrnTableResultByClosestPlace(irnPlacesProxy)(irnTablesFiltered, location, timeSlotsFilter)

  const irnTableResultSummary = getIrnTableResultSummary(irnTables)

  const title = irnTableResult
    ? isAsap
      ? i18n.t("Results.Soonest")
      : i18n.t("Results.Closest")
    : i18n.t("Results.NoneTitle")

  return (
    <View style={styles.container}>
      <InfoCard iconType={"MaterialIcons"} iconName="schedule" title={title}>
        {irnTableResult ? (
          <IrnTableResultView irnTableResult={irnTableResult} referenceDataProxy={referenceDataProxy} />
        ) : (
          <View>
            <Text>{i18n.t("Results.None")}</Text>
          </View>
        )}
      </InfoCard>
      {irnTableResult && (
        <MainButton
          onPress={() => onSchedule(irnTableResult)}
          danger
          text={i18n.t("Results.Schedule")}
          iconType={"MaterialIcons"}
          iconName={"schedule"}
        />
      )}
      {irnTableResultSummary.irnPlaceNames.length > 1 && (
        <MainButton
          onPress={onSearchLocation}
          text={i18n.t("Results.ChooseLocation")}
          iconType={"MaterialIcons"}
          iconName={"location-on"}
        />
      )}
      {irnTableResultSummary.dates.length > 1 && (
        <MainButton onPress={onSearchDate} text={i18n.t("Results.ChooseDate")} iconName={"calendar"} />
      )}
      <MainButton onPress={onNewSearch} info text={i18n.t("Results.NewSearch")} iconName={"search"} />
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
