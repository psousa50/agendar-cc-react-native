import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { fold } from "fp-ts/lib/TaskEither"
import React, { useEffect, useState } from "react"
import WebView from "react-native-webview"
import { useSelector } from "react-redux"
import { fetchIrnTablesScheduleHtml } from "../../api/irnTables"
import { ErrorPage } from "../../components/common/ErrorPage"
import { LoadingPage } from "../../components/common/LoadingPage"
import { IrnPlace, IrnTableResult } from "../../irnTables/models"
import { i18n } from "../../localization/i18n"
import { buildIrnPlacesProxy } from "../../state/irnPlacesSlice"
import { RootState } from "../../state/rootReducer"

const jsCode = (
  { date, tableNumber, timeSlot }: IrnTableResult,
  { name: placeName, address, postalCode, phone }: IrnPlace,
) => `

  var selects = document.getElementsByTagName("select")
  var searchText = "'${date}', '${placeName}', '${tableNumber}', '${address}','${postalCode}','${phone}');";
  var selectFound;

  for (var i = 0; i < selects.length; i++) {
    var s = selects[i].getAttribute("onChange")
    var pos = s.indexOf(",", 12)
    if ( s.substring(pos + 2) === searchText) {
      selectFound = selects[i];
      break;
    }
  }

  if (!selectFound) {
    alert('${i18n.t("Schedule.NotFound")}')
  }

  selectFound.value = "${timeSlot}"
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("change", false, true);
  selectFound.dispatchEvent(evt);

  document.getElementsByClassName("btn btn-warning btn-responsive")[0].style.display='none'
`

export const ScheduleIrnTableScreen = () => {
  const [loading, setLoading] = useState<boolean>(true)
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
              setHtml(h)
              return task.of(undefined)
            },
          ),
        )()
      }
    }

    fetchHtml()
    setLoading(false)
  }, [])

  return !error && irnTableResult && irnPlace && html ? (
    <WebView
      source={{ html, baseUrl: "https://agendamento.irn.mj.pt/steps/step2.php" }}
      style={{ marginTop: 20 }}
      injectedJavaScript={jsCode(irnTableResult, irnPlace)}
      javaScriptEnabled={true}
      startInLoadingState={true}
    />
  ) : error ? (
    <ErrorPage errorMessage={error} />
  ) : (
    loading && <LoadingPage />
  )
}
