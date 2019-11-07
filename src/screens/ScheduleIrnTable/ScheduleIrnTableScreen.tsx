import React from "react"
import WebView from "react-native-webview"
import { useSelector } from "react-redux"
import { AppScreen, AppScreenProps, leftBackButton } from "../../components/common/AppScreen"
import { i18n } from "../../localization/i18n"
import { buildIrnPlacesProxy } from "../../state/irnPlacesSlice"
import { RootState } from "../../state/rootReducer"
import { irnSiteInjectedJavascript } from "./irnSiteInjectedJavascript"

export const ScheduleIrnTableScreen: React.FC<AppScreenProps> = props => {
  const { irnTableMatchResult, irnPlacesProxy, user } = useSelector((state: RootState) => ({
    irnTableMatchResult: state.irnTablesData.irnTableMatchResult,
    irnPlacesProxy: buildIrnPlacesProxy(state.irnPlacesData),
    user: state.userData,
  }))

  const irnTableResult = irnTableMatchResult.irnTableResult
  const irnPlace = irnTableResult && irnPlacesProxy.getIrnPlace(irnTableResult.placeName)

  return (
    <AppScreen {...props} title={i18n.t("Schedule.Title")} noScroll={true} {...leftBackButton(props.navigation.goBack)}>
      {irnTableResult && irnPlace && (
        <WebView
          source={{ uri: "https://agendamento.irn.mj.pt/steps/step1.php" }}
          style={{ marginTop: 20 }}
          injectedJavaScript={irnSiteInjectedJavascript(irnTableResult, irnPlace, user)}
          javaScriptEnabled={true}
          startInLoadingState={true}
        />
      )}
    </AppScreen>
  )
}
