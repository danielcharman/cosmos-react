import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import planetReducer from '../features/planets/planetSlice';
import buildingReducer from '../features/buildings/buildingSlice';
import technologyReducer from '../features/technologies/technologySlice';
import vehicleReducer from '../features/vehicles/vehicleSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		planets: planetReducer,
		buildings: buildingReducer,
		technologies: technologyReducer,
		vehicles: vehicleReducer,
	},
});
