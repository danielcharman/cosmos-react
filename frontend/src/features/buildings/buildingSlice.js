import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import buildingService from './buildingService'

const initialState = {
    buildings: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const getPlanetBuildings = createAsyncThunk('planets/getPlanetBuildings', async(planetId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await buildingService.getPlanetBuildings(planetId, token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || 
        error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const upgradePlanetBuilding = createAsyncThunk('planets/upgradePlanetBuilding', async(data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const {planetId, planetObjectId, amount} = data
        return await buildingService.upgradePlanetBuilding(planetId, planetObjectId, amount, token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || 
        error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const buildingSlice = createSlice({
    name: 'building',
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
            .addCase(getPlanetBuildings.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getPlanetBuildings.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.buildings = action.payload
            })
            .addCase(getPlanetBuildings.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

            .addCase(upgradePlanetBuilding.pending, (state) => {
                state.isLoading = true
            })
            .addCase(upgradePlanetBuilding.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(upgradePlanetBuilding.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {
    reset, 
} = buildingSlice.actions

export default buildingSlice.reducer