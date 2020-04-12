import { IrnPlace } from "../../irnTables/models"
import { i18n } from "../../localization/i18n"
import { IrnTableResult } from "../../state/irnTablesSlice"
import { UserDataState } from "../../state/userSlice"
import { replaceAll } from "../../utils/strings"

const messageHtml = (message: string, fontSize: string) =>
  replaceAll(
    `
    <div
      style='
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        align-items: center;
        justify-content: center;
        background-color: rgb(0,0,0);
        background-color: rgba(0,0,0,0.4);'
>
      <div style='background-color: #fefefe;
                  margin: 15% auto;
                  padding: 20px;
                  border: 1px solid #888;
                  width: 80%;
                  text-align: center;
      '>
      <span style='font-size: ${fontSize};'>
        ${message}
      </span>
      </div>
  </div>
`,
    "\n",
    "",
  )

const helperFunctions = () => `
  function replaceAll(s, searchValue, replaceValue) {
    const newString = s.replace(searchValue, replaceValue)
    return newString === s ? newString : replaceAll(newString, searchValue, replaceValue)
  }

  function fix(s) {
    return replaceAll(s, '"', "").normalize().trim()
  }

  function selectValue(select, value) {
    select.value = value
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    select.dispatchEvent(evt);
  }

  function selectValueById(id, value) {
    selectValue(document.getElementById(id), value)
  }

  `

const step1Javascript = ({ districtId, countyId, date }: IrnTableResult) => `

  function modalIsOpen() {
    return document.getElementById("myModal").style.display === "block"
  }

  function waitForModal() {
    return new Promise(function (resolve) {

      const interval = setInterval(function () {
        if (!modalIsOpen()) {
          clearInterval(interval)
          resolve()
        }
      }, 1000);
    })
  }

  var tok = document.getElementsByName("tok")[0].value

  selectValueById("servico", "${1}")
  selectValueById("distrito", "${districtId}")

  var radioData = document.getElementById("outra_data")
  radioData.checked = true
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("change");
  radioData.dispatchEvent(evt);

  setTimeout(async function() {
    document.getElementById("data_input_3").value= "${date}";
    selectValueById("concelho", "${countyId}");

    await waitForModal();

    document.getElementById("btnSeguinte").click();
  }, 1000);

  `

const step2Javascript = (
  { date, tableNumber, timeSlot }: IrnTableResult,
  { name: placeName, address, postalCode, phone }: IrnPlace,
  user: UserDataState,
) => `
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

if (selectFound) {
  document.getElementById("nome").value = "${user.name}"
  document.getElementById("nic").value = "${user.citizenCardNumber}"
  document.getElementById("mail").value = "${user.email}"
  document.getElementById("telefone").value = "${user.phone}"
}
`

export const irnSiteInjectedJavascript = (irnTableResult: IrnTableResult, irnPlace: IrnPlace, user: UserDataState) => `
  try {

    ${helperFunctions()}

    if (document.URL.includes("step1")) {
      ${step1Javascript(irnTableResult)}
      document.body.insertAdjacentHTML("beforeend", "${messageHtml(i18n.t("Schedule.Redirecting2"), "20px")}")
    }

    if (document.URL.includes("step2")) {
      if (document.body) {
        if (document.body.innerHTML.trim().startsWith("<")) {
          ${step2Javascript(irnTableResult, irnPlace, user)}
        } else {
          document.body.innerHTML = "${messageHtml(i18n.t("Schedule.RedirectingError"), "40px")}"
        }
      }
    }

  }
  catch (e) {
    alert(e)
  }

`
