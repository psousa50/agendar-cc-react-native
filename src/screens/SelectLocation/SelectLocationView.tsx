import Slider from "@react-native-community/slider"
import { Text, View } from "native-base"
import { isNil, sort } from "ramda"
import React, { useMemo, useState } from "react"
import { KeyboardAvoidingView, StyleSheet } from "react-native"
import SegmentedControlTab from "react-native-segmented-control-tab"
import { SearchableItem, SearchableTextInputLocation } from "../../components/common/SearchableTextInputLocation"
import { County } from "../../irnTables/models"
import { i18n } from "../../localization/i18n"
import { IrnPlacesProxy } from "../../state/irnPlacesSlice"
import { allRegions, IrnTableFilterLocation, Region, regionNames } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { appTheme } from "../../utils/appTheme"
import { getClosestLocation, getCurrentGpsLocation, getDistrictName } from "../../utils/location"
import { responsiveFontScale as rfs, responsiveScale as rs } from "../../utils/responsive"
import { searchNormalizer } from "../../utils/strings"

const colorSecondary = appTheme.brandSecondary
const colorSecondaryText = appTheme.secondaryText

interface SearchableLocation extends SearchableItem {
  item: {
    countyId?: number
    districtId: number
    region: Region
  }
}

type SearchableCounty = SearchableLocation
type SearchableIrnPlace = SearchableLocation

interface SelectLocationViewProps {
  location: IrnTableFilterLocation
  irnPlacesProxy: IrnPlacesProxy
  referenceDataProxy: ReferenceDataProxy
  onLocationChange: (location: IrnTableFilterLocation) => void
  onSelectDistrictCountyOnMap: () => void
  onSelectIrnPlaceOnMap: () => void
}

export const SelectLocationView: React.FC<SelectLocationViewProps> = ({
  location,
  referenceDataProxy,
  irnPlacesProxy,
  onLocationChange,
  onSelectDistrictCountyOnMap,
  onSelectIrnPlaceOnMap,
}) => {
  const [rangeValue, setRangeValue] = useState(location.distanceRadiusKm || 0)
  const [, setError] = useState<string | undefined>("")
  const { countyId, districtId, region } = location

  const searchableCounties = useMemo(() => buildSearchableCounties(referenceDataProxy), [])
  const searchableIrnPlaces = useMemo(() => buildSearchableIrnPlaces(referenceDataProxy, irnPlacesProxy), [])

  const onRegionTabPress = (index: number) => {
    onLocationChange({ region: allRegions[index] })
  }

  const clearCounty = () => {
    onLocationChange({ ...location, districtId: undefined, countyId: undefined, placeName: undefined })
  }

  const fetchDistrictCounties = (text: string) =>
    searchableCounties.filter(
      sc =>
        (isNil(location.region) || sc.item.region === location.region) &&
        sc.searchText.includes(searchNormalizer(text)),
    )

  const onCountyPressed = (sc: SearchableItem) => {
    const loc = (sc as SearchableCounty).item

    onLocationChange({
      ...location,
      region: loc.region,
      districtId: loc.districtId,
      countyId: loc.countyId,
      placeName: undefined,
      gpsLocation: undefined,
    })
  }
  const selectedDistricts = searchableCounties.filter(sc => sc.item.districtId === districtId)
  const selectedCounty =
    selectedDistricts.length === 1 ? selectedDistricts[0] : selectedDistricts.find(sc => sc.item.countyId === countyId)
  const districtCountyText = selectedCounty && selectedCounty.displayText

  const selectedPlaceNames = searchableIrnPlaces.filter(
    p => (isNil(districtId) || p.item.districtId === districtId) && (isNil(countyId) || p.item.countyId === countyId),
  )

  const clearPlaceName = () => {
    onLocationChange({ ...location, placeName: undefined })
  }
  const fetchPlaceName = (text: string) =>
    searchableIrnPlaces.filter(
      sp =>
        (isNil(region) || sp.item.region === region) &&
        (isNil(districtId) || sp.item.districtId === districtId) &&
        (isNil(countyId) || sp.item.countyId === countyId) &&
        sp.searchText.includes(searchNormalizer(text)),
    )

  const onIrnPlacePressed = (item: SearchableItem) => {
    onLocationChange({
      ...location,
      region: undefined,
      districtId: undefined,
      countyId: undefined,
      gpsLocation: undefined,
      placeName: item.displayText,
    })
  }

  const useGpsLocationForCounty = async () => {
    try {
      const gpsLocation = await getCurrentGpsLocation()
      const closestCounty = getClosestLocation(referenceDataProxy.getCounties())(gpsLocation)
      const newLocation = {
        ...location,
        ...(closestCounty
          ? {
              region: undefined,
              districtId: closestCounty.location.districtId,
              countyId: closestCounty.location.countyId,
              placeName: undefined,
            }
          : {}),
        gpsLocation,
      }
      onLocationChange(newLocation)
    } catch (error) {
      setError("No GPS")
    }
  }

  const useGpsLocationForIrnPlace = async () => {
    try {
      const gpsLocation = await getCurrentGpsLocation()
      const closestIrnPlace = getClosestLocation(irnPlacesProxy.getIrnPlaces({}))(gpsLocation)
      const newLocation = {
        ...location,
        ...(closestIrnPlace
          ? { region: undefined, districtId: undefined, countyId: undefined, placeName: closestIrnPlace.location.name }
          : {}),
        gpsLocation,
      }
      onLocationChange(newLocation)
    } catch (error) {
      setError("No GPS")
    }
  }

  const onRangeChange = (value: number) => {
    setRangeValue(value)
  }

  const onRangeComplete = (value: number) => {
    onLocationChange({ ...location, distanceRadiusKm: value > 0 ? value : undefined })
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.regionContainer}>
        <SegmentedControlTab
          activeTabStyle={styles.activeTabStyle}
          activeTabTextStyle={styles.activeTabTextStyle}
          tabStyle={styles.tabStyle}
          tabTextStyle={styles.tabTextStyle}
          values={allRegions.map(r => regionNames[r])}
          selectedIndex={allRegions.findIndex(r => r === region) || 0}
          onTabPress={onRegionTabPress}
        />
      </View>
      <SearchableTextInputLocation
        fontSize={rs(14)}
        initialText={districtCountyText}
        placeHolder={i18n.t("Where.LookDistrictCounty")}
        fetchItems={fetchDistrictCounties}
        onClear={clearCounty}
        onItemPressed={onCountyPressed}
        onSelectOnMap={onSelectDistrictCountyOnMap}
        onUseGpsLocation={useGpsLocationForCounty}
      />
      <SearchableTextInputLocation
        fontSize={rs(10)}
        initialText={location.placeName}
        placeHolder={i18n.t("Where.LookPlace")}
        fetchItems={fetchPlaceName}
        onClear={clearPlaceName}
        onItemPressed={onIrnPlacePressed}
        onSelectOnMap={selectedPlaceNames.length > 1 ? onSelectIrnPlaceOnMap : undefined}
        onUseGpsLocation={useGpsLocationForIrnPlace}
      />
      <View style={styles.rangeDistanceContainer}>
        <View style={styles.rangeTextContainer}>
          <Text style={[styles.useRangeText, rangeValue === 0 ? styles.useRangeTextDimmed : undefined]}>
            {i18n.t("Where.UseRange")}
          </Text>
          {rangeValue > 0 ? <Text style={styles.useRangeText}>{`${rangeValue} Km`}</Text> : null}
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={500}
          step={10}
          value={rangeValue}
          onValueChange={onRangeChange}
          onSlidingComplete={onRangeComplete}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const buildSearchableCounties = (referenceDataProxy: ReferenceDataProxy): SearchableCounty[] => {
  const countyIsNotSingle = (county: County) => referenceDataProxy.getCounties(county.districtId).length > 1
  const countyNames = referenceDataProxy
    .getCounties()
    .filter(countyIsNotSingle)
    .map(county => {
      const district = referenceDataProxy.getDistrict(county.districtId)!
      const displayText = getDistrictName(referenceDataProxy)(district.districtId, county.countyId)!
      return {
        item: {
          countyId: county.countyId,
          districtId: county.districtId,
          region: district.region,
        },
        key: displayText,
        displayText,
        searchText: searchNormalizer(displayText),
      }
    })
  const districtNames = referenceDataProxy.getDistricts().map(district => {
    const displayText = getDistrictName(referenceDataProxy)(district.districtId)!
    const searchText = searchNormalizer(displayText)
    return {
      item: {
        countyId: undefined,
        districtId: district.districtId,
        region: district.region,
      },
      key: displayText,
      displayText,
      searchText,
    }
  })

  return [
    ...sort((n1, n2) => n1.displayText.localeCompare(n2.displayText), districtNames),
    ...sort((n1, n2) => n1.displayText.localeCompare(n2.displayText), countyNames),
  ]
}

export const buildSearchableIrnPlaces = (
  referenceDataProxy: ReferenceDataProxy,
  irnPlacesProxy: IrnPlacesProxy,
): SearchableIrnPlace[] =>
  irnPlacesProxy.getIrnPlaces({}).map(p => ({
    item: {
      countyId: p.countyId,
      districtId: p.districtId,
      region: referenceDataProxy.getDistrict(p.districtId)!.region,
    },
    searchText: searchNormalizer(p.name),
    displayText: p.name,
    key: p.name,
  }))

const styles = StyleSheet.create({
  container: {
    marginTop: rs(6),
    flexDirection: "column",
    paddingHorizontal: rs(12),
  },
  regionContainer: {
    marginTop: rs(2),
    padding: rs(7),
    backgroundColor: "white",
    borderRadius: rs(7),
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
  title: {
    marginTop: rs(20),
    marginBottom: rs(10),
  },
  rangeDistanceContainer: {
    flexDirection: "column",
    paddingVertical: rs(10),
    paddingHorizontal: rs(10),
  },
  rangeTextContainer: {
    flexDirection: "row",
    paddingVertical: rs(5),
    alignItems: "center",
    justifyContent: "space-between",
  },
  slider: {},
  useRangeText: {
    fontSize: rfs(12),
    color: appTheme.secondaryText,
  },
  useRangeTextDimmed: {
    color: appTheme.secondaryTextDimmed,
  },
  switch: {
    transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
  },
})
