import { pipe } from "fp-ts/lib/pipeable"
import { chain, map } from "fp-ts/lib/TaskEither"
import { Counties, Districts, IrnServices } from "../irnTables/models"
import { Action } from "../utils/actions"
import { fetchJson } from "../utils/fetch"
import { apiUrl } from "./config"

const fetchIrnServices = () => fetchJson<IrnServices>(`${apiUrl}/irnServices`)
const fetchDistricts = () => fetchJson<Districts>(`${apiUrl}/districts`)
const fetchCounties = () => fetchJson<Counties>(`${apiUrl}/counties`)

export interface FetchReferenceData {
  counties: Counties
  districts: Districts
  irnServices: IrnServices
}
export const fetchReferenceData: Action<void, FetchReferenceData> = () =>
  pipe(
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
  )
