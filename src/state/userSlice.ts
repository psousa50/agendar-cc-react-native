import { createSlice } from "redux-starter-kit"

export interface UserDataState {
  name: string
  citizenCardNumber: string
  email: string
  phone: string
}

const initialState: UserDataState = {
  name: "",
  citizenCardNumber: "",
  email: "",
  phone: "",
}

const referenceDataSlice = createSlice({
  slice: "User",
  initialState,
  reducers: {},
})

export const reducer = referenceDataSlice.reducer
