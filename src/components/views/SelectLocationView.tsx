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
import { Counties, County, Districts } from "../../irnTables/models"
import { i18n } from "../../localization/i18n"
import { IrnTableFilterLocation, ReferenceData, Region } from "../../state/models"
import { getCountyName, properCase } from "../../utils/formaters"

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
  referenceData: ReferenceData
  onLocationChange: (location: IrnTableFilterLocation) => void
  onSelectOnMap: () => void
}

const Separator = () => <View style={styles.separator} />

export const SelectLocationView: React.FC<SelectLocationViewProps> = ({
  location,
  referenceData,
  onLocationChange,
  onSelectOnMap: selectOnMap,
}) => {
  const initialState: SelectLocationViewState = {
    locationText: "",
    hideSearchResults: false,
  }
  const [state, setState] = useState(initialState)
  const mergeState = (newState: Partial<SelectLocationViewState>) =>
    setState(oldState => ({ ...oldState, ...newState }))

  const districts = referenceData.getDistricts()
  const counties = referenceData.getCounties()
  const searchableCounties = useMemo(() => buildSearchableCounties(counties, districts), [counties, districts])

  const listItems =
    state.locationText.length > 1
      ? searchableCounties
          .filter(
            sc =>
              (isNil(location.region) || sc.region === location.region) &&
              sc.searchText.toLocaleLowerCase().includes(state.locationText.toLocaleLowerCase()),
          )
          .slice(0, 5)
      : []

  const onListItemPressed = (districtId: number, countyId?: number) => {
    const district = referenceData.getDistrict(districtId)
    const irnPlaces = referenceData.getIrnPlaces({ districtId, countyId })
    const placeName = irnPlaces.length === 1 ? irnPlaces[0].name : undefined
    onLocationChange({
      region: district && district.region,
      countyId,
      districtId,
      placeName,
    })
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

  const searchableCounty = searchableCounties.find(
    sc => sc.districtId === location.districtId && sc.countyId === location.countyId,
  )
  const countyName = searchableCounty && searchableCounty.searchText

  return (
    <View style={styles.container}>
      <View style={styles.chosenTextContainer}>
        <Text style={styles.chosenText}>{countyName}</Text>
        <Text style={[styles.chosenText, styles.placeNameText]}>{location.placeName}</Text>
      </View>
      <View style={styles.locationInputContainer}>
        <TextInput
          style={styles.locationInput}
          placeholder="Distrito - Concelho"
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
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
  chosenTextContainer: {
    backgroundColor: "white",
  },
  chosenText: {
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "white",
  },
  placeNameText: {
    fontSize: 14,
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
})
