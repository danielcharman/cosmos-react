import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import planetService from './planetService'

const initialState = {
    planets: [],
    buildings: [],
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

export const getPlanetBuildings = createAsyncThunk('planets/getPlanetBuildings', async(planetId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await planetService.getPlanetBuildings(planetId, token)
    } catch(error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})


export const upgradePlanetBuilding = createAsyncThunk('planets/upgradePlanetBuilding', async(data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        const {planetId, planetBuildingId, level} = data
        // console.log('weee', data)
        return await planetService.upgradePlanetBuilding(planetId, planetBuildingId, level, token)
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
    setCurrentPlanet,
} = planetSlice.actions

export default planetSlice.reducer