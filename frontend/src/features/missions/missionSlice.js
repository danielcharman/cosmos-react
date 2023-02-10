import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import missionService from './missionService'

const initialState = {
    missions: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const getUserMissions = createAsyncThunk('planets/getUserMissions', async(_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const userId = thunkAPI.getState().auth.user._id
        return await missionService.getUserMissions(userId, token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || 
        error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const missionSlice = createSlice({
    name: 'mission',
    initialState: initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserMissions.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getUserMissions.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.missions = action.payload
            })
            .addCase(getUserMissions.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {
    reset, 
} = missionSlice.actions

export default missionSlice.reducer