import { Icon, Text, View } from "native-base"
import React, { useEffect, useState } from "react"
import { FlatList, ListRenderItemInfo, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import { appTheme } from "../../utils/appTheme"
import { responsiveFontScale as rfs, responsiveScale as rs } from "../../utils/responsive"

export interface SearchableItem {
  searchText: string
  displayText: string
  key: string
}

interface SearchableTextInputLocationProps {
  fontSize: number
  initialText?: string
  placeHolder: string
  fetchItems: (text: string) => SearchableItem[]
  onClear: () => void
  onItemPressed: (item: SearchableItem) => void
  onSelectOnMap?: () => void
  onUseGpsLocation?: () => void
}

interface SearchableTextInputLocationState {
  text: string
  hideUntilChanged: boolean
}

export const SearchableTextInputLocation: React.FC<SearchableTextInputLocationProps> = ({
  fontSize,
  initialText,
  placeHolder,
  fetchItems,
  onClear,
  onItemPressed,
  onSelectOnMap,
  onUseGpsLocation,
}) => {
  const initialState: SearchableTextInputLocationState = {
    text: initialText || "",
    hideUntilChanged: true,
  }
  const [state, setState] = useState(initialState)
  const mergeState = (newState: Partial<SearchableTextInputLocationState>) =>
    setState(oldState => ({ ...oldState, ...newState }))

  useEffect(() => {
    mergeState({ text: initialText || "" })
  }, [initialText])

  const changeText = (text: string) => {
    mergeState({ text, hideUntilChanged: false })
  }
  const clearText = () => {
    mergeState({ text: "" })
    onClear()
  }

  const hideList = () => {
    mergeState({ hideUntilChanged: true })
  }

  const listItems = state.text.length > 0 ? fetchItems(state.text).slice(0, 20) : []

  const onListItemPressed = (item: SearchableItem) => {
    onItemPressed(item)
    mergeState({ text: item.displayText, hideUntilChanged: true })
  }
  const renderItem = ({ item }: ListRenderItemInfo<SearchableItem>) => (
    <TouchableOpacity onPress={() => onListItemPressed(item)}>
      <Text key={item.key} style={styles.locationText}>
        {item.displayText}
      </Text>
    </TouchableOpacity>
  )
  return (
    <View style={styles.container}>
      <View style={styles.locationInputContainer}>
        <TextInput
          style={[styles.locationInput, { fontSize }]}
          placeholder={placeHolder}
          value={state.text}
          onChangeText={changeText}
          multiline={true}
          autoCapitalize={"none"}
          onBlur={hideList}
        />
        <View style={styles.icons}>
          <TouchableOpacity onPress={onUseGpsLocation}>
            <Icon style={styles.icon} type={"MaterialIcons"} name={"my-location"} />
          </TouchableOpacity>
          <TouchableOpacity disabled={!onSelectOnMap} onPress={onSelectOnMap}>
            <Icon style={styles.icon} type="MaterialIcons" name={"location-on"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={clearText}>
            <Icon style={styles.icon} name={"close"} />
          </TouchableOpacity>
        </View>
      </View>
      {!state.hideUntilChanged && listItems.length > 0 ? (
        <View style={{ height: rs(200) }}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={listItems}
            renderItem={renderItem}
            ItemSeparatorComponent={Separator}
          />
        </View>
      ) : null}
    </View>
  )
}

const Separator = () => <View style={styles.separator} />

const styles = StyleSheet.create({
  container: {
    marginTop: rs(6),
    flexDirection: "column",
    paddingHorizontal: rs(12),
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
    fontSize: rfs(15),
    marginHorizontal: rs(20),
    marginVertical: rs(10),
  },
  locationText: {
    paddingHorizontal: rs(16),
    paddingVertical: rs(7),
    fontSize: rfs(10),
    backgroundColor: "white",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  icon: {
    paddingHorizontal: rs(3),
    margin: rs(6),
    fontSize: rfs(12),
    color: appTheme.secondaryTextDimmed,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#707070",
  },
})