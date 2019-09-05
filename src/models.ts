type Time = string

export type TimeSlot = {
  date: Date
  hours: readonly Time[]
}

export type IrnService = {
  serviceId: number
  serviceName: string
}
export type IrnServices = IrnService[]

export type District = {
  districtId: number
  districtName: string
}
export type Districts = District[]

export type County = {
  districtId: number
  countyId: number
  countyName: string
}
export type Counties = County[]

export type IrnRepositoryTable = {
  serviceId: number
  county: County
  locationName: string
  tableNumber: string
  address: string
  postalCode: string
  phone: string
  date: Date
  times: Time[]
}
export type IrnRepositoryTables = IrnRepositoryTable[]
