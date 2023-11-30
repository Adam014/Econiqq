"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import fetchCostOfLiving from '@utils/fetchCostOfLiving';
import supabase from '@utils/db/supabaseConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
  const { country, capital } = useParams();

  const decodeParam = (param: any) => (Array.isArray(param) ? param.join(' ') : decodeURIComponent(param));

  const decodedCountry = decodeParam(country);
  const decodedCapital = decodeParam(capital);

  const [costOfLivingData, setCostOfLivingData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if data exists in Supabase
        const { data: supabaseData, error: supabaseError } = await supabase
          .from('CountryAndCapitalCollection') // Replace with your actual Supabase collection name
          .select()
          .eq('country', decodedCountry)
          .eq('capital', decodedCapital);

        if (supabaseError) {
          throw new Error('Error fetching data from Supabase');
        }

        if (supabaseData && supabaseData.length > 0) {
          // Data exists in Supabase, use it
          toast.success('Data loaded from Supabase');
          console.log('Data fetched from Supabase:', supabaseData[0]);
          setCostOfLivingData(supabaseData[0]);
        } else {
          // Data does not exist in Supabase, fetch and save it
          const newData = await fetchCostOfLiving(decodedCountry, decodedCapital);

          // Save data to Supabase
          const { error: saveError } = await supabase
            .from('CountryAndCapitalCollection') // Replace with your actual Supabase collection name
            .upsert([
              {
                country: decodedCountry,
                capital: decodedCapital,
                data: newData,
              },
            ]);

          if (saveError) {
            throw new Error('Error saving data to Supabase');
          }

          // Use the fetched data
          toast.success('Data fetched from API and saved to Supabase');
          console.log('Data saved to Supabase:', newData);
          setCostOfLivingData(newData);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [decodedCountry, decodedCapital]);

  console.log(costOfLivingData);

  return (
    <div className='relative'>
      <div className="heading_container">
        <h1 className='head_text sm:pl-10 lg:pl-24 pt-24'>📍 {decodedCountry}, {decodedCapital}</h1>
        {/* TODO: Show here latest update, date and time, format it into EU date and time */}
        {loading && <p className='p-24'>Loading...</p>}
        {error && <p className='p-24'>{error}</p>}
        {costOfLivingData && (
          <div>
            {/* TODO: Show here the cost of living data, create a design for it in figma */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
