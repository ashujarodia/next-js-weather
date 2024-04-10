'use client';
import { useGetCityByNameQuery } from '@/redux/api/citiesApi';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Navbar = () => {
	return (
		<nav className='fixed top-0  w-full p-4 backdrop-blur-sm bg-green40 bg-opacity-60 z-50'>
			<div className='flex justify-between'>
				<Link
					href={'/'}
					className='font-bold text-xl text-white '
				>
					Weather App
				</Link>
			</div>
		</nav>
	);
};

export default Navbar;
