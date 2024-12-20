import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageNotFoundPage = () => {
    const navigate = useNavigate()
  return (
    <div className='flex h-screen w-screen justify-center items-center bg-gray-100'>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500">404</h1>
        <p className="text-xl text-gray-700 mt-2">Page Not Found</p>
        <p className="text-md text-gray-500 mt-4">Oops! The page you're looking for doesn't exist.</p>
        <a onClick={()=>navigate("/")} className="text-blue-500 cursor-pointer hover:text-blue-700 mt-4 inline-block">Go Back Home</a>
      </div>
    </div>
  );
};

export default PageNotFoundPage;
