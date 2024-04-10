export interface CityResponse {
	total_count: number;
	results: CityDetails[];
}

export type CityDetails = {
	geoname_id: number;
	ascii_name: string;
	cou_name_en: string;
	country_code: string;
	coordinates: {
		lat: number;
		lon: number;
	};
	population: number;
	timezone: string;
};

export interface WeatherResponse {
	coord: {
		lon: number;
		lat: number;
	};
	weather: [
		{
			id: number;
			main: string;
			description: string;
			icon: string;
		}
	];
	base: string;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
		sea_level: number;
		grnd_level: number;
	};
	visibility: number;
	wind: {
		speed: number;
		deg: number;
		gust: number;
	};
	clouds: {
		all: number;
	};
	dt: number;
	sys: {
		country: string;
		sunrise: number;
		sunset: number;
	};
	timezone: number;
	id: number;
	name: string;
	cod: number;
}
