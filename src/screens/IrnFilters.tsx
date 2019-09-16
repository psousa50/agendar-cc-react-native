import { View } from "native-base"
import { useState } from "react"
import React from "react"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { useGlobalState } from "../state/main"
import { getCounties, getDistricts } from "../state/selectors"
import { properCase } from "../utils/formaters"

export const IrnFiltersScreen: React.FunctionComponent<AppScreenProps> = props => (
  <AppScreen
    {...props}
    left={null}
    content={() => <IrnFiltersContent {...props} />}
    title="Agendar CC"
    showAds={false}
  />
)

const IrnFiltersContent: React.FunctionComponent<AppScreenProps> = () => {
  const [globalState] = useGlobalState()
  const [state] = useState({ text: "" })

  const counties = getCounties(globalState)().map(c => {
    const district = getDistricts(globalState).find(d => d.districtId === c.districtId)!
    const c2 = properCase(c.name)
    const countyName = properCase(district.name) === c2 ? "" : `- ${c2}`
    return { countyId: c.countyId, name: `${district.name}${countyName}` }
  })
  const data = counties.filter(d => d.name.toLocaleLowerCase().includes(state.text.toLocaleLowerCase())).slice(0, 5)

  return <View>{data[0].name}</View>
}
