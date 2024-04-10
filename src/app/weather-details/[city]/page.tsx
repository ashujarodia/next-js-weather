'use client';
import { useState } from 'react';
import { useGetWeatherByCityNameQuery } from '@/redux/api/weatherApi';
import Image from 'next/image';
import LazyLoader from '@/components/LazyLoader';

// Function to get the background image based on the weather icon
const getBackgroundImage = (weatherIcon: string) => {
	switch (weatherIcon) {
		// Weather icon cases and their corresponding background images
		case '01d':
			return '/clear-day-sky.jpg';
		case '01n':
			return '/clear-night-sky.webp';
		case '02d':
		case '03d':
		case '04d':
			return '/cloudy-day.jpg';
		case '02n':
		case '03n':
		case '04n':
			return 'cloudy-night.jpg';
		case '09d':
		case '10d':
			return '/rainy-day.jpg';
		case '09n':
		case '10n':
			return '/rainy-night.jpg';
		case '11d':
		case '11n':
			return '/thunderstorm.jpg';
		case '13d':
		case '13n':
			return '/snow.jpg';
		case '50d':
		case '50n':
			return '/mist.jpg';
		default:
			return '/default.jpg';
	}
};

const WeatherDetails = ({ params }: { params: { city: string } }) => {
	const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

	// Fetch weather data for the given city
	const { data, isLoading, refetch } = useGetWeatherByCityNameQuery({ cityName: params.city, units: unit });

	// Display loading spinner if data is still loading
	if (!data && isLoading)
		return (
			<main className='min-h-screen bg-green10 pt-24 px-4'>
				<LazyLoader />
			</main>
		);

	const weatherIcon = data?.weather[0].icon;
	const backgroundImage = getBackgroundImage(weatherIcon!);

	// Function to toggle temperature unit
	const toggleUnit = () => {
		setUnit(unit === 'metric' ? 'imperial' : 'metric');
		refetch();
	};

	return (
		<div
			className='mt-14 p-4 md:p-8' // Adjusted padding for small screens
			style={{
				backgroundImage: `url(/images/${backgroundImage})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
		>
			<h1 className='text-2xl md:text-4xl mb-4 md:mb-6 font-semibold text-center text-white'>{data?.name}</h1> {/* Adjusted font size for small screens */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 bg-opacity-70 rounded-lg bg-green10 p-4 md:p-16 relative'>
				{' '}
				{/* Adjusted grid layout for responsiveness */}
				<div className='flex justify-center mt-4 md:mt-8 absolute right-0 top-0'>
					<button
						className='bg-green40 hover:bg-opacity-80 duration-300 text-white font-bold py-1 md:py-2 px-2 md:px-4 rounded-full mr-2 md:mr-4 text-sm md:text-base' // Adjusted button size and font size for small screens
						onClick={toggleUnit}
					>
						{unit === 'metric' ? 'Change to Imperial' : 'Change to Metric'}
					</button>
				</div>
				{/* Weather Details */}
				<div className='border-b pb-2 md:pb-4'>
					<h2 className='text-xl md:text-2xl mb-2 md:mb-4 font-semibold'>Coordinates</h2>
					<p className='text-md md:text-lg'>Longitude: {data?.coord.lon}</p> {/* Adjusted font size for small screens */}
					<p className='text-md md:text-lg mt-1 md:mt-2'>Latitude: {data?.coord.lat}</p> {/* Adjusted font size for small screens */}
				</div>
				{/* Weather Icon and Description */}
				<div className='border-b pb-2 md:pb-4'>
					<h2 className='text-xl md:text-2xl mb-2 md:mb-4 font-semibold'>Weather</h2>
					<div className='flex items-center'>
						<Image
							src={`http://openweathermap.org/img/w/${weatherIcon}.png`}
							alt={data?.weather[0].description!}
							width={50}
							height={50}
							className='mr-2 md:mr-4'
						/>
						<div>
							<p className='text-md md:text-lg font-semibold'>{data?.weather[0].main}</p> {/* Adjusted font size for small screens */}
							<p className='text-md md:text-lg mt-1 md:mt-2'>{data?.weather[0].description}</p> {/* Adjusted font size for small screens */}
						</div>
					</div>
				</div>
				{/* Temperature Details */}
				<div className='border-b pb-2 md:pb-4'>
					<h2 className='text-xl md:text-2xl mb-2 md:mb-4 font-semibold'>Main</h2>
					<p className='text-md md:text-lg'>
						Temperature: {data?.main.temp!}
						{unit === 'imperial' ? ' °F' : ' °C'}
					</p>
					<p className='text-md md:text-lg mt-1 md:mt-2'>
						Feels Like: {data?.main.feels_like!}
						{unit === 'imperial' ? ' °F' : ' °C'}
					</p>
					<p className='text-md md:text-lg mt-1 md:mt-2'>
						Min Temperature: {data?.main.temp_min!}
						{unit === 'imperial' ? ' °F' : ' °C'}
					</p>
					<p className='text-md md:text-lg mt-1 md:mt-2'>
						Max Temperature: {data?.main.temp_max!}
						{unit === 'imperial' ? ' °F' : ' °C'}
					</p>
				</div>
				{/* Wind Details */}
				<div className='border-b pb-2 md:pb-4'>
					<h2 className='text-xl md:text-2xl mb-2 md:mb-4 font-semibold'>Wind</h2>
					<p className='text-md md:text-lg'>
						Speed: {data?.wind.speed}
						{unit === 'imperial' ? ' miles/hour' : ' metre/sec'}
					</p>
					<p className='text-md md:text-lg mt-1 md:mt-2'>Degree: {data?.wind.deg}°</p>
					<p className='text-md md:text-lg mt-1 md:mt-2'>
						Gust: {data?.wind.gust} {unit === 'imperial' ? ' miles/hour' : ' metre/sec'}
					</p>
				</div>
				{/* Cloud Details */}
				<div className='border-b pb-2 md:pb-4'>
					<h2 className='text-xl md:text-2xl mb-2 md:mb-4 font-semibold'>Clouds</h2>
					<p className='text-md md:text-lg'>All: {data?.clouds.all}%</p>
				</div>
				{/* Additional Information */}
				<div className='border-b pb-2 md:pb-4'>
					<h2 className='text-xl md:text-2xl mb-2 md:mb-4 font-semibold'>Additional Info</h2>
					<p className='text-md md:text-lg'>Base: {data?.base}</p>
					<p className='text-md md:text-lg mt-1 md:mt-2'>Visibility: {data?.visibility} meters</p>
					<p className='text-md md:text-lg mt-1 md:mt-2'>DT: {new Date(data?.dt! * 1000).toLocaleDateString()}</p>
					<p className='text-md md:text-lg mt-1 md:mt-2'>Country: {data?.sys.country}</p>
					<p className='text-md md:text-lg mt-1 md:mt-2'>Sunrise: {new Date(data?.sys.sunrise! * 1000).toLocaleTimeString()}</p>
					<p className='text-md md:text-lg mt-1 md:mt-2'>Sunset: {new Date(data?.sys.sunset! * 1000).toLocaleTimeString()}</p>
					<p className='text-md md:text-lg mt-1 md:mt-2'>Timezone: {data?.timezone}</p>
					<p className='text-md md:text-lg mt-1 md:mt-2'>ID: {data?.id}</p>
					<p className='text-md md:text-lg mt-1 md:mt-2'>COD: {data?.cod}</p>
				</div>
			</div>
		</div>
	);
};

export default WeatherDetails;
