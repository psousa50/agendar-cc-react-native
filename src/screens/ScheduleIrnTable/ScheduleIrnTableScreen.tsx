import React from "react"
import { WebView } from "react-native-webview"
import { useSelector } from "react-redux"
import { IrnTableResult } from "../../irnTables/models"
import { RootState } from "../../state/rootReducer"

const jsCode = (irnTableResult: IrnTableResult) => `

document.getElementById("servico").value = ${irnTableResult.serviceId}
document.getElementById("distrito").value =  ${irnTableResult.districtId}

var evt = document.createEvent("HTMLEvents");
evt.initEvent("change", false, true);
document.getElementById("distrito").dispatchEvent(evt);

document.getElementById("outra_data").checked = true
document.getElementById("data_input_3").value= "${irnTableResult.date}"

setTimeout(() => {
    document.getElementById("concelho").value =  ${irnTableResult.countyId}
    document.getElementById("btnSeguinte").click()
  }, 2000)

`

export const ScheduleIrnTableScreen = () => {
  const irnTableResult = useSelector((state: RootState) => state.irnTablesData.irnTableResult)

  return (
    irnTableResult && (
      <WebView
        source={{ uri: "https://agendamento.irn.mj.pt/steps/step1.php" }}
        style={{ marginTop: 20 }}
        injectedJavaScript={jsCode(irnTableResult)}
        javaScriptEnabled={true}
      />
    )
  )
}
