import { Body, Card, CardItem, Left, Text, View } from "native-base"
import React from "react"
import { Image, StyleSheet } from "react-native"
import { irnServiceImages } from "../assets/images/images"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTableFilterState } from "../state/models"
import { globalStateSelectors } from "../state/selectors"
import { navigate } from "./screens"

export const SelectIrnServiceScreen: React.FC<AppScreenProps> = props => {
  const navigation = navigate(props.navigation)
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  const updateGlobalFilter = (filter: Partial<IrnTableFilterState>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER",
      payload: { filter: { ...stateSelectors.getIrnTablesFilter, ...filter } },
    })
  }

  const onServiceSelected = (serviceId: number) => {
    updateGlobalFilter({ serviceId })
    navigation.goBack()
  }
  const renderContent = () => {
    return (
      <Card>
        {stateSelectors
          .getIrnServices()
          .sort((s1, s2) => s1.serviceId - s2.serviceId)
          .map(irnService => (
            <CardItem key={irnService.serviceId} button onPress={() => onServiceSelected(irnService.serviceId)}>
              <Left>
                <Image source={irnServiceImages[irnService.serviceId]} style={styles.image} />
                <Body>
                  <View style={styles.textView}>
                    <Text style={styles.text}>{irnService.name}</Text>
                  </View>
                </Body>
              </Left>
            </CardItem>
          ))}
      </Card>
    )
  }

  return <AppScreen {...props} left={null} content={renderContent} title="Selecção de Serviço" showAds={false} />
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
