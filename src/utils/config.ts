export const localApi = {
  irnPort: 3000,
  irnUrl: "http://192.168.1.67",
}

export const productionApi = {
  irnPort: undefined,
  irnUrl: "https://agendar-cc.herokuapp.com",
}

const developmentConfig = {
  ...localApi,
  ...productionApi,
}

const productionConfig = {
  ...productionApi,
}

export const config = __DEV__ ? developmentConfig : productionConfig
