import api from '@/app/services/api/api';
import React, { useState, useEffect } from 'react';


export default function Homme() {

  const [userinfo, setUserInfo] = useState(null);

  const getUserInfo = async () => {
    const res = await api.get('/me')
    setUserInfo(res.data)
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <div className='flex flex-col h-full p-5 '>
      {/* Main Content Section */}
      <div className='flex-1 overflow-auto'>
        {/* Header Section */}
        <div className='text-center'>
          <h1 className='text-5xl font-bold text-gray-900 py-15'>
            Hello {userinfo?.name}
          </h1>
          <p className='text-lg text-gray-600 font-medium max-w-3xl mx-auto'>
            Your hiring journey starts here: Post jobs, review AI-ranked candidates, and hire faster.
          </p>
        </div>

        {/* KPIs Dashboard Section */}
        <div className='w-full flex flex-col items-center space-y-10 mt-10'>
          <div className='flex flex-wrap justify-center gap-6'>
            {/* Recent Applications Card */}
            <div className='bg-white p-8 shadow-xl rounded-2xl w-80 transition transform hover:scale-105 hover:shadow-2xl'>
              <h3 className='text-xl font-semibold text-gray-800 mb-2'>Recent Applications</h3>
              <div className='text-4xl font-bold text-blue-600 mb-2'>75</div>
              <p className='text-gray-500 text-sm'>New applications this week</p>
            </div>

            {/* Current Job Listings Card */}
            <div className='bg-white p-8 shadow-xl rounded-2xl w-80 transition transform hover:scale-105 hover:shadow-2xl'>
              <h3 className='text-xl font-semibold text-gray-800 mb-2'>Current Job Listings</h3>
              <div className='text-4xl font-bold text-blue-600 mb-2'>12</div>
              <p className='text-gray-500 text-sm'>Active job listings</p>
            </div>

            {/* Matching Rate Card */}
            <div className='bg-white p-8 shadow-xl rounded-2xl w-80 transition transform hover:scale-105 hover:shadow-2xl'>
              <h3 className='text-xl font-semibold text-gray-800 mb-2'>Matching Rate</h3>
              <div className='text-4xl font-bold text-blue-600 mb-2'>85%</div>
              <p className='text-gray-500 text-sm'>Candidates matched with jobs</p>
            </div>
          </div>

          {/* Create Job Button Section */}
          <div className='bg-blue-600 text-white p-6 rounded-xl w-full max-w-md text-center mt-10'>
            <p className='text-lg font-semibold mb-4'>
              Want to create a new job listing?
            </p>
            <button className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 cursor-pointer'>
              Create a Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
