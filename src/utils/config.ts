const developmentConfig = {
  irnPort: 3000,
  irnUrl: "192.168.1.105",
}

const productionConfig = {
  irnPort: 80,
  irnUrl: "https://agendar-cc.herokuapp.com/",
}

export const config = __DEV__ ? developmentConfig : productionConfig
