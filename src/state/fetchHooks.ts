import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { fold } from "fp-ts/lib/TaskEither"
import { useContext, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { EnvironmentContext } from "../environment/main"
import { currentUtcDateString } from "../utils/dates"
import { initIrnPlacesFetch, irnPlacesFetchHasAnError, irnPlacesFetchWasSuccessful } from "./irnPlacesSlice"
import {
  initIrnTableMatchResultFetch,
  irnTableMatchResultFetchHasAnError,
  irnTableMatchResultFetchWasSuccessful,
} from "./irnTablesSlice"
import { buildReferenceDataProxy, fetchHasAnError, fetchWasSuccessful, initFetch } from "./referenceDataSlice"
import { RootState } from "./rootReducer"

export const useFetchReferenceData = () => {
  const { irnApi } = useContext(EnvironmentContext)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetch = async () => {
      dispatch(initFetch())
      await pipe(
        irnApi.fetchReferenceData(),
        fold(
          error => {
            dispatch(fetchHasAnError(error.message))
            return task.of(undefined)
          },
          referenceData => {
            dispatch(fetchWasSuccessful(referenceData))
            return task.of(undefined)
          },
        ),
      )()
    }

    fetch()
  }, [])

  const referenceDataProxy = useSelector((state: RootState) => buildReferenceDataProxy(state.referenceData))

  return { referenceDataProxy }
}

export const useFetchIrnPlaces = () => {
  const { irnApi } = useContext(EnvironmentContext)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetch = async () => {
      dispatch(initIrnPlacesFetch())
      await pipe(
        irnApi.fetchIrnPlaces(),
        fold(
          error => {
            dispatch(irnPlacesFetchHasAnError(error.message))
            return task.of(undefined)
          },
          irnPlaces => {
            dispatch(irnPlacesFetchWasSuccessful(irnPlaces))
            return task.of(undefined)
          },
        ),
      )()
    }

    fetch()
  }, [])
}

export const useFetchIrnTableMatch = () => {
  const { irnApi } = useContext(EnvironmentContext)
  const dispatch = useDispatch()
  const { filter, refineFilter } = useSelector((state: RootState) => state.irnTablesData)

  useEffect(() => {
    const fetch = async () => {
      dispatch(initIrnTableMatchResultFetch())
      await pipe(
        irnApi.fetchIrnTableMatch({
          ...filter,
          selected: refineFilter,
          startDate: filter.startDate || currentUtcDateString(),
        }),
        fold(
          error => {
            dispatch(irnTableMatchResultFetchHasAnError(error.message))
            return task.of(undefined)
          },
          irnTableMatchResult => {
            dispatch(irnTableMatchResultFetchWasSuccessful({ irnTableMatchResult }))
            return task.of(undefined)
          },
        ),
      )()
    }

    fetch()
  }, [filter, refineFilter])

  return useSelector((state: RootState) => ({
    irnTableMatchResult: state.irnTablesData.irnTableMatchResult,
    refineFilter: state.irnTablesData.refineFilter,
    loading: state.irnTablesData.loading || state.referenceData.loading || state.irnPlacesData.loading,
    error: state.irnTablesData.error,
  }))
}
