import { pipe } from "fp-ts/lib/pipeable"
import { task } from "fp-ts/lib/Task"
import { fold } from "fp-ts/lib/TaskEither"
import { useCallback, useEffect, useReducer } from "react"
import { Action } from "../utils/actions"

interface DataFetchState<T> {
  data: T
  isLoading: boolean
  error: Error | null
}

type FetchDataApiActions<T> =
  | {
      type: "FETCH_INIT"
    }
  | {
      type: "FETCH_SUCCESS"
      payload: { data: T }
    }
  | {
      type: "FETCH_FAILURE"
      payload: { error: Error }
    }

const dataFetchReducer = <T>(state: DataFetchState<T>, action: FetchDataApiActions<T>): DataFetchState<T> => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: null,
        data: action.payload.data,
      }
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      }
  }
}

export const useDataFetch = <T>(fetchAction: Action<void, T>, initialData: T) => {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    data: initialData,
    isLoading: false,
    error: null,
  })

  const fetch = useCallback(() => fetchAction(), [])

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" })

      const action = pipe(
        fetch(),
        fold(
          error => {
            dispatch({ type: "FETCH_FAILURE", payload: { error } })
            return task.of(error)
          },
          data => {
            dispatch({ type: "FETCH_SUCCESS", payload: { data } })
            return task.of(undefined)
          },
        ),
      )

      await action()
    }

    fetchData()
  }, [])

  return { state: state as DataFetchState<T>, fetch }
}
