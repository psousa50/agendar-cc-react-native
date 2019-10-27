import { Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { InfoCard } from "../../components/common/InfoCard"
import { i18n } from "../../localization/i18n"
import { IrnPlacesProxy } from "../../state/irnPlacesSlice"
import { IrnTableMatchResult } from "../../state/irnTablesSlice"
import { IrnTableRefineFilter } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { appTheme } from "../../utils/appTheme"
import { responsiveScale as rs } from "../../utils/responsive"
import { MainButton } from "../Home/components/MainButton"
import { IrnTableResultView } from "./IrnTableResultView"

interface IrnTablesResultsViewProps {
  refineFilter: IrnTableRefineFilter
  irnTableMatchResult: IrnTableMatchResult
  referenceDataProxy: ReferenceDataProxy
  irnPlacesProxy: IrnPlacesProxy
  onSearchLocation: () => void
  onSearchDate: () => void
  onSchedule: () => void
  onNewSearch: () => void
}
export const IrnTablesResultsView: React.FC<IrnTablesResultsViewProps> = ({
  irnTableMatchResult,
  referenceDataProxy,
  onSearchDate,
  onSearchLocation,
  onNewSearch,
  onSchedule,
}) => {
  const irnTableResult = irnTableMatchResult.irnTableResult

  const title = irnTableResult ? i18n.t("Results.Soonest") : i18n.t("Results.NoneTitle")

  return (
    <View style={styles.container}>
      <InfoCard iconType={"MaterialIcons"} iconName="schedule" title={title}>
        {irnTableResult ? (
          <IrnTableResultView irnTableResult={irnTableResult} referenceDataProxy={referenceDataProxy} />
        ) : (
          <View>
            <Text style={styles.notFoundText}>{i18n.t("Results.None1")}</Text>
            <Text style={styles.notFoundText}>{i18n.t("Results.None2")}</Text>
          </View>
        )}
      </InfoCard>
      {irnTableResult && (
        <MainButton
          style={{ marginTop: rs(50) }}
          onPress={() => onSchedule()}
          danger
          text={i18n.t("Results.Schedule")}
          iconType={"MaterialIcons"}
          iconName={"schedule"}
          color={appTheme.secondaryColor}
        />
      )}
      {irnTableMatchResult.otherPlaces.length > 1 && (
        <MainButton
          onPress={onSearchLocation}
          text={i18n.t("Results.ChooseLocation")}
          iconType={"MaterialIcons"}
          iconName={"location-on"}
        />
      )}
      {irnTableMatchResult.otherDates.length > 1 && (
        <MainButton onPress={onSearchDate} text={i18n.t("Results.ChooseDate")} iconName={"calendar"} />
      )}
      <MainButton onPress={onNewSearch} info text={i18n.t("Results.NewSearch")} iconName={"search"} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: rs(6),
    flexDirection: "column",
  },
  button: {
    marginTop: rs(20),
  },
  notFoundText: {
    paddingVertical: rs(20),
  },
})
