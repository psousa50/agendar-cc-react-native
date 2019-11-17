import { Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import WebView from "react-native-webview"
import { useSelector } from "react-redux"
import { AppScreen, AppScreenProps, leftBackButton } from "../../components/common/AppScreen"
import { i18n } from "../../localization/i18n"
import { buildIrnPlacesProxy } from "../../state/irnPlacesSlice"
import { RootState } from "../../state/rootReducer"
import { irnSiteInjectedJavascript } from "./irnSiteInjectedJavascript"

export const ScheduleIrnTableScreen: React.FC<AppScreenProps> = props => {
  const { selectedIrnTableResult, irnPlacesProxy, user } = useSelector((state: RootState) => ({
    selectedIrnTableResult: state.irnTablesData.selectedIrnTableResult,
    irnPlacesProxy: buildIrnPlacesProxy(state.irnPlacesData),
    user: state.userData,
  }))

  const irnPlace = selectedIrnTableResult && irnPlacesProxy.getIrnPlace(selectedIrnTableResult.placeName)

  return (
    <AppScreen {...props} title={i18n.t("Schedule.Title")} noScroll={true} {...leftBackButton(props.navigation.goBack)}>
      {selectedIrnTableResult && irnPlace && (
        <WebView
          source={{ uri: "https://agendamento.irn.mj.pt/steps/step1.php" }}
          style={{ marginTop: 20 }}
          injectedJavaScript={irnSiteInjectedJavascript(selectedIrnTableResult, irnPlace, user)}
          javaScriptEnabled={true}
          startInLoadingState={true}
          renderLoading={Loading}
        />
      )}
    </AppScreen>
  )
}

const Loading = () => (
  <View style={styles.redirecting}>
    <Text>{i18n.t("Schedule.Redirecting1")}</Text>
  </View>
)

const styles = StyleSheet.create({
  redirecting: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
})
