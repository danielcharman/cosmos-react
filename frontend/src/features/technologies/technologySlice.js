import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import technologyService from './technologyService'

const initialState = {
    technologies: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const getPlanetTechnologies = createAsyncThunk('planets/getPlanetTechnologies', async(planetId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await technologyService.getPlanetTechnologies(planetId, token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || 
        error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const upgradePlanetTechnology = createAsyncThunk('planets/upgradePlanetTechnology', async(data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const {planetId, planetObjectId, amount} = data
        return await technologyService.upgradePlanetTechnology(planetId, planetObjectId, amount, token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || 
        error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const technologySlice = createSlice({
    name: 'technology',
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
            .addCase(getPlanetTechnologies.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getPlanetTechnologies.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.technologies = action.payload
            })
            .addCase(getPlanetTechnologies.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

            .addCase(upgradePlanetTechnology.pending, (state) => {
                state.isLoading = true
            })
            .addCase(upgradePlanetTechnology.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(upgradePlanetTechnology.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {
    reset, 
} = technologySlice.actions

export default technologySlice.reducer