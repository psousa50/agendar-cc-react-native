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
import { IrnPlace, IrnTableResult } from "../../irnTables/models"
import { i18n } from "../../localization/i18n"
import { buildIrnPlacesProxy } from "../../state/irnPlacesSlice"
import { RootState } from "../../state/rootReducer"

const jsCode = (
  { date, tableNumber, timeSlot }: IrnTableResult,
  { name: placeName, address, postalCode, phone }: IrnPlace,
) => `

  try {

  function replaceAll(s, searchValue, replaceValue) {
    const newString = s.replace(searchValue, replaceValue)
    return newString === s ? newString : replaceAll(newString, searchValue, replaceValue)
  }

  function fix(s) {
    return replaceAll(s, '"', "").normalize().trim()
  }

  var selects = document.getElementsByTagName("select")
  var selectFound;

  for (var i = 0; i < selects.length; i++) {
    var s = selects[i].getAttribute("onChange")

    s = replaceAll(s, "'", '"').replace(");", "")

    var p = s.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || []
    var parts = p.map(fix)

    var date = parts[2]
    var placeName = parts[3]
    var tableNumber = parts[4]
    var address = parts[5]
    var postalCode = parts[6]
    var phone = parts[7]

    var found =
      date === '${date}' &&
      placeName === '${placeName}'.normalize() &&
      tableNumber === '${tableNumber}'.normalize() &&
      address === '${address}'.normalize() &&
      postalCode === '${postalCode}'.normalize() &&
      phone === '${phone}'.normalize()

    if ( found ) {
      selectFound = selects[i];
      break;
    }
  }

  var buttons = document.getElementsByTagName("button")
  for (var i = 0; i < buttons.length; i++) {
    var b = buttons[i]
    var onClick = b.getAttribute("onclick")
    if (onClick && onClick.startsWith("window.history.back")) {
      b.style.display='none'
    }
    if (onClick && onClick.startsWith("window.location.href='../index.php'")) {
      b.style.display='none'
    }
  }

  if (selectFound) {
    selectFound.value = "${timeSlot}"
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    selectFound.dispatchEvent(evt);
  }

  if (!selectFound || selectFound.value !== "${timeSlot}") {
    alert('${i18n.t("Schedule.NotFound")}')
  }

}
catch (e) {
  alert(e)
}


`

export const ScheduleIrnTableScreen: React.FC<AppScreenProps> = props => {
  const [error, setError] = useState<string | undefined>(undefined)
  const [html, setHtml] = useState<string | undefined>(undefined)

  const { irnTableResult, irnPlacesProxy } = useSelector((state: RootState) => ({
    irnTableResult: state.irnTablesData.irnTableResult,
    irnPlacesProxy: buildIrnPlacesProxy(state.irnPlacesData),
  }))

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

  return !error && irnTableResult && irnPlace && html ? (
    <WebView
      source={{ html, baseUrl: "https://agendamento.irn.mj.pt/steps/step2.php" }}
      style={{ marginTop: 20 }}
      injectedJavaScript={jsCode(irnTableResult, irnPlace)}
      javaScriptEnabled={true}
      startInLoadingState={true}
    />
  ) : (
    <AppScreen {...props} backgroundImage={appBackgroundImage}>
      {error ? (
        <ErrorBox lines={[i18n.t("Schedule.Error1"), i18n.t("Schedule.Error2")]} />
      ) : (
        <MessageBox lines={[i18n.t("Schedule.Wait1"), i18n.t("Schedule.Wait2")]} activityIndicator={true} />
      )}
    </AppScreen>
  )
}
