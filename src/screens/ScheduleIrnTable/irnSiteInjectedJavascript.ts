import { IrnPlace, IrnTableResult } from "../../irnTables/models"
import { i18n } from "../../localization/i18n"

export const irnSiteInjectedJavascript = (
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
