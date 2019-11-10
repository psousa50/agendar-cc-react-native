import { createSlice } from "redux-starter-kit"

export interface UserDataState {
  name: string
  citizenCardNumber: string
  email: string
  phone: string
  disclaimerShown: boolean
}

const initialState: UserDataState = {
  name: "",
  citizenCardNumber: "",
  email: "",
  phone: "",
  disclaimerShown: false,
}

const userDataSlice = createSlice({
  slice: "User",
  initialState,
  reducers: {
    setDisclaimerShown(state) {
      state.disclaimerShown = true
    },
  },
})

export const { setDisclaimerShown } = userDataSlice.actions
export const reducer = userDataSlice.reducer
