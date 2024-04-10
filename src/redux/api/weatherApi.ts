import { WeatherResponse } from '@/types/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const key = '84a00489cb64bbde713845ada265ef73';
export const weatherApi = createApi({
	reducerPath: 'weatherApi',
	baseQuery: fetchBaseQuery({ baseUrl: `https://api.openweathermap.org/data/2.5/weather` }),
	endpoints: (builder) => ({
		getWeatherByCityName: builder.query<
			WeatherResponse,
			{
				cityName: string;
				units: string;
			}
		>({
			query: ({ cityName, units }) => `?q=${cityName}&appid=${key}&units=${units}`,
		}),
	}),
});

export const { useGetWeatherByCityNameQuery } = weatherApi;
