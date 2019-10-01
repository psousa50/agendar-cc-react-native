import { Body, CheckBox, Icon, ListItem, Right, Text, View } from "native-base"
import sort from "ramda/es/sort"
import React from "react"
import { useMemo, useState } from "react"
import { FlatList, ListRenderItemInfo, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import SegmentedControlTab from "react-native-segmented-control-tab"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { LocationsMap, LocationsType, MapLocation } from "../common/LocationsMap"
import { ButtonIcons } from "../common/ToolbarIcons"
import { useGlobalState } from "../GlobalStateProvider"
import { Counties, DistrictCounty, Districts, GpsLocation } from "../irnTables/models"
import { allRegions, IrnTableFilterState, Region } from "../state/models"
import { globalStateSelectors, GlobalStateSelectors } from "../state/selectors"
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

const getMapLocations = (stateSelectors: GlobalStateSelectors) => (irnFilter: IrnTableFilterState) => {
  const { districtId, countyId, region } = irnFilter
  const districtLocations = stateSelectors
    .getDistricts(region)
    .filter(d => !districtId || d.districtId === districtId)
    .map(d => ({ ...d, id: d.districtId }))

  const countyLocations = stateSelectors
    .getCounties(districtId)
    .filter(
      c => districtLocations.map(dl => dl.districtId).includes(c.districtId) && (!countyId || c.countyId === countyId),
    )
    .map(c => ({ ...c, id: c.countyId }))

  const irnPlacesLocations = stateSelectors
    .getIrnPlaces()
    .filter(
      p =>
        countyLocations.map(cl => cl.countyId).includes(p.countyId) &&
        (!countyId || p.countyId === countyId) &&
        (!districtId || p.districtId === districtId),
    )

  const locationType: LocationsType =
    districtLocations.length !== 1 ? "District" : countyLocations.length !== 1 ? "County" : "Place"

  const mapLocations =
    locationType === "District" ? districtLocations : locationType === "County" ? countyLocations : irnPlacesLocations

  return { mapLocations, locationType }
}

interface SelectLocationScreenState {
  irnFilter: IrnTableFilterState
  locationText: string
  gpsLocation?: GpsLocation
  hideSearchResults: boolean
}

export const SelectLocationScreen: React.FC<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const initialState: SelectLocationScreenState = {
    irnFilter: stateSelectors.getIrnTablesFilter,
    hideSearchResults: false,
    locationText: "",
  }

  const [state, setState] = useState(initialState)

  const mergeState = (newState: Partial<SelectLocationScreenState>) =>
    setState(oldState => ({ ...oldState, ...newState }))

  const { counties, districts } = stateSelectors.getStaticData
  const searchableCounties = useMemo(() => buildSearchableCounties(counties, districts), [counties, districts])

  const updateGlobalFilter = () => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER",
      payload: { filter: state.irnFilter },
    })
    navigation.goBack()
  }

  useCurrentGpsLocation(loc => mergeState({ gpsLocation: loc }))

  const listItems =
    state.locationText.length > 1
      ? searchableCounties
          .filter(
            sc =>
              sc.region === state.irnFilter.region &&
              sc.searchText.toLocaleLowerCase().includes(state.locationText.toLocaleLowerCase()),
          )
          .slice(0, 5)
      : []

  const renderItem = ({ item }: ListRenderItemInfo<SearchableCounty>) => (
    <TouchableOpacity onPress={() => updateCounty({ districtId: item.districtId, countyId: item.countyId })}>
      <Text key={item.searchText} style={styles.locationText}>
        {item.searchText}
      </Text>
    </TouchableOpacity>
  )

  const updateFilter = (irnFilter: Partial<IrnTableFilterState>) => {
    mergeState({ irnFilter: { ...state.irnFilter, ...irnFilter } })
  }

  const updateCounty = ({ districtId, countyId }: DistrictCounty) => {
    const countiesForDistrict = stateSelectors.getCounties(districtId)
    const autoCountyId = countiesForDistrict.length === 1 ? countiesForDistrict[0].countyId : countyId
    const searchableCounty = searchableCounties.find(sc => sc.districtId === districtId && sc.countyId === autoCountyId)
    if (searchableCounty) {
      const irnPlaces = stateSelectors.getIrnPlaces(autoCountyId)
      const placeName = irnPlaces.length === 1 ? irnPlaces[0].name : undefined
      mergeState({
        irnFilter: {
          ...state.irnFilter,
          countyId: autoCountyId,
          districtId,
          placeName,
          gpsLocation: undefined,
        },
        locationText: searchableCounty.searchText,
        hideSearchResults: true,
      })
    }
  }

  const onChangeText = (text: string) => mergeState({ locationText: text, hideSearchResults: false })

  const onRegionTabPress = (index: number) => {
    updateFilter({ region: allRegions[index] })
  }

  const onLocationPress = (type: LocationsType, mapLocation: MapLocation) => {
    console.log("onLocationPress=====>")
    if (type === "District") {
      updateCounty({ districtId: mapLocation.id, countyId: undefined })
    }
    if (type === "County") {
      updateCounty({ districtId: state.irnFilter.districtId, countyId: mapLocation.id })
    }
    if (type === "Place") {
      updateFilter({ placeName: mapLocation.name })
    }
  }

  const showListItems = !state.hideSearchResults && listItems.length > 0

  const onLocationCheckBoxPress = () => {
    const closesestCounty = state.gpsLocation ? getClosestLocation(counties)(state.gpsLocation) : null
    if (closesestCounty && closesestCounty.location) {
      const { districtId, countyId } = closesestCounty.location
      updateCounty({ districtId, countyId })
    }
    updateFilter({ gpsLocation: state.irnFilter.gpsLocation ? undefined : state.gpsLocation })
  }
  const { mapLocations, locationType } = getMapLocations(stateSelectors)(state.irnFilter)

  const renderContent = () => {
    return (
      <View style={styles.container}>
        <SegmentedControlTab
          values={allRegions}
          selectedIndex={allRegions.findIndex(r => r === state.irnFilter.region)}
          onTabPress={onRegionTabPress}
        />
        <TextInput
          style={styles.locationInput}
          placeholder="Distrito - Concelho"
          value={state.locationText}
          onChangeText={onChangeText}
        />
        <ListItem onPress={onLocationCheckBoxPress}>
          <CheckBox checked={!!state.irnFilter.gpsLocation} />
          <Body>
            <Text style={styles.currentLocationText}>{"Usar a minha localização actual"}</Text>
          </Body>
          <Right>
            <Icon type="FontAwesome" name="location-arrow" />
          </Right>
        </ListItem>
        <Text style={styles.placeNameText}>{state.irnFilter.placeName}</Text>
        {showListItems ? (
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={listItems}
            renderItem={renderItem}
            ItemSeparatorComponent={Separator}
          />
        ) : (
          <View style={styles.map}>
            <LocationsMap mapLocations={mapLocations} locationType={locationType} onLocationPress={onLocationPress} />
          </View>
        )}
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
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  locationInput: {
    marginTop: 10,
    borderWidth: StyleSheet.hairlineWidth,
    textAlign: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationText: {
    paddingHorizontal: 30,
    paddingVertical: 5,
    fontSize: 12,
  },
  placeNameText: {
    fontSize: 12,
  },
  currentLocationIcon: {
    color: "#707070",
    paddingLeft: 5,
    fontSize: 16,
  },
  currentLocation: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentLocationText: {
    paddingLeft: 20,
    fontSize: 14,
    textAlign: "center",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#707070",
  },
})
