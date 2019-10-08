import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { fold } from "fp-ts/lib/TaskEither"
import { useEffect } from "react"
import { useGlobalState } from "../GlobalStateProvider"
import { filterIrnTable } from "../irnTables/main"
import { globalStateSelectors } from "../state/selectors"
import { filtersAreCompatible } from "../utils/filters"
import { fetchIrnTables } from "../utils/irnFetch"

export const useIrnDataFetch = () => {
  const [globalState, globalDispatch] = useGlobalState()
  const stateSelectors = globalStateSelectors(globalState)

  useEffect(() => {
    const getIrnTables = async () => {
      globalDispatch({ type: "IRN_TABLES_FETCH_INIT" })

      const fetchIrnTablesData = pipe(
        fetchIrnTables(stateSelectors.getIrnTablesFilter),
        fold(
          error => {
            globalDispatch({ type: "IRN_TABLES_FETCH_FAILURE", payload: { error } })
            return task.of(error)
          },
          irnTables => {
            globalDispatch({
              type: "IRN_TABLES_FETCH_SUCCESS",
              payload: { irnTables: irnTables.map(t => ({ ...t, date: new Date(t.date) })) },
            })
            return task.of(undefined)
          },
        ),
      )

      const filter = stateSelectors.getIrnTablesFilter
      const filterCache = stateSelectors.getIrnTablesFilterCache

      const irnTablesCache = stateSelectors.getIrnTablesCache

      if (!irnTablesCache || !filterCache || !filtersAreCompatible(filterCache, filter)) {
        await fetchIrnTablesData()
      } else {
        globalDispatch({
          type: "IRN_TABLES_UPDATE",
          payload: { irnTables: irnTablesCache.filter(filterIrnTable(filter)), filter },
        })
      }
    }

    getIrnTables()
  }, [])

  return { irnTablesData: globalState.irnTablesData }
}
