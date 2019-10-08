export const localApi = {
  irnPort: 3000,
  irnUrl: "http://192.168.1.67",
}

export const productionApi = {
  irnPort: undefined,
  irnUrl: "https://agendar-cc.herokuapp.com",
}

const database = localApi

const developmentConfig = {
  ...database,
}

const productionConfig = {
  ...database,
}

export const config = __DEV__ ? developmentConfig : productionConfig
