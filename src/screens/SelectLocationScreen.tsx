import { Icon, Text, View } from "native-base"
import sort from "ramda/es/sort"
import React from "react"
import { useMemo, useState } from "react"
import { FlatList, ListRenderItemInfo, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import SegmentedControlTab from "react-native-segmented-control-tab"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { ButtonIcons } from "../common/ToolbarIcons"
import { useGlobalState } from "../GlobalStateProvider"
import { Counties, Districts, GpsLocation } from "../irnTables/models"
import { allRegions, IrnTableFilterState, Region } from "../state/models"
import { getCounty, getDistrict, getIrnTablesFilter, globalStateSelectors } from "../state/selectors"
import { getCountyName, properCase } from "../utils/formaters"
import { useCurrentGpsLocation } from "../utils/hooks"
import { getClosestLocation } from "../utils/location"
import { navigate } from "./screens"

interface SearchableCounty {
  countyId?: number
  districtId: number
  key: string
  searchText: string
  region: Region
}
const buildSearchableCounties = (counties: Counties, districts: Districts): SearchableCounty[] => {
  const countyNames = counties.map(county => {
    const district = districts.find(d => d.districtId === county.districtId)!
    const countyName = getCountyName(county, district)
    return {
      countyId: county.countyId,
      districtId: county.districtId,
      key: countyName,
      searchText: countyName,
      region: district.region,
    }
  })
  const districtNames = districts.map(district => {
    const districtName = properCase(district.name)
    return {
      countyId: undefined,
      districtId: district.districtId,
      key: districtName,
      searchText: districtName,
      region: district.region,
    }
  })

  return sort((n1, n2) => n1.searchText.localeCompare(n2.searchText), [...districtNames, ...countyNames])
}

interface SelectWhereScreenState {
  irnFilter: IrnTableFilterState
  locationText: string
  location: GpsLocation | null
  hideSearchResults: boolean
}

export const SelectLocationScreen: React.FC<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const initialState: SelectWhereScreenState = {
    irnFilter: getIrnTablesFilter(globalState),
    hideSearchResults: false,
    locationText: "",
    location: null,
  }

  const [state, setState] = useState(initialState)

  const mergeState = (newState: Partial<SelectWhereScreenState>) => setState(oldState => ({ ...oldState, ...newState }))

  const { locationText, location } = state

  const { counties, districts } = stateSelectors.getStaticData
  const searchableCounties = useMemo(() => buildSearchableCounties(counties, districts), [counties, districts])

  const updateGlobalFilter = () => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER",
      payload: { filter: state.irnFilter },
    })
    navigation.goBack()
  }

  useCurrentGpsLocation(loc => mergeState({ location: loc }))

  const listItems =
    locationText.length > 1
      ? searchableCounties
          .filter(
            sc =>
              sc.region === state.irnFilter.region &&
              sc.searchText.toLocaleLowerCase().includes(locationText.toLocaleLowerCase()),
          )
          .slice(0, 5)
      : []

  const renderItem = ({ item }: ListRenderItemInfo<SearchableCounty>) => (
    <TouchableOpacity onPress={() => updateCounty(item.districtId, item.countyId)}>
      <Text key={item.searchText} style={styles.locationText}>
        {item.searchText}
      </Text>
    </TouchableOpacity>
  )

  const setCurrentLocation = () => {
    const closesestCounty = location ? getClosestLocation(counties)(location) : null
    if (closesestCounty && closesestCounty.location) {
      updateCounty(closesestCounty.location.districtId, closesestCounty.location.countyId)
    }
  }

  const updateFilter = (irnFilter: Partial<IrnTableFilterState>) => {
    mergeState({
      irnFilter,
    })
  }

  const updateCounty = (districtId: number, countyId?: number) => {
    const district = getDistrict(globalState)(districtId)
    const county = getCounty(globalState)(countyId)
    mergeState({
      irnFilter: { countyId, districtId },
      locationText: getCountyName(county, district),
      hideSearchResults: true,
    })
  }

  const onChangeText = (text: string) => mergeState({ locationText: text, hideSearchResults: false })

  const onRegionTabPress = (index: number) => {
    updateFilter({ region: allRegions[index] })
  }

  const renderContent = () => {
    return (
      <View>
        <SegmentedControlTab
          values={allRegions}
          selectedIndex={allRegions.findIndex(r => r === state.irnFilter.region)}
          onTabPress={onRegionTabPress}
        />
        <View style={styles.locationContainer}>
          <TextInput placeholder="Distrito - Concelho" value={locationText} onChangeText={onChangeText} />
          <Icon
            onPress={setCurrentLocation}
            style={styles.currentLocationIcon}
            type="FontAwesome"
            name="location-arrow"
          />
        </View>
        {!state.hideSearchResults ? (
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={listItems}
            renderItem={renderItem}
            ItemSeparatorComponent={Separator}
          />
        ) : null}
      </View>
    )
  }

  return (
    <AppScreen
      {...props}
      content={renderContent}
      title="Agendar CC"
      showAds={false}
      right={() => ButtonIcons.Checkmark(() => updateGlobalFilter())}
    />
  )
}

const Separator = () => <View style={styles.separator} />

const styles = StyleSheet.create({
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationText: {
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  currentLocationIcon: {
    color: "#707070",
    fontSize: 16,
    paddingLeft: 5,
  },
  currentLocation: {
    flexDirection: "row",
  },
  currentLocationText: {
    paddingLeft: 20,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#707070",
  },
})
