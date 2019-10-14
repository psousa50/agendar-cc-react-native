import { Button, Icon, Text, View } from "native-base"
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
import { Counties, County, Districts } from "../../irnTables/models"
import { i18n } from "../../localization/i18n"
import { allRegions, IrnTableFilterLocation, Region, regionNames } from "../../state/models"
import { ReferenceDataProxy } from "../../state/referenceDataSlice"
import { appTheme } from "../../utils/appTheme"
import { getCountyName, properCase } from "../../utils/formaters"
import { LocationView } from "../Home/components/LocationView"

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
  referenceDataProxy: ReferenceDataProxy
  onLocationChange: (location: IrnTableFilterLocation) => void
  onSelectLocationOnMap: () => void
}

const Separator = () => <View style={styles.separator} />

export const SelectLocationView: React.FC<SelectLocationViewProps> = ({
  location,
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
    onLocationChange({ districtId, countyId })
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
      <Button style={{ marginTop: 50 }} block success onPress={selectOnMap}>
        <Icon type={"MaterialIcons"} name="location-on" />
        <Text>{i18n.t("SelectOnMap")}</Text>
      </Button>
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
  },
  locationContainer: {
    padding: "1rem",
  },
  location: {
    backgroundColor: "white",
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
  },
  locationText: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    fontSize: 12,
    backgroundColor: "white",
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#707070",
  },
  icons: {
    justifyContent: "flex-end",
  },
  icon: {
    paddingHorizontal: 5,
    margin: 5,
    fontSize: 14,
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
    paddingVertical: 10,
    fontSize: "0.8rem",
  },
})
