import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import researchService from './researchService'

const initialState = {
    researchs: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const getPlanetResearchs = createAsyncThunk('planets/getPlanetResearchs', async(planetId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await researchService.getPlanetResearchs(planetId, token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || 
        error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const upgradePlanetResearch = createAsyncThunk('planets/upgradePlanetResearch', async(data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const {planetId, planetResearchId, level} = data
        return await researchService.upgradePlanetResearch(planetId, planetResearchId, level, token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || 
        error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const researchSlice = createSlice({
    name: 'research',
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
            .addCase(getPlanetResearchs.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getPlanetResearchs.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.researchs = action.payload
            })
            .addCase(getPlanetResearchs.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

            .addCase(upgradePlanetResearch.pending, (state) => {
                state.isLoading = true
            })
            .addCase(upgradePlanetResearch.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(upgradePlanetResearch.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {
    reset, 
} = researchSlice.actions

export default researchSlice.reducer