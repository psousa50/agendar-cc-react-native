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
  const [, globalDispatch] = useGlobalState()

  useEffect(() => {
    const fetchData = async () => {
      globalDispatch({ type: "FETCH_STATIC_DATA_INIT", payload: {} })

      const action = pipe(
        fetchDistricts(),
        chain(mergeWithCounties),
        fold(
          error => {
            globalDispatch({ type: "FETCH_STATIC_DATA_FAILURE", payload: { error } })
            return task.of(error)
          },
          staticData => {
            globalDispatch({ type: "FETCH_STATIC_DATA_SUCCESS", payload: staticData })
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
