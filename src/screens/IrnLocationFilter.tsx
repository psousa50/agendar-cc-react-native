import Geolocation from "@react-native-community/geolocation"
import { Icon, Text, View } from "native-base"
import sort from "ramda/es/sort"
import React from "react"
import { useEffect, useMemo, useState } from "react"
import { FlatList, ListRenderItemInfo, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { ButtonIcons } from "../common/ToolbarIcons"
import { useGlobalState } from "../GlobalStateProvider"
import { Counties, Districts, GpsLocation } from "../irnTables/models"
import { IrnFilterState } from "../state/models"
import { getCounty, getDistrict, getIrnTablesFilter } from "../state/selectors"
import { getCountyName, properCase } from "../utils/formaters"
import { getClosestCounty } from "../utils/location"

interface SearchableCounty {
  countyId?: number
  districtId: number
  key: string
  searchText: string
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
    }
  })
  const districtNames = districts.map(district => {
    const districtName = properCase(district.name)
    return {
      countyId: undefined,
      districtId: district.districtId,
      key: districtName,
      searchText: districtName,
    }
  })

  return sort((n1, n2) => n1.searchText.localeCompare(n2.searchText), [...districtNames, ...countyNames])
}

interface IrnLocationFilterScreenState {
  irnFilter: IrnFilterState
  locationText: string
  position: GpsLocation | null
  hideSearchResults: boolean
}

export const IrnLocationFilterScreen: React.FunctionComponent<AppScreenProps> = props => {
  const [globalState, globalDispatch] = useGlobalState()

  const initialState: IrnLocationFilterScreenState = {
    irnFilter: getIrnTablesFilter(globalState),
    hideSearchResults: false,
    locationText: "",
    position: null,
  }

  const [state, setState] = useState(initialState)

  const mergeState = (newState: Partial<IrnLocationFilterScreenState>) =>
    setState(oldState => ({ ...oldState, ...newState }))

  const { locationText, position } = state

  const { counties, districts } = globalState.staticData
  const searchableCounties = useMemo(() => buildSearchableCounties(counties, districts), [counties, districts])

  const updateGlobalFilter = () => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER",
      payload: { filter: state.irnFilter },
    })
    props.navigation.goBack()
  }

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      pos => {
        mergeState({
          position: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
        })
      },
      () => mergeState({ position: null }),
    )
  }

  useEffect(() => {
    getCurrentPosition()
  }, [])

  const listItems =
    locationText.length > 1
      ? searchableCounties
          .filter(sc => sc.searchText.toLocaleLowerCase().includes(locationText.toLocaleLowerCase()))
          .slice(0, 5)
      : []

  const renderItem = ({ item }: ListRenderItemInfo<SearchableCounty>) => (
    <TouchableOpacity onPress={() => updateFilter(item.countyId, item.districtId)}>
      <Text key={item.searchText} style={styles.locationText}>
        {item.searchText}
      </Text>
    </TouchableOpacity>
  )

  const setCurrentLocation = () => {
    const closesestCounty = position ? getClosestCounty(counties)(position) : null
    if (closesestCounty && closesestCounty.county) {
      updateFilter(closesestCounty.county.countyId, closesestCounty.county.districtId)
    }
  }

  const updateFilter = (countyId: number | undefined, districtId: number) => {
    const district = getDistrict(globalState)(districtId)
    const county = getCounty(globalState)(countyId)
    mergeState({
      irnFilter: { countyId, districtId },
      locationText: getCountyName(county, district),
      hideSearchResults: true,
    })
  }

  const onChangeText = (text: string) => mergeState({ locationText: text, hideSearchResults: false })

  const renderContent = () => {
    return (
      <View>
        <TextInput placeholder="Distrito - Concelho" value={locationText} onChangeText={onChangeText} />
        <View style={styles.currentLocation}>
          <Icon style={styles.currentLocationIcon} type="FontAwesome" name="location-arrow" />
          <Text onPress={setCurrentLocation} style={styles.currentLocationText}>
            Localização actual
          </Text>
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
