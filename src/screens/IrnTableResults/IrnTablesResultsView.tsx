import { Text, View } from "native-base"
import { keys } from "ramda"
import React, { useState } from "react"
import { StyleSheet } from "react-native"
import SegmentedControlTab from "react-native-segmented-control-tab"
import { i18n } from "../../localization/i18n"
import { IrnPlacesProxy } from "../../state/irnPlacesSlice"
import { IrnTableMatchResult, IrnTableResult } from "../../state/irnTablesSlice"
import { IrnTableRefineFilter } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { appTheme } from "../../utils/appTheme"
import { responsiveFontScale as rfs, responsiveScale as rs } from "../../utils/responsive"
import { MainButton } from "../Home/components/MainButton"
import { IrnTableResultView } from "./IrnTableResultView"

const colorSecondary = appTheme.brandSecondary
const colorSecondaryText = appTheme.secondaryText

interface IrnTablesResultsViewProps {
  refineFilter: IrnTableRefineFilter
  irnTableMatchResult: IrnTableMatchResult
  referenceDataProxy: ReferenceDataProxy
  irnPlacesProxy: IrnPlacesProxy
  onClearRefineFilter: () => void
  onSearchLocation: () => void
  onSearchDate: () => void
  onSearchTimeSlot: () => void
  onSchedule: (selectedIrnTableResult?: IrnTableResult) => void
  onNewSearch: () => void
}
export const IrnTablesResultsView: React.FC<IrnTablesResultsViewProps> = ({
  irnTableMatchResult,
  referenceDataProxy,
  refineFilter,
  onClearRefineFilter,
  onSearchDate,
  onSearchLocation,
  onSearchTimeSlot,
  onNewSearch,
  onSchedule,
}) => {
  const [selectedIrnTableResult, setSelectedIrnTableResult] = useState<IrnTableResult | undefined>(
    irnTableMatchResult.irnTableResults && irnTableMatchResult.irnTableResults.closest,
  )
  const irnTableResults = irnTableMatchResult.irnTableResults

  const onIrnTableResultTabPress = (index: number) => {
    setSelectedIrnTableResult(
      irnTableResults ? (index === 0 ? irnTableResults.closest : irnTableResults.soonest) : undefined,
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.results}>
        <SegmentedControlTab
          activeTabStyle={styles.activeTabStyle}
          activeTabTextStyle={styles.activeTabTextStyle}
          tabStyle={styles.tabStyle}
          tabTextStyle={styles.tabTextStyle}
          values={[i18n.t("Results.Closest"), i18n.t("Results.Soonest")]}
          selectedIndex={
            irnTableMatchResult.irnTableResults &&
            selectedIrnTableResult === irnTableMatchResult.irnTableResults.closest
              ? 0
              : 1
          }
          onTabPress={onIrnTableResultTabPress}
        />
        {selectedIrnTableResult ? (
          <IrnTableResultView irnTableResult={selectedIrnTableResult} referenceDataProxy={referenceDataProxy} />
        ) : (
          <View>
            <Text style={styles.notFoundText}>{i18n.t("Results.None1")}</Text>
            <Text style={styles.notFoundText}>{i18n.t("Results.None2")}</Text>
          </View>
        )}
      </View>
      {irnTableResults && (
        <MainButton
          onPress={() => onSchedule(selectedIrnTableResult)}
          danger
          text={i18n.t("Results.ToSchedule")}
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
      {irnTableMatchResult.otherTimeSlots.length > 1 && (
        <MainButton
          onPress={onSearchTimeSlot}
          text={i18n.t("Results.ChooseTimeSlot")}
          iconType={"Entypo"}
          iconName={"time-slot"}
        />
      )}
      <MainButton
        disabled={keys(refineFilter).length === 0}
        onPress={onClearRefineFilter}
        text={i18n.t("Results.ClearFilters")}
        iconType={"FontAwesome"}
        iconName={"filter"}
      />
      <MainButton
        style={{ marginTop: rs(20) }}
        onPress={onNewSearch}
        info
        text={i18n.t("Results.NewSearch")}
        iconName={"search"}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: rs(6),
    flexDirection: "column",
  },
  results: {
    marginHorizontal: rs(10),
  },
  button: {
    marginTop: rs(30),
  },
  notFoundText: {
    paddingVertical: rs(20),
  },
  activeTabStyle: {
    backgroundColor: colorSecondary,
  },
  activeTabTextStyle: {
    color: colorSecondaryText,
  },
  tabStyle: {
    borderColor: colorSecondary,
  },
  tabTextStyle: {
    paddingVertical: rs(7),
    fontSize: rfs(12),
    flexWrap: "wrap",
  },
})
