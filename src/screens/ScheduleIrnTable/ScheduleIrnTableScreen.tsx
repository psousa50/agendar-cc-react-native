import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { fold } from "fp-ts/lib/TaskEither"
import React, { useEffect, useState } from "react"
import WebView from "react-native-webview"
import { useSelector } from "react-redux"
import { fetchIrnTablesScheduleHtml } from "../../api/irnTables"
import { appBackgroundImage } from "../../assets/images/images"
import { AppScreen, AppScreenProps } from "../../components/common/AppScreen"
import { ErrorBox, MessageBox } from "../../components/common/MessageBox"
import { i18n } from "../../localization/i18n"
import { buildIrnPlacesProxy } from "../../state/irnPlacesSlice"
import { RootState } from "../../state/rootReducer"
import { enhancedNavigation } from "../screens"
import { irnSiteInjectedJavascript } from "./irnSiteInjectedJavascript"

export const ScheduleIrnTableScreen: React.FC<AppScreenProps> = props => {
  const navigation = enhancedNavigation(props.navigation)
  const [error, setError] = useState<string | undefined>(undefined)
  const [html, setHtml] = useState<string | undefined>(undefined)

  const { irnTableMatchResult, irnPlacesProxy } = useSelector((state: RootState) => ({
    irnTableMatchResult: state.irnTablesData.irnTableMatchResult,
    irnPlacesProxy: buildIrnPlacesProxy(state.irnPlacesData),
  }))

  const irnTableResult = irnTableMatchResult.irnTableResult
  const irnPlace = irnTableResult && irnPlacesProxy.getIrnPlace(irnTableResult.placeName)

  useEffect(() => {
    const fetchHtml = async () => {
      if (irnTableResult) {
        await pipe(
          fetchIrnTablesScheduleHtml(irnTableResult),
          fold(
            e => {
              setError(e.message)
              return task.of(undefined)
            },
            h => {
              if (h.includes("<title>IRN - Agendamento Online</title>")) {
                setHtml(h)
              } else {
                setError("Invalid page")
              }
              return task.of(undefined)
            },
          ),
        )()
      }
    }

    fetchHtml()
  }, [])

  const goBack = () => {
    navigation.goBack()
  }

  return !error && irnTableResult && irnPlace && html ? (
    <WebView
      source={{ html, baseUrl: "https://agendamento.irn.mj.pt/steps/step2.php" }}
      style={{ marginTop: 20 }}
      injectedJavaScript={irnSiteInjectedJavascript(irnTableResult, irnPlace)}
      javaScriptEnabled={true}
      startInLoadingState={true}
    />
  ) : (
    <AppScreen {...props} backgroundImage={appBackgroundImage} noScroll={true}>
      {error ? (
        <ErrorBox lines={[i18n.t("Schedule.Error1"), i18n.t("Schedule.Error2")]} onOk={goBack} />
      ) : (
        <MessageBox lines={[i18n.t("Schedule.Wait1"), i18n.t("Schedule.Wait2")]} activityIndicator={true} />
      )}
    </AppScreen>
  )
}
