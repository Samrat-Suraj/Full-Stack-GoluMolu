import { ArrowLeft, MessageCircle, Pen, SwitchCameraIcon, Facebook, Instagram, Twitter, ThumbsUp, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import EditProfileDialog from './EditProfileDialog';
import axios from 'axios';
import { USER_API_ENDPOINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import useGetUserProfile from '@/hooks/useGetUserProfile';

const UserProfile = () => {
    const params = useParams()
    useGetUserProfile(params.id)
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { user, userProfileById, bookmarks } = useSelector(store => store.auth)
    const [activeTab, setActiveTab] = useState('my-post');
    const [coverImage, setCoverImage] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [loading, setLoading] = useState(false)

    const getPostDataAndSavePost = activeTab === "my-post" ? userProfileById?.posts : userProfileById?.bookmarks
    const isfollowing = user?.following?.includes(userProfileById?._id)

    const handleCoverImageChange = (e) => {
        setCoverImage(e.target.files[0]);
    };

    const handleProfileImageChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const updateProImgAndCover = async () => {
        const form = new FormData();

        if (coverImage) {
            form.append("coverImage", coverImage);
        }
        if (profileImage) {
            form.append("profilePic", profileImage);
        }

        try {
            setLoading(true)
            const res = await axios.post(`${USER_API_ENDPOINT}/update`, form, {
                withCredentials: true
            });
            console.log(res)
            if (res?.data?.success) {
                dispatch(setUser(res?.data?.user));
                toast.success(res?.data?.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error updating profile");
        } finally {
            setLoading(false)
        }
    };


    const followUnfollowUser = async () => {
        try {

            const res = await axios.post(`${USER_API_ENDPOINT}/follow/${userProfileById?._id}`, {}, { withCredentials: true })
            console.log(res)
            if (res?.data?.success) {
                const updateFollowing = isfollowing ?
                    user?.following?.filter((id) => id !== userProfileById?._id) :
                    [...user?.following, userProfileById?._id]

                dispatch(setUser({
                    ...user,
                    following: updateFollowing
                }))

                toast.success(res?.data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    return (
        <div className="w-full flex-1 p-5 overflow-auto h-screen hidescroll">
            <div className="relative h-72 rounded-lg p-6 bg-blue-200"
                style={{
                    backgroundImage: `url(${coverImage ? URL.createObjectURL(coverImage) : userProfileById?.coverImage || "default-placeholder-url"})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}>

                <div className="flex gap-6 items-center">
                    <ArrowLeft onClick={() => navigate("/")} size={20} className="text-gray-700 cursor-pointer  hover:text-gray-900 transition-all" />
                    <div className="flex flex-col items-start text-sm">
                        <p className="font-bold text-gray-900">{userProfileById?.fullname}</p>
                        <p className="text-gray-600 font-semibold">{userProfileById?.posts?.length} Posts</p>
                    </div>
                </div>

                {
                    user?._id === userProfileById?._id ?
                        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                            <label htmlFor="cover-image" className="w-28 cursor-pointer h-28 rounded-full border-4 border-white bg-gray-200 flex justify-center items-center relative">
                                <SwitchCameraIcon size={24} className="text-gray-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
                            </label>
                            <input type="file" id="cover-image" hidden onChange={handleCoverImageChange} />
                            <p className="mt-2 mb-9 text-[14px] font-semibold text-gray-600">Add A Cover Picture</p>
                        </div> : <></>
                }

                <div className="bg-white absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 w-full py-4 px-6 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                className="h-12 w-12 border-2 border-white rounded-full object-cover"
                                src={profileImage ? URL.createObjectURL(profileImage) : userProfileById?.profilePic || "/placeHolder.png"}
                                alt="Profile Picture"
                            />
                            <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer">
                                {
                                    user?._id === userProfileById?._id ? <Pen size={18} className="text-black" /> : <></>
                                }

                            </label>
                        </div>
                        <input type="file" id="profile-image" hidden onChange={handleProfileImageChange} />
                        <div className="text-sm text-gray-800">
                            <p className="font-bold">{userProfileById?.fullname}</p>
                            <p className="text-gray-500">@{userProfileById?.username}</p>
                        </div>
                    </div>
                    <div className="flex gap-3 lg:text-sm text-[8px] font-semibold">
                        {
                            user?._id === userProfileById?._id ?
                                <div className='flex gap-3'>
                                    <EditProfileDialog />

                                    {
                                        loading ? (
                                            <div className="flex justify-center items-center">
                                                <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"><Loader2 className='text-white h-5 w-5 animate-spin' /></button>
                                            </div>
                                        ) : (

                                            <button onClick={updateProImgAndCover} className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all">Save</button>
                                        )
                                    }
                                </div>
                                : <button onClick={followUnfollowUser} className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"> {isfollowing ? "Followed" : "Follow"}</button>
                        }


                        {/* <button className="px-4 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition-all">Share</button> */}
                    </div>
                </div>
            </div>

            <div className="mt-12 p-4 bg-white rounded-lg">
                <p className="text-lg font-semibold text-gray-900">About Me</p>
                <p className="text-gray-700 mt-2">{userProfileById?.bio}</p>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-lg font-semibold text-gray-900">Social Links</p>
                <div className="flex gap-4 mt-2">

                    <a target='_blank' href={`${userProfileById?.link}`}>Link</a>

                    {/* <a href="https://facebook.com/suraj" target="_blank" rel="noopener noreferrer">
                        <Facebook size={24} className="text-blue-600 hover:text-blue-800 transition-all" />
                    </a>
                    <a href="https://instagram.com/suraj" target="_blank" rel="noopener noreferrer">
                        <Instagram size={24} className="text-pink-600 hover:text-pink-800 transition-all" />
                    </a>
                    <a href="https://twitter.com/suraj" target="_blank" rel="noopener noreferrer">
                        <Twitter size={24} className="text-blue-400 hover:text-blue-600 transition-all" />
                    </a>
                    <a href="https://linkedin.com/in/suraj" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin size={24} className="text-blue-700 hover:text-blue-900 transition-all" />
                    </a> */}
                </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg flex justify-around items-center">
                <div className="flex flex-col items-center">
                    <p className="font-semibold text-gray-800">Followers</p>
                    <p className="text-gray-600">{userProfileById?.followers?.length}</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="font-semibold text-gray-800">Following</p>
                    <p className="text-gray-600">{userProfileById?.following?.length}</p>
                </div>
            </div>

            {/* <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-lg font-semibold text-gray-900">Band</p>
                <p className="text-gray-700 mt-2">I am also a member of the "The Creative Vibes" band, where we blend modern and traditional sounds for a unique experience.</p>
            </div> */}

            <div className="mt-12">
                <div className="flex justify-evenly sm:flex-col sm:space-y-4 sm:items-center md:flex-row">
                    <button
                        onClick={() => setActiveTab('my-post')}
                        className={`p-2 text-xs font-bold rounded-full transition-all duration-300 transform ${activeTab === 'my-post' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105' : 'bg-white text-gray-800 hover:bg-gray-100 hover:shadow-lg'} hover:underline`}
                    >
                        My Post
                    </button>
                    <button
                        onClick={() => setActiveTab('saved-posts')}
                        className={`p-2 text-xs font-bold rounded-full transition-all duration-300 transform ${activeTab === 'saved-posts' ? 'bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-lg scale-105' : 'bg-white text-gray-800 hover:bg-gray-100 hover:shadow-lg'} hover:underline`}
                    >
                        Saved Posts
                    </button>
                </div>
            </div>

            <div className="flex mt-10 mb-11 justify-center items-center h-auto">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">

                    {getPostDataAndSavePost === 0 ? <span>No Post</span> : getPostDataAndSavePost?.map((post) => (
                        <div key={post?._id} onClick={() => navigate(`/post/${post?._id}`)} className="group relative cursor-pointer ">
                            <img
                                className="rounded-lg w-full h-full object-cover"
                                src={post?.image}
                                alt="post"
                            />
                            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex gap-2">
                                    <button className="text-white p-2 rounded-full"><ThumbsUp />{post?.likes?.length} </button>
                                    <button className="text-white p-2 rounded-full"><MessageCircle />{post?.comments?.length} </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
