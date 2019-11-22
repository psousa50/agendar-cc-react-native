import React from "react"
import { irnApi, IrnApi } from "../api/domain"

export interface Environment {
  irnApi: IrnApi
}

export const environment = {
  irnApi,
}

export const EnvironmentContext = React.createContext(environment)
