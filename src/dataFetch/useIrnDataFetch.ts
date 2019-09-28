import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { fold } from "fp-ts/lib/TaskEither"
import { useEffect } from "react"
import { useGlobalState } from "../GlobalStateProvider"
import { IrnTableFilterState } from "../state/models"
import { globalStateSelectors } from "../state/selectors"
import { fetchIrnTables } from "../utils/irnFetch"

const filtersAreIncompatible = (filter1: IrnTableFilterState, filter2: IrnTableFilterState) =>
  filter1.countyId !== filter2.countyId || filter1.districtId !== filter2.districtId

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
            globalDispatch({ type: "IRN_TABLES_FETCH_SUCCESS", payload: { irnTables } })
            return task.of(undefined)
          },
        ),
      )

      const filter = stateSelectors.getIrnTablesFilter
      const filterCache = stateSelectors.getIrnTablesFilterCache

      const irnTablesCache = stateSelectors.getIrnTablesCache
      if (!irnTablesCache || !filterCache || filtersAreIncompatible(filter, filterCache)) {
        await fetchIrnTablesData()
      } else {
        globalDispatch({ type: "IRN_TABLES_UPDATE", payload: { irnTables: irnTablesCache } })
      }
    }

    getIrnTables()
  }, [])

  return { irnTablesData: globalState.irnTablesData }
}
