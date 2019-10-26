import { Icon, Text, View } from "native-base"
import { isNil, sort } from "ramda"
import React, { useMemo, useState } from "react"
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native"
import SegmentedControlTab from "react-native-segmented-control-tab"
import { LocationView } from "../../components/common/LocationView"
import { County } from "../../irnTables/models"
import { IrnPlacesProxy } from "../../state/irnPlacesSlice"
import { allRegions, IrnTableFilterLocation, Region, regionNames } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { shadow } from "../../styles/shadows"
import { appTheme } from "../../utils/appTheme"
import { getDistrictName, getFilteredLocations } from "../../utils/location"
import { responsiveFontScale as rfs, responsiveScale as rs } from "../../utils/responsive"
import { searchNormalizer } from "../../utils/strings"

const colorSecondary = appTheme.brandSecondary
const colorSecondaryText = appTheme.secondaryText

interface SearchableCounty {
  countyId?: number
  districtId: number
  key: string
  searchText: string
  displayText: string
  region: Region
}

interface SelectLocationViewState {
  locationText: string
  hideSearchResults: boolean
}
interface SelectLocationViewProps {
  location: IrnTableFilterLocation
  irnPlacesProxy: IrnPlacesProxy
  referenceDataProxy: ReferenceDataProxy
  onLocationChange: (location: IrnTableFilterLocation) => void
  onSelectLocationOnMap: () => void
}

const Separator = () => <View style={styles.separator} />

export const SelectLocationView: React.FC<SelectLocationViewProps> = ({
  location,
  irnPlacesProxy,
  referenceDataProxy,
  onLocationChange,
  onSelectLocationOnMap: selectOnMap,
}) => {
  const { region } = location
  const initialState: SelectLocationViewState = {
    locationText: "",
    hideSearchResults: false,
  }
  const [state, setState] = useState(initialState)
  const mergeState = (newState: Partial<SelectLocationViewState>) =>
    setState(oldState => ({ ...oldState, ...newState }))

  const searchableCounties = useMemo(() => buildSearchableCounties(referenceDataProxy), [])

  const listItems =
    state.locationText.length > 1
      ? searchableCounties
          .filter(
            sc =>
              (isNil(location.region) || sc.region === location.region) &&
              sc.searchText.includes(searchNormalizer(state.locationText)),
          )
          .slice(0, 20)
      : []

  const onListItemPressed = (districtId: number, countyId?: number) => {
    onLocationChange({ ...location, districtId, countyId, placeName: undefined })
    mergeState({
      locationText: "",
      hideSearchResults: true,
    })
  }

  const renderItem = ({ item }: ListRenderItemInfo<SearchableCounty>) => (
    <TouchableOpacity onPress={() => onListItemPressed(item.districtId, item.countyId)}>
      <Text key={item.displayText} style={styles.locationText}>
        {item.displayText}
      </Text>
    </TouchableOpacity>
  )

  const onChangeText = (locationText: string) => mergeState({ locationText, hideSearchResults: false })
  const onClearText = () => mergeState({ locationText: "" })

  const onRegionTabPress = (index: number) => {
    onLocationChange({ region: allRegions[index] })
  }

  const clearLocation = () => onLocationChange({ districtId: undefined, countyId: undefined, placeName: undefined })

  const { filteredDistricts, filteredCounties, filteredIrnPlaces } = getFilteredLocations(
    referenceDataProxy.getDistricts(),
    referenceDataProxy.getCounties(),
    irnPlacesProxy.getIrnPlaces({}),
    location,
  )
  const showSelectOnMap = filteredDistricts.length > 1 || filteredCounties.length > 1 || filteredIrnPlaces.length > 1

  return (
    <View style={styles.container}>
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
      <View style={styles.locationContainer}>
        <LocationView location={location} onClear={clearLocation} referenceDataProxy={referenceDataProxy} />
      </View>
      <View style={styles.locationInputContainer}>
        <TextInput
          style={styles.locationInput}
          placeholder="Procurar Distrito - Concelho"
          value={state.locationText}
          onChangeText={onChangeText}
        />
        <View style={styles.icons}>
          {showSelectOnMap && (
            <TouchableOpacity onPress={selectOnMap}>
              <Icon style={styles.icon} type="MaterialIcons" name={"location-on"} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onClearText}>
            <Icon style={styles.icon} name={"close"} />
          </TouchableOpacity>
        </View>
      </View>
      {!state.hideSearchResults && listItems.length > 0 ? (
        <KeyboardAvoidingView>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={listItems}
            renderItem={renderItem}
            ItemSeparatorComponent={Separator}
          />
        </KeyboardAvoidingView>
      ) : null}
    </View>
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
        countyId: county.countyId,
        districtId: county.districtId,
        key: displayText,
        displayText,
        searchText: searchNormalizer(displayText),
        region: district.region,
      }
    })
  const districtNames = referenceDataProxy.getDistricts().map(district => {
    const displayText = getDistrictName(referenceDataProxy)(district.districtId)!
    const searchText = searchNormalizer(displayText)
    return {
      countyId: undefined,
      districtId: district.districtId,
      key: displayText,
      displayText,
      searchText,
      region: district.region,
    }
  })

  return [
    ...sort((n1, n2) => n1.displayText.localeCompare(n2.displayText), districtNames),
    ...sort((n1, n2) => n1.displayText.localeCompare(n2.displayText), countyNames),
  ]
}

const styles = StyleSheet.create({
  container: {
    marginTop: rs(6),
    flexDirection: "column",
    paddingHorizontal: rs(12),
  },
  locationContainer: {
    padding: rs(6),
    marginVertical: rs(12),
    backgroundColor: "white",
    borderRadius: rs(7),
    ...shadow,
  },
  regionContainer: {
    marginTop: rs(2),
    padding: rs(7),
    backgroundColor: "white",
    borderRadius: rs(7),
    ...shadow,
  },
  locationInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: StyleSheet.hairlineWidth,
  },
  locationInput: {
    flex: 9,
    textAlign: "center",
    backgroundColor: "white",
    fontSize: rfs(15),
  },
  locationText: {
    paddingHorizontal: rs(16),
    paddingVertical: rs(7),
    fontSize: rfs(10),
    backgroundColor: "white",
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#707070",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  icon: {
    paddingHorizontal: rs(3),
    margin: rs(6),
    fontSize: rfs(12),
    color: appTheme.secondaryTextDimmed,
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
