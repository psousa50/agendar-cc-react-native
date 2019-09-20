import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { fold } from "fp-ts/lib/TaskEither"
import { useEffect } from "react"
import { useGlobalState } from "../GlobalStateProvider"
import { getIrnTablesFilter } from "../state/selectors"
import { fetchIrnTables } from "../utils/irnFetch"

export const useIrnDataFetch = () => {
  const [globalState, globalDispatch] = useGlobalState()

  useEffect(() => {
    const fetchData = async () => {
      globalDispatch({ type: "IRN_TABLES_FETCH_INIT" })

      const action = pipe(
        fetchIrnTables(getIrnTablesFilter(globalState)),
        fold(
          error => {
            globalDispatch({ type: "IRN_TABLES_FETCH_FAILURE", payload: { error } })
            return task.of(error)
          },
          irnTables => {
            globalDispatch({ type: "IRN_TABLES_FETCH_SUCCESS", payload: { irnTables } })
            return task.of(undefined)
          },
        ),
      )

      await action()
    }

    fetchData()
  }, [])

  return [globalState, globalDispatch]
}
