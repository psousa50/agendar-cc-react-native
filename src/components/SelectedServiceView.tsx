import { Body, Card, CardItem, Left, Text, View } from "native-base"
import React from "react"
import { Image, StyleSheet } from "react-native"
import { irnServiceImages } from "../assets/images/images"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTableFilterState } from "../state/models"
import { globalStateSelectors } from "../state/selectors"

interface SelectedServiceViewProps {
  irnFilter: IrnTableFilterState
  onSelect: () => void
}
export const SelectedServiceView: React.FC<SelectedServiceViewProps> = ({ irnFilter: { serviceId }, onSelect }) => {
  const [globalState] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const irnService = stateSelectors.getIrnService(serviceId)

  return (
    <Card>
      <CardItem header>
        <Text>{"Pretendo..."}</Text>
      </CardItem>
      {irnService ? (
        <CardItem button onPress={onSelect}>
          <Left>
            <Image source={irnServiceImages[irnService.serviceId]} style={styles.image} />
            <Body>
              <View style={styles.textView}>
                <Text style={styles.text}>{irnService.name}</Text>
              </View>
            </Body>
          </Left>
        </CardItem>
      ) : null}
    </Card>
  )
}

const styles = StyleSheet.create({
  image: {
    resizeMode: "contain",
    height: 40,
    width: 40,
  },
  textView: {
    justifyContent: "center",
  },
  text: {
    textAlignVertical: "center",
    fontSize: 14,
  },
})
