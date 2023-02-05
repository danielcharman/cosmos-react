import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import vehicleService from './vehicleService'

const initialState = {
    vehicles: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const getPlanetVehicles = createAsyncThunk('planets/getPlanetVehicles', async(planetId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await vehicleService.getPlanetVehicles(planetId, token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || 
        error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const upgradePlanetVehicle = createAsyncThunk('planets/upgradePlanetVehicle', async(data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const {planetId, planetVehicleId, quantity} = data
        return await vehicleService.upgradePlanetVehicle(planetId, planetVehicleId, quantity, token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || 
        error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const vehicleSlice = createSlice({
    name: 'vehicle',
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
            .addCase(getPlanetVehicles.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getPlanetVehicles.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.vehicles = action.payload
            })
            .addCase(getPlanetVehicles.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

        //     .addCase(upgradePlanetVehicle.pending, (state) => {
        //         state.isLoading = true
        //     })
        //     .addCase(upgradePlanetVehicle.fulreducerfilled, (state, action) => {
        //         state.isLoading = false
        //         state.isSuccess = true
        //     })
        //     .addCase(upgradePlanetVehicle.rejected, (state, action) => {
        //         state.isLoading = false
        //         state.isError = true
        //         state.message = action.payload
        //     })
    }
})

export const {
    reset, 
} = vehicleSlice.actions

export default vehicleSlice.reducer