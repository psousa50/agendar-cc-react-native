import React from "react"
import { WebView } from "react-native-webview"

const jsCode = `function selectElement(id, valueToSelect) {
  let element = document.getElementById(id)
  element.value = valueToSelect
}

document.getElementById("servico").value = 1
document.getElementById("distrito").value = 12

var evt = document.createEvent("HTMLEvents");
evt.initEvent("change", false, true);
document.getElementById("distrito").dispatchEvent(evt);

document.getElementById("outra_data").checked = true
document.getElementById("data_input_3").value="2019-10-17"

setTimeout(() => document.getElementById("concelho").value = 5, 1000)

setTimeout(() => document.getElementById("btnSeguinte").click(), 3000)

`

export const Test = () => {
  return (
    <WebView
      source={{ uri: "https://agendamento.irn.mj.pt/steps/step1.php" }}
      style={{ marginTop: 20 }}
      injectedJavaScript={jsCode}
      javaScriptEnabled={true}
    />
  )
}
