"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { fetchData } from '@utils/utils';
import { Toaster } from 'react-hot-toast';

const Page = () => {
    const { country, capital } = useParams();

  const decodeParam = (param: any) => (Array.isArray(param) ? param.join(' ') : decodeURIComponent(param));

  const decodedCountry = decodeParam(country);
  const decodedCapital = decodeParam(capital);

  const [costOfLivingData, setCostOfLivingData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoring the fetched data from DB/API
  const memoizedFetchData = useMemo(() => fetchData(decodedCountry, decodedCapital), [decodedCountry, decodedCapital]);

  // Getting the memorized data, prevent re-getting
  useEffect(() => {
    const fetchDataFromUtils = async () => {
      try {
        const data = await memoizedFetchData;
        setCostOfLivingData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromUtils();
  }, [memoizedFetchData]);

  console.log(costOfLivingData);

  return (
    <div className='relative'>
      <div className="heading_container">
        <h1 className='head_text sm:pl-10 lg:pl-24 pt-24'>📍 {decodedCountry}, {decodedCapital}</h1>
        {/* // TODO: Add a custom loading... */}
        {loading && <p className='p-24'>Loading...</p>}
        {error && <p className='p-24'>{error}</p>}
        {costOfLivingData && (
          <div>
            {/* TODO: Show here the cost of living data, create a design for it in figma */}
          </div>
        )}
      </div>
      <Toaster />
    </div>
  ); 
};

export default Page;
