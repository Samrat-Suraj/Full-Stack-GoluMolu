import { Baby, Heart, Home, LogOut, MessagesSquare, Bell as Notification, Plus, Settings2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSettingsOutline } from "react-icons/io5";
import UploadPostDialog from './UploadPostDialog';
import axios from 'axios';
import { toast } from 'sonner';
import { USER_API_ENDPOINT } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setSuggestedUser, setUser, setUserProfileById } from '@/redux/authSlice';
import { setPostById, setSelectedPost } from '@/redux/postSlice';
import { setNotification } from '@/redux/notificationSlice';
import { setMessages, setOnlineUser } from '@/redux/chatSlice';
import { setAllComment } from '@/redux/commentSlice';
import { setMutalStatus, setMyStatus } from '@/redux/statusSlice';

const LeftSideBar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector(store => store.auth)
    const [open, setOpen] = useState(false)
    const { allNotification } = useSelector(store => store.notification)

    const sideBarItems = [
        { icon: <Home size={20} />, text: "Home" },
        { icon: <Notification size={20} />, text: "Notification" },
        { icon: <MessagesSquare size={20} />, text: "Messages" },
        { icon: <Heart size={20} />, text: "Favorites" },
        { icon: <IoSettingsOutline size={20} />, text: "Setting" },
        { icon: <Baby size={20} />, text: "Your Profile" },
        { icon: <LogOut size={20} />, text: "LogOut" },
    ];

    // Filter notifications for the current user
    const userNotifications = allNotification?.filter(notification => notification?.to?._id === user?._id);
    const notificationCount = userNotifications?.length || 0;

    const LogoutHander = async () => {
        try {
            const res = await axios.post(`${USER_API_ENDPOINT}/logout`, {}, {
                withCredentials: true
            })

            if (res?.data?.success) {
                navigate("/auth")
                toast.success(res?.data?.message)
            }

        } catch (error) {
            toast.success(error?.response?.data?.message)
        }
    }

    const onClickHander = (textType) => {
        if (textType === "Home") {
            navigate("/")
        }
        if (textType === "Your Profile") {
            navigate(`/profile/${user?._id}`)
        }
        if (textType === "Favorites") {
            navigate("/favorites")
        }
        if (textType === "Notification") {
            navigate("/notification")
        }
        if (textType === "Setting") {
            navigate("/setting")
        }
        if (textType === "Messages") {
            navigate("/message")
        } if (textType === "LogOut") {
            LogoutHander()
            dispatch(setUser(null))
            dispatch(setSelectedPost(null))
            dispatch(setAllPost([]))
            dispatch(setSuggestedUser([]))
            dispatch(setUserProfileById(""))
            dispatch(setNotification([]))
            dispatch(setMessages([]))
        }
    }

    return (
        <div>
            <div className='hidden md:flex lg:flex flex-col gap-4 lg:p-6 p-2 h-screen lg:w-[250px] md:w-[60px] shadow-md'>
                <h1 className='text-3xl font-bold text-black hidden lg:flex tracking-wide'>
                    GoluMolu
                </h1>
                {sideBarItems.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => onClickHander(item.text)}
                        className='flex items-center gap-3 relative p-3 cursor-pointer rounded-lg text-black hover:bg-gray-300 transition-all duration-200 ease-in-out'
                    >
                        <p>{item.icon}</p>
                        {
                            item.text === "Notification" && notificationCount > 0 ? 
                                <div className='h-[15px] w-[15px] flex items-center justify-center text-white font-semibold text-[8px] rounded-full left-5 top-2 bg-red-600 absolute'>
                                    {notificationCount}
                                </div> 
                            : null
                        }

                        <span className='text-sm font-semibold hidden lg:flex'>{item.text}</span>
                    </div>
                ))}
                <div className='flex mt-auto'>
                    <div onClick={() => setOpen(true)} className='flex gap-3 cursor-pointer bg-blue-600 items-center p-3 text-white rounded-lg hover:bg-blue-500 transition-all duration-200'>
                        <Plus size={22} />
                        <span className='font-semibold text-[15px] hidden lg:flex'>New Post</span>
                    </div>
                </div>
            </div>

            <div className='lg:hidden md:hidden flex justify-center bg-white p-3 gap-1 sticky  bottom-0 z-10 w-full'>
                {sideBarItems.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => onClickHander(item.text)}
                        className='flex relative items-center gap-3 p-3 cursor-pointer rounded-lg text-black hover:bg-gray-300 transition-all duration-200 ease-in-out'
                    >
                        <p>{item.icon}</p>
                        {
                            item.text === "Notification" && notificationCount > 0 ? 
                                <div className='h-[15px] w-[15px] flex items-center justify-center text-white font-semibold text-[8px] rounded-full left-5 top-2 bg-red-600 absolute'>
                                    {notificationCount}
                                </div> 
                            : null
                        }
                        <span className='text-sm font-semibold hidden lg:flex'>{item.text}</span>
                    </div>
                ))}
                <div className='flex mt-auto'>
                    <div onClick={() => setOpen(true)} className='flex gap-2 cursor-pointer bg-blue-600 items-center p-2 mb-1 text-white rounded-lg hover:bg-blue-500 transition-all duration-200'>
                        <Plus size={20} />
                        <span className='font-semibold text-[15px] hidden lg:flex'>New Post</span>
                    </div>
                </div>
                <UploadPostDialog open={open} setOpen={setOpen} />
            </div>

        </div>
    );
};

export default LeftSideBar;
