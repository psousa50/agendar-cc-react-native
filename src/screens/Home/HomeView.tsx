import { Text, View } from "native-base"
import React from "react"
import { Switch, TouchableOpacity } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { InfoCard } from "../../components/common/InfoCard"
import { LocationView } from "../../components/common/LocationView"
import { Separator } from "../../components/common/Separator"
import { i18n } from "../../localization/i18n"
import { DatePeriod, IrnTableFilter, IrnTableFilterLocation, TimePeriod } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { appTheme } from "../../utils/appTheme"
import { AppScreenName } from "../screens"
import { DatePeriodView } from "./components/DatePeriodView"
import { MainButton } from "./components/MainButton"
import { SelectIrnServiceView } from "./components/SelectIrnServiceView"
import { TimePeriodView } from "./components/TimePeriodView"

export interface HomeViewProps {
  filter: IrnTableFilter
  referenceDataProxy: ReferenceDataProxy
  onDatePeriodChange: (dateOPeriod: DatePeriod) => void
  onEditLocation: () => void
  onLocationChange: (location: IrnTableFilterLocation) => void
  onSearch: () => void
  onSelectFilter: (filterScreen: AppScreenName) => void
  onServiceIdChange: (serviceId: number) => void
  onTimePeriodChange: (timePeriod: TimePeriod) => void
  onSaturdaysChange: (value: boolean) => void
}

export const HomeView: React.FC<HomeViewProps> = ({
  filter,
  onDatePeriodChange,
  onEditLocation,
  onLocationChange,
  onSearch,
  onServiceIdChange,
  onTimePeriodChange,
  onSaturdaysChange,
  referenceDataProxy,
}) => {
  const { serviceId, onlyOnSaturdays } = filter

  const onClearLocation = () =>
    onLocationChange({ region: "Continente", districtId: undefined, countyId: undefined, placeName: undefined })

  return (
    <View style={styles.container}>
      <InfoCard title={i18n.t("Service.Name")} iconType={"AntDesign"} iconName="idcard">
        <SelectIrnServiceView serviceId={serviceId} onServiceIdChanged={onServiceIdChange} />
      </InfoCard>
      <InfoCard title={i18n.t("Where.Name")} iconType={"MaterialIcons"} iconName="location-on" onPress={onEditLocation}>
        <LocationView
          location={filter}
          onClear={onClearLocation}
          onEdit={onEditLocation}
          referenceDataProxy={referenceDataProxy}
        />
      </InfoCard>
      <InfoCard title={i18n.t("When.Name")} iconType={"AntDesign"} iconName="calendar">
        <DatePeriodView {...filter} onDatePeriodChange={onDatePeriodChange} />
        <Separator />
        <TimePeriodView {...filter} onTimePeriodChange={onTimePeriodChange} />
        <Separator />
        <View style={styles.switchContainer}>
          <TouchableOpacity onPress={() => onSaturdaysChange(!onlyOnSaturdays)}>
            <Text style={[styles.onlyOnSaturdays, !onlyOnSaturdays && styles.onlyOnSaturdaysDimmed]}>
              {i18n.t("DatePeriod.OnlyOnSaturdays")}
            </Text>
          </TouchableOpacity>
          <Switch style={styles.switch} value={onlyOnSaturdays} onValueChange={onSaturdaysChange} />
        </View>
      </InfoCard>
      <MainButton onPress={onSearch} text={i18n.t("SearchTimetables")} iconName={"search"} />
    </View>
  )
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    marginTop: "0.5rem",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  switchContainer: {
    flexDirection: "row",
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  onlyOnSaturdays: {
    fontSize: "0.7rem",
    textAlignVertical: "center",
    paddingHorizontal: "0.5rem",
    color: appTheme.secondaryText,
  },
  onlyOnSaturdaysDimmed: {
    color: appTheme.secondaryTextDimmed,
  },
  switch: {
    transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
  },
})
