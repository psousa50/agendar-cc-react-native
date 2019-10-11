import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { chain, fold, map } from "fp-ts/lib/TaskEither"
import { useEffect } from "react"
import { useGlobalState } from "./GlobalStateProvider"
import { fetchCounties, fetchDistricts, fetchIrnPlaces, fetchIrnServices } from "./utils/irnFetch"

export const GlobalStateInitializer = () => {
  const [, globalDispatch] = useGlobalState()

  useEffect(() => {
    const fetchData = async () => {
      globalDispatch({ type: "STATIC_DATA_FETCH_INIT" })

      const action = pipe(
        pipe(
          fetchIrnServices(),
          map(irnServices => ({ irnServices })),
        ),
        chain(data =>
          pipe(
            fetchDistricts(),
            map(districts => ({ ...data, districts })),
          ),
        ),
        chain(data =>
          pipe(
            fetchCounties(),
            map(counties => ({ ...data, counties })),
          ),
        ),
        chain(data =>
          pipe(
            fetchIrnPlaces(),
            map(irnPlaces => ({ ...data, irnPlaces })),
          ),
        ),
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
