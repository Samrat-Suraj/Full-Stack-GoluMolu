import { setSerachText } from '@/redux/authSlice';
import { BadgeCheck, Search } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RightSideBar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { suggestedUser } = useSelector(store => store.auth)
    const [text, setText] = useState("")

    const onClickSearch = () => {
        dispatch(setSerachText(text))
        navigate('/search')
    }

    return (
        <div className='flex-col gap-4 p-6 h-screen w-[280px] hidden lg:flex shadow-xl'>
            <div className='flex items-center border-2 border-gray-300 shadow-sm'>
                <input
                    type="text"
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    className='outline-none w-[90%] p-1 bg-transparent flex-1 text-sm text-gray-800 placeholder-gray-400 transition-all duration-300 ease-in-out rounded-full focus:ring-0 focus:outline-none'
                    placeholder='Search By Username...'
                />
                <Search onClick={onClickSearch} size={10} className='bg-black cursor-pointer text-white h-full w-[30px]' />
            </div>

            <div className='flex justify-between items-center font-bold text-sm text-gray-600'>
                <p className='cursor-pointer hover:text-indigo-600 transition-all duration-200'>Suggested</p>
                <p onClick={() => navigate("/suggested")} className='cursor-pointer hover:text-indigo-600 transition-all duration-200'>All</p>
            </div>


            <div className='flex flex-col gap-4'>
                {suggestedUser && suggestedUser.length > 0 ? (
                    suggestedUser?.slice(0, 4)?.map((item) => (
                        <div key={item?.id} onClick={() => navigate(`/profile/${item?._id}`)} className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:scale-105">

                            <img
                                className='w-full object-cover h-24 rounded-lg transition-transform group-hover:scale-105'
                                src={item?.coverImage ? item?.coverImage : "/cover.jpg"}
                                alt={`Suggested user ${item?.username}`}
                            />

                            <div className='absolute top-3 left-3 space-x-2 text-white font-bold'>
                                <img
                                    className='h-10 w-10 border-2 border-blue-400 rounded-full shadow-md'
                                    src={item?.profilePic || "/placeHolder.png"}
                                    alt={`Profile image of ${item?.username}`}
                                />
                                <div className="flex flex-col">
                                    <div className='flex items-center gap-1'>
                                        <p className='text-sm'>{item?.fullname}</p>
                                        <BadgeCheck className='bg-blue-500 rounded-full' size={14} />
                                    </div>
                                    <p className='text-xs'>@{item?.username}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-gray-600 text-center'>
                        <p>No suggested users available.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RightSideBar;
