import { CityResponse } from '@/types/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const citiesApi = createApi({
	reducerPath: 'citiesApi',
	baseQuery: fetchBaseQuery({ baseUrl: 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/' }),
	endpoints: (builder) => ({
		getAllCities: builder.query<CityResponse, { limit: number; offset: number }>({
			query: ({ limit, offset }) => `geonames-all-cities-with-a-population-1000/records?limit=${limit}&offset=${offset}`,
		}),
		getCityByName: builder.query<CityResponse, string>({
			query: (cityName) => `geonames-all-cities-with-a-population-1000/records?where=ascii_name='${cityName}'&limit=5`,
		}),
	}),
});

export const { useGetAllCitiesQuery, useGetCityByNameQuery } = citiesApi;
