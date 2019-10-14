import { IrnPlaces } from "../irnTables/models"
import { fetchJson } from "../utils/fetch"
import { apiUrl } from "./config"

export const fetchIrnPlaces = () => fetchJson<IrnPlaces>(`${apiUrl}/irnPlaces`)
