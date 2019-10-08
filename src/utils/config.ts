export const localDatabase = {
  irnPort: 3000,
  irnUrl: "http://192.168.1.67",
}

export const productionDatabase = {
  irnPort: undefined,
  irnUrl: "https://agendar-cc.herokuapp.com",
}

const database = productionDatabase

const developmentConfig = {
  ...database,
}

const productionConfig = {
  ...database,
}

export const config = __DEV__ ? developmentConfig : productionConfig
