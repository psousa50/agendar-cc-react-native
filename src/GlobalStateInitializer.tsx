import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { chain, fold, map } from "fp-ts/lib/TaskEither"
import { useEffect } from "react"
import { useGlobalState } from "./GlobalStateProvider"
import { Counties, Districts } from "./irnTables/models"
import { fetchCounties, fetchDistricts, fetchIrnPlaces } from "./utils/irnFetch"

const mergeWithCounties = (districts: Districts) =>
  pipe(
    fetchCounties(),
    map(counties => ({ districts, counties })),
  )

const mergeWithPlaces = ({ districts, counties }: { districts: Districts; counties: Counties }) =>
  pipe(
    fetchIrnPlaces(),
    map(irnPlaces => ({ districts, counties, irnPlaces })),
  )

export const GlobalStateInitializer = () => {
  const [, globalDispatch] = useGlobalState()

  useEffect(() => {
    const fetchData = async () => {
      globalDispatch({ type: "STATIC_DATA_FETCH_INIT" })

      const action = pipe(
        fetchDistricts(),
        chain(mergeWithCounties),
        chain(mergeWithPlaces),
        fold(
          error => {
            globalDispatch({ type: "STATIC_DATA_FETCH_FAILURE", payload: { error } })
            return task.of(error)
          },
          staticData => {
            globalDispatch({ type: "STATIC_DATA_FETCH_SUCCESS", payload: staticData })
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
