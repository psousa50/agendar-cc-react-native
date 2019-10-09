import { Button, Text, View } from "native-base"
import React, { useEffect } from "react"
import { StyleSheet } from "react-native"
import { appBackgroundImage } from "../assets/images/images"
import { AppScreenProps } from "../common/AppScreen"
import { AppScreen } from "../common/AppScreenNew"
import { SelectedDateTimeView } from "../components/SelectedDateTimeView"
import { SelectedLocationView } from "../components/SelectedLocationView"
import { SelectIrnServiceView } from "../components/SelectIrnServiceView"
import { useGlobalState } from "../GlobalStateProvider"
import { i18n } from "../localization/i18n"
import { IrnTableFilter, IrnTableRefineFilter } from "../state/models"
import { globalStateSelectors } from "../state/selectors"
import { AppScreenName, navigate } from "./screens"

export const HomeScreen: React.FunctionComponent<AppScreenProps> = props => {
  const [globalState, globalDispatch] = useGlobalState()
  const navigation = navigate(props.navigation)
  const stateSelectors = globalStateSelectors(globalState)

  const irnFilter = stateSelectors.getIrnTablesFilter
  const { serviceId } = irnFilter

  const updateGlobalFilter = (filter: Partial<IrnTableFilter>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER",
      payload: { filter },
    })
  }

  const updateRefineFilter = (filter: Partial<IrnTableRefineFilter>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_REFINE_FILTER",
      payload: { filter },
    })
  }

  useEffect(() => {
    updateGlobalFilter({
      region: "Continente",
      serviceId: 1,
    })
  }, [])

  const onSearch = () => {
    updateRefineFilter({})
    navigation.goTo("IrnTablesResultsScreen")
  }

  const onSelectFilter = (filterScreen: AppScreenName) => () => {
    updateRefineFilter({})
    navigation.goTo(filterScreen)
  }

  const onServiceIdChanged = (newServiceId: number) => {
    updateGlobalFilter({ ...irnFilter, serviceId: newServiceId })
  }

  const renderContent = () => {
    return (
      <View style={styles.container}>
        <InfoCard title={i18n.t("Service")}>
          <SelectIrnServiceView serviceId={serviceId} onServiceIdChanged={onServiceIdChanged} />
        </InfoCard>
        <InfoCard title={i18n.t("Where")}>
          <SelectedLocationView irnFilter={irnFilter} onSelect={onSelectFilter("SelectLocationScreen")} />
        </InfoCard>
        <InfoCard title={i18n.t("When")}>
          <SelectedDateTimeView irnFilter={irnFilter} onSelect={onSelectFilter("SelectDateTimeScreen")} />
        </InfoCard>
        <Button block success onPress={onSearch}>
          <Text>{"Pesquisar Horários"}</Text>
        </Button>
        {/* <Button block danger onPress={clearFilter}>
          <Text>{"Limpar"}</Text>
        </Button> */}
      </View>
    )
  }
  return (
    <AppScreen {...props} backgroundImage={appBackgroundImage}>
      {renderContent()}
    </AppScreen>
  )
}

interface InfoCardProps {
  title: string
}
const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => (
  <>
    <View style={styles.titleBar}>
      <Text style={styles.titleBarText}>{title}</Text>
    </View>
    <View style={styles.infoCard}>
      <View style={styles.infoCardContainer}>{children}</View>
    </View>
  </>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  infoCard: {
    backgroundColor: "transparent",
    marginLeft: 30,
  },
  infoCardContainer: {
    display: "flex",
    margin: 5,
    padding: 5,
    backgroundColor: "white",
  },
  titleBar: {
    backgroundColor: "#3171a8",
    padding: 10,
  },
  titleBarText: {
    color: "white",
    fontSize: 16,
  },
})
