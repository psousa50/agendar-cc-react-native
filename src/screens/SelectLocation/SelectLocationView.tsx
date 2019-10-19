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
import EStyleSheet from "react-native-extended-stylesheet"
import SegmentedControlTab from "react-native-segmented-control-tab"
import { LocationView } from "../../components/common/LocationView"
import { Counties, County, Districts } from "../../irnTables/models"
import { IrnPlacesProxy } from "../../state/irnPlacesSlice"
import { allRegions, IrnTableFilterLocation, Region, regionNames } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { shadow } from "../../styles/shadows"
import { appTheme } from "../../utils/appTheme"
import { getCountyName, properCase } from "../../utils/formaters"
import { getFilteredLocations } from "../../utils/location"

const colorSecondary = appTheme.brandSecondary
const colorSecondaryText = appTheme.secondaryText

interface SearchableCounty {
  countyId?: number
  districtId: number
  key: string
  searchText: string
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

  const districts = referenceDataProxy.getDistricts()
  const counties = referenceDataProxy.getCounties()
  const searchableCounties = useMemo(() => buildSearchableCounties(counties, districts), [counties, districts])

  const listItems =
    state.locationText.length > 1
      ? searchableCounties
          .filter(
            sc =>
              (isNil(location.region) || sc.region === location.region) &&
              sc.searchText.toLocaleLowerCase().includes(state.locationText.toLocaleLowerCase()),
          )
          .slice(0, 8)
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
      <Text key={item.searchText} style={styles.locationText}>
        {item.searchText}
      </Text>
    </TouchableOpacity>
  )

  const onChangeText = (locationText: string) => mergeState({ locationText, hideSearchResults: false })
  const onClearText = () => mergeState({ locationText: "" })

  const onRegionTabPress = (index: number) => {
    onLocationChange({ region: allRegions[index] })
  }

  const onClearLocation = () =>
    onLocationChange({ region: "Continente", districtId: undefined, countyId: undefined, placeName: undefined })

  const { filteredDistricts, filteredCounties, filteredIrnPlaces } = getFilteredLocations(
    referenceDataProxy.getDistricts(),
    referenceDataProxy.getCounties(),
    irnPlacesProxy.getIrnPlaces({}),
    location,
  )
  const showSelectOnMap = filteredDistricts.length > 1 || filteredCounties.length > 1 || filteredIrnPlaces.length > 1

  return (
    <View style={styles.container}>
      <View style={styles.location}>
        <SegmentedControlTab
          activeTabStyle={styles.activeTabStyle}
          activeTabTextStyle={styles.activeTabTextStyle}
          tabStyle={styles.tabStyle}
          tabTextStyle={styles.tabTextStyle}
          values={allRegions.map(r => regionNames[r])}
          selectedIndex={allRegions.findIndex(r => r === region) || 0}
          onTabPress={onRegionTabPress}
        />
        <View style={styles.locationContainer}>
          <LocationView location={location} onClear={onClearLocation} referenceDataProxy={referenceDataProxy} />
        </View>
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

const styles = EStyleSheet.create({
  container: {
    flexDirection: "column",
    paddingHorizontal: "1rem",
  },
  locationContainer: {
    padding: "0.5rem",
    margin: "1.0rem",
    backgroundColor: "white",
    borderRadius: "0.6rem",
    ...shadow,
  },
  location: {
    margin: "1.0rem",
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
    fontSize: "1.2rem",
  },
  locationText: {
    paddingHorizontal: "2rem",
    paddingVertical: "0.6rem",
    fontSize: "0.8rem",
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
    paddingHorizontal: "0.3rem",
    margin: "0.5rem",
    fontSize: "1rem",
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
    paddingVertical: "0.6rem",
    fontSize: "0.8rem",
    flexWrap: "wrap",
  },
})
