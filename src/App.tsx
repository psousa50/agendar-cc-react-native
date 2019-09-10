import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { chain, fold, map } from "fp-ts/lib/TaskEither"
import { StyleProvider } from "native-base"
import React, { useEffect } from "react"
import { Counties, Districts } from "./irnTables/models"
import { RootNavigator } from "./RootNavigator"
import { GlobalStateProvider, useGlobalState } from "./state/main"
import { getTheme } from "./theme/components"
import { appTheme } from "./utils/appTheme"
import { fetchJson } from "./utils/fetch"

const fetchDistricts = fetchJson<Districts>("http://192.168.1.105:3000/api/v1/districts")
const fetchCountries = fetchJson<Counties>("http://192.168.1.105:3000/api/v1/counties")
const mergeWithCounties = (districts: Districts) =>
  pipe(
    fetchCountries,
    map(counties => ({ districts, counties })),
  )

export const InitGlobalState = () => {
  const [globalState, globalDispatch] = useGlobalState()

  useEffect(() => {
    const fetchData = async () => {
      globalDispatch({ type: "FETCH_STATIC_DATA_INIT", payload: {} })

      const action = pipe(
        fetchDistricts,
        chain(mergeWithCounties),
        fold(
          error => {
            globalDispatch({ type: "FETCH_STATIC_DATA_FAILURE", payload: { error } })
            return task.of(error)
          },
          data => {
            globalDispatch({ type: "FETCH_STATIC_DATA_SUCCESS", payload: data })
            return task.of(undefined)
          },
        ),
      )

      await action()
    }

    fetchData()
  }, [])

  return null
}

export const App = () => (
  <StyleProvider style={getTheme(appTheme)}>
    <GlobalStateProvider>
      <InitGlobalState />
      <RootNavigator />
    </GlobalStateProvider>
  </StyleProvider>
)
