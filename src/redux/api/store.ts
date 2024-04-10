import { configureStore } from '@reduxjs/toolkit';
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query';
import { citiesApi } from './citiesApi';
import { weatherApi } from './weatherApi';

export const store = configureStore({
	reducer: {
		[citiesApi.reducerPath]: citiesApi.reducer,
		[weatherApi.reducerPath]: weatherApi.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(citiesApi.middleware, weatherApi.middleware),
});
setupListeners(store.dispatch);
