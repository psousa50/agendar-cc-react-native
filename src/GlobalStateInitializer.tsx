import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { chain, fold, map } from "fp-ts/lib/TaskEither"
import { useEffect } from "react"
import { Counties, Districts } from "./irnTables/models"
import { useGlobalState } from "./state/main"
import { debug } from "./utils/debug"
import { fetchCountries, fetchDistricts, fetchIrnTables } from "./utils/irnFetch"

const mergeWithCounties = (districts: Districts) =>
  pipe(
    fetchCountries(),
    map(counties => ({ districts, counties })),
  )

const mergeWithIrnTables = ({ districts, counties }: { districts: Districts; counties: Counties }) =>
  pipe(
    fetchIrnTables({}),
    map(irnTables => ({ districts, counties, irnTables })),
  )

export const GlobalStateInitializer = () => {
  const [globalState, globalDispatch] = useGlobalState()

  useEffect(() => {
    const fetchData = async () => {
      globalDispatch({ type: "FETCH_STATIC_DATA_INIT", payload: {} })

      const action = pipe(
        fetchDistricts(),
        chain(mergeWithCounties),
        chain(mergeWithIrnTables),
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

  debug("globalState=====>", globalState)
  return null
}
