'use client';
import { useEffect, useState } from 'react';
import { useGetAllCitiesQuery, useGetCityByNameQuery } from '@/redux/api/citiesApi';
import { CityDetails } from '@/types/types';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LazyLoader from '@/components/LazyLoader';

export default function Home() {
	// State for pagination
	const [page, setPage] = useState<number>(1);

	// State for search query
	const [searchQuery, setSearchQuery] = useState<string>('');

	// State for sorting configuration
	const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({ key: '', direction: 'ascending' });

	// State for storing filtered cities
	const [filteredCities, setFilteredCities] = useState<CityDetails[]>([]);

	// State for current location
	const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

	// Next.js router
	const router = useRouter();

	// Pagination constants
	const limit = 20;
	const offset = page * limit - limit;

	// Query to fetch all cities
	const { data, isLoading, isFetching, isError, refetch } = useGetAllCitiesQuery({ limit, offset });

	// Query to fetch city by name
	const { data: cityData, refetch: cityNameReFetch } = useGetCityByNameQuery(searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1));

	// Add fetched cities to filteredCities state
	useEffect(() => {
		if (data?.results) {
			setFilteredCities((prevCities) => [...prevCities, ...data.results]);
		}
	}, [data]);

	// Handle infinite scroll
	useEffect(() => {
		const handleScroll = () => {
			if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 20 && !isFetching && filteredCities.length < data?.total_count!) {
				setPage((prevPage) => prevPage + 1);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [filteredCities, isFetching, data]);

	// Refetch data when user reaches at bottom
	useEffect(() => {
		if (page > 1) {
			refetch();
		}
	}, [page, refetch]);

	// Get current location
	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setCurrentLocation({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					});
				},
				(error) => {
					console.error('Error getting location:', error);
				}
			);
		} else {
			console.error('Geolocation is not supported by this browser.');
		}
	}, []);

	// Fetch city name by latitude and longitude
	const getCityNameByLatLon = async (lat: number, lon: number) => {
		try {
			const API_KEY = '41c8afedd6894920b0b2055389bb2235';
			const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${API_KEY}`);

			if (response.data.results && response.data.results.length > 0) {
				const city = response.data.results[0].components.city;
				return city;
			}

			return null;
		} catch (error) {
			console.error('Error fetching city name:', error);
			return null;
		}
	};

	// Handle getting current weather
	const handleGetCurrentWeather = async () => {
		if (currentLocation) {
			const { latitude, longitude } = currentLocation;
			const cityName = await getCityNameByLatLon(latitude, longitude);

			if (cityName) {
				const url = `/weather-details/${cityName}`;
				router.push(url);
			} else {
				console.error('City name not found.');
			}
		}
	};

	// Handle sorting
	const requestSort = (key: string) => {
		let direction: 'ascending' | 'descending' = 'ascending';
		if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });

		const sortedCities = [...filteredCities].sort((a: any, b: any) => {
			if (direction === 'ascending') {
				return a[key] > b[key] ? 1 : -1;
			} else {
				return a[key] < b[key] ? 1 : -1;
			}
		});

		setFilteredCities(sortedCities);
	};

	// Get class names for sorting
	const getClassNamesFor = (name: string) => {
		if (!sortConfig) {
			return;
		}
		return sortConfig.key === name ? sortConfig.direction : undefined;
	};

	// Debounce city name fetching
	useEffect(() => {
		const timer = setTimeout(() => {
			if (searchQuery && searchQuery.length >= 3) {
				cityNameReFetch();
			}
		}, 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [searchQuery, cityNameReFetch]);

	// Render city search suggestions
	const renderSuggestions = () => {
		if (searchQuery.length >= 3 && cityData?.results && cityData?.results?.length! > 0) {
			return (
				<ul className='absolute z-10 max-w-96 top-12 bg-white border rounded-md shadow-lg sm:w-full'>
					{cityData.results.map((result: any) => (
						<Link
							href={`weather-details/${result.ascii_name}`}
							key={result.geoname_id}
						>
							<li
								className='px-4 py-2 hover:bg-gray-100'
								onClick={() => setSearchQuery(result.ascii_name)}
							>
								{result.ascii_name}, {result.country_code}
							</li>
						</Link>
					))}
				</ul>
			);
		}
		return null;
	};

	// Render loading state
	if (isLoading && filteredCities?.length === 0) {
		return (
			<main className='min-h-screen bg-green10 pt-24 px-4'>
				<LazyLoader />
			</main>
		);
	}

	// Render error state
	if (isError) {
		return (
			<main className='min-h-screen bg-green10 pt-16 px-4'>
				<div className='text-center font-bold text-2xl text-red-500'>Error fetching data</div>
			</main>
		);
	}

	// Render main content
	return (
		<main className='min-h-screen pt-24 px-4 bg-green10 '>
			<div className='relative max-w-[1320px] mx-auto'>
				<h1 className='text-center font-bold text-2xl text-green40 sm:text-3xl'>All Cities</h1>
				<p className='text-center text-sm mt-2 sm:text-base'>*Click on any city to get weather for that city</p>
				<div className='mt-4 w-full relative'>
					<div className='flex flex-col sm:flex-row items-center justify-between relative'>
						<input
							type='text'
							className='w-full sm:w-96 p-2 mb-2 border-b border-b-green40 bg-transparent focus:outline-none '
							placeholder='🔍 Enter city name'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						{renderSuggestions()}
						<button
							className='mt-2 sm:mt-0 bg-green40 text-white px-4 py-2 rounded hover:bg-green50'
							onClick={handleGetCurrentWeather}
							disabled={!currentLocation}
						>
							Get Weather for Current Location
						</button>
					</div>
				</div>
				<div className='mt-2 w-full overflow-x-auto'>
					<table className='mx-auto w-full'>
						<thead>
							<tr className='bg-green40 text-white text-left'>
								<th
									className='border border-gray-400 px-3 py-2 cursor-pointer'
									onClick={() => requestSort('ascii_name')}
								>
									City
									{getClassNamesFor('ascii_name') === 'ascending' ? ' ↑' : ' ↓'}
								</th>
								<th
									className='border border-gray-400 px-3 py-2 cursor-pointer'
									onClick={() => requestSort('cou_name_en')}
								>
									Country
									{getClassNamesFor('cou_name_en') === 'ascending' ? ' ↑' : ' ↓'}
								</th>
								<th
									className='border border-gray-400 px-3 py-2 cursor-pointer'
									onClick={() => requestSort('population')}
								>
									Population
									{getClassNamesFor('population') === 'ascending' ? ' ↑' : ' ↓'}
								</th>
								<th
									className='border border-gray-400 px-3 py-2 cursor-pointer'
									onClick={() => requestSort('timezone')}
								>
									Timezone
									{getClassNamesFor('timezone') === 'ascending' ? ' ↑' : ' ↓'}
								</th>
								<th
									className='border border-gray-400 px-3 py-2 cursor-pointer'
									onClick={() => requestSort('country_code')}
								>
									Country Code
									{getClassNamesFor('country_code') === 'ascending' ? ' ↑' : ' ↓'}
								</th>
								<th className='border border-gray-400 px-3 py-2'>Coordinates</th>
							</tr>
						</thead>
						<tbody>
							{filteredCities?.map((city) => (
								<tr
									key={city.geoname_id}
									className='bg-green-50'
								>
									<td className='border border-gray-400 px-3 py-2'>
										<Link href={`/weather-details/${city.ascii_name}`}>{city.ascii_name}</Link>
									</td>
									<td className='border border-gray-400 px-3 py-2'>{city.cou_name_en}</td>
									<td className='border border-gray-400 px-3 py-2'>{city.population}</td>
									<td className='border border-gray-400 px-3 py-2'>{city.timezone}</td>
									<td className='border border-gray-400 px-3 py-2'>{city.country_code}</td>
									<td className='border border-gray-400 px-3 py-2'>
										{city.coordinates.lat} , {city.coordinates.lon}
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{isFetching && <div className='text-center mt-4 text-green40 font-semibold'>Fetching more cities...</div>}
				</div>
			</div>
		</main>
	);
}
