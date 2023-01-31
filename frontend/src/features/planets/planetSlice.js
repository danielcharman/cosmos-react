import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import planetService from './planetService'

const initialState = {
    planets: [],
    currentPlanet: {},
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const getAllPlanets = createAsyncThunk('planets/getAllPlanets', async(_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await planetService.getAllPlanets(token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const getUserPlanets = createAsyncThunk('planets/getUserPlanets', async(userId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const userId = thunkAPI.getState().auth.user._id
        return await planetService.getUserPlanets(userId, token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const planetSlice = createSlice({
    name: 'planet',
    initialState: initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        },
        setCurrentPlanet: (state, action) => {
            state.currentPlanet = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserPlanets.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getUserPlanets.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.planets = action.payload
                state.currentPlanet = action.payload[0]
            })
            .addCase(getUserPlanets.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {reset, setCurrentPlanet} = planetSlice.actions
export default planetSlice.reducer