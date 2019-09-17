import Geolocation from "@react-native-community/geolocation"
import { Button, Icon, Text, View } from "native-base"
import { useEffect, useMemo, useState } from "react"
import React from "react"
import { FlatList, ListRenderItemInfo, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { useGlobalState } from "../GlobalStateProvider"
import { Counties, Districts, GpsLocation } from "../irnTables/models"
import { properCase } from "../utils/formaters"
import { getClosestCounty } from "../utils/location"

export const IrnLocationFilterScreen: React.FunctionComponent<AppScreenProps> = props => (
  <AppScreen
    {...props}
    left={null}
    content={() => <IrnLocationFilterContent {...props} />}
    title="Agendar CC"
    showAds={false}
  />
)

interface SearchableCounty {
  countyId?: number
  districtId: number
  key: string
  searchText: string
}
const buildSearchableCounties = (counties: Counties, districts: Districts): SearchableCounty[] =>
  counties.map(c => {
    const district = districts.find(d => d.districtId === c.districtId)!
    const countyName = properCase(c.name)
    const districtName = properCase(district.name)
    const countyNamePart = districtName === countyName ? "" : ` - ${countyName}`
    const searchText = `${district.name}${countyNamePart}`
    return {
      countyId: districtName === countyName ? undefined : c.countyId,
      districtId: c.districtId,
      key: searchText,
      searchText,
    }
  })

const IrnLocationFilterContent: React.FunctionComponent<AppScreenProps> = () => {
  const [globalState, globalDispatch] = useGlobalState()
  const [filter, setFilter] = useState(globalState.filter)
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
  }

  const updateGlobalFilter = () => {
    globalDispatch({
      type: "SET_FILTER",
      payload: { filter },
    })
  }

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
      <FlatList data={data} renderItem={renderItem} ItemSeparatorComponent={Separator} />
      <Text>{globalState.filter.districtId}</Text>
      <Text>{globalState.filter.countyId}</Text>
      <Text>{JSON.stringify(filter)}</Text>
      <Text>{JSON.stringify(globalState.filter)}</Text>
      <Button onPress={updateGlobalFilter}>
        <Text>{"Ok"}</Text>
      </Button>
    </View>
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
