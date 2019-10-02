import { Button, Text, View } from "native-base"
import sort from "ramda/es/sort"
import { useMemo, useState } from "react"
import React from "react"
import { FlatList, ListRenderItemInfo, StyleSheet, Switch, TextInput, TouchableOpacity } from "react-native"
import SegmentedControlTab from "react-native-segmented-control-tab"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { ButtonIcons } from "../common/ToolbarIcons"
import { SelectedLocationView } from "../components/SelectedLocationView"
import { useGlobalState } from "../GlobalStateProvider"
import { Counties, DistrictCounty, Districts, GpsLocation } from "../irnTables/models"
import { allRegions, IrnTableFilterState, Region } from "../state/models"
import { globalStateSelectors } from "../state/selectors"
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
interface SelectLocationScreenState {
  locationText: string
  useGpsLocation: boolean
  gpsLocation?: GpsLocation
  hideSearchResults: boolean
}

export const SelectLocationScreen: React.FC<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const updateGlobalFilterForEdit = (filter: Partial<IrnTableFilterState>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER_FOR_EDIT",
      payload: { filter: { ...stateSelectors.getIrnTablesFilterForEdit, ...filter } },
    })
  }

  const updateGlobalFilterAndGoBack = () => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER",
      payload: {
        filter: { ...stateSelectors.getIrnTablesFilterForEdit },
        ...(state.useGpsLocation ? {} : { gpsLocation: undefined }),
      },
    })
    navigation.goBack()
  }

  const irnFilter = stateSelectors.getIrnTablesFilterForEdit

  const initialState: SelectLocationScreenState = {
    hideSearchResults: false,
    locationText: "",
    useGpsLocation: false,
  }
  const [state, setState] = useState(initialState)

  const mergeState = (newState: Partial<SelectLocationScreenState>) =>
    setState(oldState => ({ ...oldState, ...newState }))

  const { counties, districts } = stateSelectors.getStaticData
  const searchableCounties = useMemo(() => buildSearchableCounties(counties, districts), [counties, districts])

  useCurrentGpsLocation(loc => mergeState({ gpsLocation: loc }))

  const listItems =
    state.locationText.length > 1
      ? searchableCounties
          .filter(
            sc =>
              sc.region === irnFilter.region &&
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

  const updateCounty = ({ districtId, countyId }: DistrictCounty, gpsLocation?: GpsLocation) => {
    const district = stateSelectors.getDistrict(districtId)
    const countiesForDistrict = stateSelectors.getCounties(districtId)
    const autoCountyId = countiesForDistrict.length === 1 ? countiesForDistrict[0].countyId : countyId
    const searchableCounty = searchableCounties.find(sc => sc.districtId === districtId && sc.countyId === autoCountyId)
    if (searchableCounty) {
      const irnPlaces = stateSelectors.getIrnPlaces(autoCountyId)
      const placeName = irnPlaces.length === 1 ? irnPlaces[0].name : undefined
      updateGlobalFilterForEdit({
        region: district && district.region,
        countyId: autoCountyId,
        districtId,
        placeName,
        gpsLocation,
      })
      mergeState({
        locationText: searchableCounty.searchText,
        hideSearchResults: true,
      })
    }
  }

  const onChangeText = (text: string) => mergeState({ locationText: text, hideSearchResults: false })

  const onRegionTabPress = (index: number) => {
    updateGlobalFilterForEdit({
      region: allRegions[index],
      districtId: undefined,
      countyId: undefined,
      placeName: undefined,
    })
  }

  const onUseGpsLocation = () => {
    if (!state.useGpsLocation) {
      const closesestCounty = state.gpsLocation ? getClosestLocation(counties)(state.gpsLocation) : null
      if (closesestCounty && closesestCounty.location) {
        const { districtId, countyId } = closesestCounty.location
        updateCounty({ districtId, countyId }, irnFilter.gpsLocation ? undefined : state.gpsLocation)
      }
    }
    mergeState({ useGpsLocation: !state.useGpsLocation })
  }

  const renderContent = () => {
    return (
      <View style={styles.container}>
        <SegmentedControlTab
          values={allRegions}
          selectedIndex={allRegions.findIndex(r => r === irnFilter.region)}
          onTabPress={onRegionTabPress}
        />
        <TextInput
          style={styles.locationInput}
          placeholder="Distrito - Concelho"
          value={state.locationText}
          onChangeText={onChangeText}
        />
        <View style={styles.switch}>
          <Text>{"Usar a minha localização actual"}</Text>
          <Switch value={state.useGpsLocation} onValueChange={onUseGpsLocation} />
        </View>
        {!state.hideSearchResults && listItems.length > 0 ? (
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={listItems}
            renderItem={renderItem}
            ItemSeparatorComponent={Separator}
          />
        ) : null}
        <SelectedLocationView irnFilter={irnFilter} />
        <Button block onPress={() => navigation.goTo("SelectLocationByMapScreen")}>
          <Text>{"Seleccionar no mapa..."}</Text>
        </Button>
      </View>
    )
  }

  return (
    <AppScreen
      {...props}
      content={renderContent}
      title="Localização"
      showAds={false}
      right={() => ButtonIcons.Checkmark(() => updateGlobalFilterAndGoBack())}
    />
  )
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

const Separator = () => <View style={styles.separator} />

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  switch: {
    flexDirection: "row",
    paddingLeft: 14,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
})
