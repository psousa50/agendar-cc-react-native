import Slider from "@react-native-community/slider"
import { Button, Text, View } from "native-base"
import sort from "ramda/es/sort"
import { useMemo, useState } from "react"
import React from "react"
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
} from "react-native"
import Collapsible from "react-native-collapsible"
import { useGlobalState } from "../../GlobalStateProvider"
import { Counties, County, DistrictAndCounty, Districts, GpsLocation } from "../../irnTables/models"
import { allRegions, IrnTableFilter, Region, regionNames } from "../../state/models"
import { globalStateSelectors } from "../../state/selectors"
import { getCountyName, properCase } from "../../utils/formaters"
import { useCurrentGpsLocation } from "../../utils/hooks"
import { getClosestLocation } from "../../utils/location"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { ButtonIcons } from "../common/ToolbarIcons"
import { LocationView } from "../LocationView"
import { RadioButton } from "../RadioButton"
import { navigate } from "./screens"

const MINIMUN_DISTANCE_RADIUS = 10
const MAXIMUN_DISTANCE_RADIUS = 500
const DISTANCE_RADIUS_STEP = 10

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
  useDistanceRadius: boolean
  distanceRadiusKm?: number
}

export const SelectLocationScreen: React.FC<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const updateGlobalFilterForEdit = (filter: Partial<IrnTableFilter>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER_FOR_EDIT",
      payload: { filter: { ...stateSelectors.getIrnTablesFilterForEdit, ...filter } },
    })
  }

  const updateGlobalFilterAndGoBack = () => {
    globalDispatch({
      type: "IRN_TABLES_UPDATE_FILTER",
      payload: {
        filter: {
          ...(state.useGpsLocation ? {} : { gpsLocation: undefined }),
          ...(state.useDistanceRadius ? { distanceRadiusKm: state.distanceRadiusKm } : { distanceRadiusKm: undefined }),
        },
      },
    })
    navigation.goBack()
  }

  const irnFilter = stateSelectors.getIrnTablesFilterForEdit

  const initialState: SelectLocationScreenState = {
    hideSearchResults: false,
    locationText: "",
    useGpsLocation: false,
    useDistanceRadius: !!irnFilter.distanceRadiusKm,
    distanceRadiusKm: irnFilter.distanceRadiusKm || MINIMUN_DISTANCE_RADIUS,
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
              (!irnFilter.region || sc.region === irnFilter.region) &&
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

  const updateCounty = ({ districtId, countyId }: DistrictAndCounty, gpsLocation?: GpsLocation) => {
    const district = stateSelectors.getDistrict(districtId)
    const searchableCounty = searchableCounties.find(sc => sc.districtId === districtId && sc.countyId === countyId)
    if (searchableCounty) {
      const irnPlaces = stateSelectors.getIrnPlaces({ districtId, countyId })
      const placeName = irnPlaces.length === 1 ? irnPlaces[0].name : undefined
      updateGlobalFilterForEdit({
        region: district && district.region,
        countyId,
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

  const onRegionSelected = (region: string) => {
    if (region !== stateSelectors.getIrnTablesFilterForEdit.region) {
      updateGlobalFilterForEdit({
        region: region as Region,
        districtId: undefined,
        countyId: undefined,
        placeName: undefined,
      })
      mergeState({
        locationText: "",
      })
    }
  }

  const onChangeText = (text: string) => mergeState({ locationText: text, hideSearchResults: false })

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

  const onUseDistanceRadius = () => mergeState({ useDistanceRadius: !state.useDistanceRadius })

  const calcDistanceRadius = (distanceRadiusKm: number) =>
    Math.floor(distanceRadiusKm / DISTANCE_RADIUS_STEP) * DISTANCE_RADIUS_STEP

  const onDistanceRadiusChange = (distanceRadiusKm: number) =>
    mergeState({ distanceRadiusKm: calcDistanceRadius(distanceRadiusKm) })

  const onDistanceRadiusComplete = (distanceRadiusKm: number) =>
    updateGlobalFilterForEdit({ distanceRadiusKm: calcDistanceRadius(distanceRadiusKm) })

  const renderContent = () => {
    const irnPlaces = stateSelectors.getIrnPlaces(irnFilter)
    return (
      <View style={styles.container}>
        <LocationView irnFilter={irnFilter} />
        <View style={styles.regions}>
          {allRegions.map(r => (
            <RadioButton
              key={r}
              id={r}
              label={regionNames[r]}
              selected={r === irnFilter.region}
              onSelected={onRegionSelected}
            />
          ))}
        </View>
        <TextInput
          style={styles.locationInput}
          placeholder="Distrito - Concelho"
          value={state.locationText}
          onChangeText={onChangeText}
        />
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
        <View style={styles.switch}>
          <Text>{"Usar a minha localização actual"}</Text>
          <Switch value={state.useGpsLocation} onValueChange={onUseGpsLocation} />
        </View>
        <View style={styles.switch}>
          <Text>{`Num raio de${state.useDistanceRadius ? ` ${state.distanceRadiusKm} Km` : ":"}`}</Text>
          <Switch value={state.useDistanceRadius} onValueChange={onUseDistanceRadius} />
        </View>
        <Collapsible collapsed={!state.useDistanceRadius}>
          <Slider
            value={irnFilter.distanceRadiusKm}
            minimumValue={MINIMUN_DISTANCE_RADIUS}
            maximumValue={MAXIMUN_DISTANCE_RADIUS}
            onValueChange={onDistanceRadiusChange}
            onSlidingComplete={onDistanceRadiusComplete}
          />
        </Collapsible>
        <Button disabled={irnPlaces.length <= 1} block onPress={() => navigation.goTo("SelectLocationByMapScreen")}>
          <Text>{"Seleccionar no mapa..."}</Text>
        </Button>
      </View>
    )
  }

  return (
    <AppScreen {...props} right={() => ButtonIcons.Checkmark(() => updateGlobalFilterAndGoBack())}>
      {renderContent()}
    </AppScreen>
  )
}

const buildSearchableCounties = (counties: Counties, districts: Districts): SearchableCounty[] => {
  const countyIsNotSingle = (county: County) => counties.filter(c => c.districtId === county.districtId).length > 1
  const countyNames = counties.filter(countyIsNotSingle).map(county => {
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
      searchText: `${districtName} - (Todos os Concelhos)`,
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
  regions: {
    flexDirection: "row",
    justifyContent: "space-around",
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
