import Geolocation from "@react-native-community/geolocation"
import { Icon, Text, View } from "native-base"
import React from "react"
import { useEffect, useMemo, useState } from "react"
import { FlatList, ListRenderItemInfo, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { ButtonIcons } from "../common/ToolbarIcons"
import { useGlobalState } from "../GlobalStateProvider"
import { Counties, Districts, GpsLocation } from "../irnTables/models"
import { getCounty, getDistrict } from "../state/selectors"
import { getCountyName, properCase } from "../utils/formaters"
import { getClosestCounty } from "../utils/location"

interface SearchableCounty {
  countyId?: number
  districtId: number
  key: string
  searchText: string
}
const buildSearchableCounties = (counties: Counties, districts: Districts): SearchableCounty[] =>
  counties.map(county => {
    const district = districts.find(d => d.districtId === county.districtId)!
    const searchText = getCountyName(county, district)
    return {
      countyId: properCase(county.name) === properCase(district.name) ? undefined : county.countyId,
      districtId: county.districtId,
      key: searchText,
      searchText,
    }
  })

export const IrnLocationFilterScreen: React.FunctionComponent<AppScreenProps> = props => {
  const [globalState, globalDispatch] = useGlobalState()
  const [filter, setFilter] = useState(globalState.filter)
  const updateGlobalFilter = () => {
    globalDispatch({
      type: "SET_FILTER",
      payload: { filter },
    })
    props.navigation.goBack()
  }

  const [locationText, setLocationText] = useState("")
  const [position, setPosition] = useState(null as GpsLocation | null)

  const { counties, districts } = globalState.staticData
  const searchableCounties = useMemo(() => buildSearchableCounties(counties, districts), [counties, districts])

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      pos => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      },
      () => setPosition(null),
    )
  }

  useEffect(() => {
    getCurrentPosition()
  }, [])

  const data =
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
    setFilter({ countyId, districtId })
    const district = getDistrict(globalState)(districtId)
    const county = getCounty(globalState)(countyId)
    setLocationText(getCountyName(county, district))
  }

  const renderContent = () => {
    return (
      <View>
        <TextInput
          placeholder="Distrito - Concelho"
          value={locationText}
          onChangeText={text => setLocationText(text)}
        ></TextInput>
        <View style={styles.currentLocation}>
          <Icon style={styles.currentLocationIcon} type="FontAwesome" name="location-arrow" />
          <Text onPress={setCurrentLocation} style={styles.currentLocationText}>
            Localização actual
          </Text>
        </View>
        {data.length !== 1 || data[0].searchText.toLocaleLowerCase() !== locationText.toLocaleLowerCase() ? (
          <FlatList data={data} renderItem={renderItem} ItemSeparatorComponent={Separator} />
        ) : null}
      </View>
    )
  }

  return (
    <AppScreen
      {...props}
      content={() => renderContent()}
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
