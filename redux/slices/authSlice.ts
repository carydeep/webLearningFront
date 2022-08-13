import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../models/user'

interface ChangeProfile{
  firstname:string,
  lastname:string
}

interface LoginState {
  currentUser:User|null,
  loading:boolean,
  error:boolean
}

const initialState: LoginState = {
  currentUser:null,
  loading:false,
  error:false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart:(state)=>{
        state.loading = true
    },
    loginSuccess:(state,action)=>{
        state.loading = false
        state.currentUser = action.payload
        state.error = false
    },
    loginFail:(state)=>{
        state.loading = false
        state.error = true
    },
    logoutSuccess:(state)=>{
      state.loading = false
      state.currentUser = null
      state.error = false
    },
    changeProfile:(state,action:PayloadAction<ChangeProfile>)=>{
      const {firstname,lastname} = action.payload
      state.loading = false
      if(state.currentUser){
        state.currentUser.firstname = firstname
        state.currentUser.lastname = lastname
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const { loginStart,loginSuccess,loginFail,logoutSuccess,changeProfile } = authSlice.actions

const {reducer:authReducer} = authSlice
export default authReducer