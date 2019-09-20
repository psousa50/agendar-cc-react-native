import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { chain, fold, map } from "fp-ts/lib/TaskEither"
import { useEffect } from "react"
import { useGlobalState } from "./GlobalStateProvider"
import { Districts } from "./irnTables/models"
import { fetchCounties, fetchDistricts } from "./utils/irnFetch"

const mergeWithCounties = (districts: Districts) =>
  pipe(
    fetchCounties(),
    map(counties => ({ districts, counties })),
  )

export const GlobalStateInitializer = () => {
  const [globalState, globalDispatch] = useGlobalState()

  useEffect(() => {
    const fetchData = async () => {
      globalDispatch({ type: "STATIC_DATA_FETCH_INIT" })

      const action = pipe(
        fetchDistricts(),
        chain(mergeWithCounties),
        fold(
          error => {
            console.log("error=====>", error)
            globalDispatch({ type: "STATIC_DATA_FETCH_FAILURE", payload: { error } })
            return task.of(error)
          },
          staticData => {
            console.log("staticData=====>", staticData)
            globalDispatch({ type: "STATIC_DATA_FETCH_SUCCESS", payload: staticData })
            return task.of(undefined)
          },
        ),
      )

      await action()
    }

    fetchData()
  }, [])

  console.log("Global State=====>", globalState.staticData)
  return null
}
