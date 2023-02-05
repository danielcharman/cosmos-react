import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import planetReducer from '../features/planets/planetSlice';
import buildingReducer from '../features/buildings/buildingSlice';
import researchReducer from '../features/researchs/researchSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		planets: planetReducer,
		buildings: buildingReducer,
		researchs: researchReducer,
	},
});
