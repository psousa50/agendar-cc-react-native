import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { fold } from "fp-ts/lib/TaskEither"
import { useEffect } from "react"
import { useGlobalState } from "../GlobalStateProvider"
import * as selectors from "../state/selectors"
import { datesEqual } from "../utils/dates"
import { fetchIrnTables } from "../utils/irnFetch"

export const useIrnDataFetch = () => {
  const [globalState, globalDispatch] = useGlobalState()

  console.log("useIrnDataFetch state=====>\n", globalState.irnTablesData)
  useEffect(() => {
    const getIrnTables = async () => {
      globalDispatch({ type: "IRN_TABLES_FETCH_INIT" })

      const fetchIrnTablesData = pipe(
        fetchIrnTables(selectors.getIrnTablesFilter(globalState)),
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

      const filter = selectors.getIrnTablesFilter(globalState)
      const irnTablesCache = selectors.getIrnTablesCache(globalState)
      const lastUsedFilter = selectors.getIrnTablesFilterCache(globalState)
      console.log("irnTablesCache=====>\n", irnTablesCache, filter.selectedDate)
      if (lastUsedFilter && irnTablesCache) {
        const filteredTables = irnTablesCache.filter(
          t => !filter.selectedDate || datesEqual(t.date, filter.selectedDate),
        )
        globalDispatch({ type: "IRN_TABLES_UPDATE", payload: { irnTables: filteredTables } })
        console.log("filteredTables=====>\n", filteredTables)
        return task.of(undefined)
      } else {
        return await fetchIrnTablesData()
      }
    }

    getIrnTables()
  }, [])

  return { irnTablesData: globalState.irnTablesData }
}
