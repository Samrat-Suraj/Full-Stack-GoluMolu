import { Bookmark, CircleEllipsis, Forward, Heart, MoreHorizontal, Save, Share } from 'lucide-react'
import React, { useState } from 'react'
import { IoMdHeart } from "react-icons/io";
import { useNavigate } from 'react-router-dom'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


import CommentDialog from './CommentDialog'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { setAllPost, setSelectedPost } from '@/redux/postSlice'
import axios, { all } from 'axios'
import { POST_API_ENDPOINT, USER_API_ENDPOINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setUser } from '@/redux/authSlice'
import { FaBookmark } from "react-icons/fa";
import { setNotification } from '@/redux/notificationSlice';


const PostCards = ({ post }) => {

    const dispatch = useDispatch()
    const [loading, setIsLoading] = useState((false))
    const { user } = useSelector(store => store.auth)
    const { allPost } = useSelector(store => store.post)
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const isfollowing = user?.following?.includes(post?.author?._id)
    const isBlocked = user?.blocked?.includes(post?.author?._id)
    const isLikedPost = post?.likes?.includes(user?._id)
    const isBookMarked = user?.bookmarks?.includes(post?._id)

    const { allNotification } = useSelector((store) => store.notification);

    const followUnfollowUser = async () => {
        try {

            const res = await axios.post(`${USER_API_ENDPOINT}/follow/${post?.author?._id}`, {}, { withCredentials: true })
            if (res?.data?.success) {
                const updateFollowing = isfollowing ?
                    user?.following?.filter((id) => id !== post?.author?._id) :
                    [...user.following, post?.author?._id]

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
    const BlockUser = async () => {
        try {
            setIsLoading(true)
            const res = await axios.post(`${USER_API_ENDPOINT}/block/${post?.author?._id}`, {}, { withCredentials: true })
            if (res?.data?.success) {
                const updateBlockUser = isBlocked ?
                    user.blocked.filter((id) => id !== post?.author?._id) :
                    [...user.blocked, post?.author?._id]
                const updateFollowing = isfollowing ?
                    user.following.filter((id) => id !== post?.author?._id) :
                    [...user.following, post?.author?._id]

                dispatch(setUser({
                    ...user,
                    blocked: updateBlockUser,
                    following: updateFollowing
                }))

                toast.success(res?.data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setIsLoading(false)
        }
    }
    const LikePost = async () => {
        try {
            setIsLoading(true)
            const res = await axios.post(`${POST_API_ENDPOINT}/like/${post?._id}`, {}, { withCredentials: true })
            if (res?.data?.success) {

                const updatedPostData = allPost.map(p =>
                    p._id === post._id
                        ? {
                            ...p,
                            likes: isLikedPost
                                ? p.likes.filter(id => id !== user._id)
                                : [...p.likes, user._id]
                        }
                        : p
                );

                dispatch(setAllPost(updatedPostData))
                dispatch(setNotification([...allNotification, res?.data?.notification]))
                toast.success(res?.data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setIsLoading(false)
        }
    }
    const BookMarksPost = async () => {
        try {
            
            const res = await axios.post(`${POST_API_ENDPOINT}/bookmark/${post?._id}`, {}, { withCredentials: true });
            if (res?.data?.success) {
                const updatedUserBookmaks = isBookMarked
                    ? user?.bookmarks?.filter((id) => id !== post?._id)
                    : [...user.bookmarks, post?._id];

                dispatch(setUser({
                    ...user,
                    bookmarks: updatedUserBookmaks,
                }));

                toast.success(res?.data?.type);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    const DeletePost = async () => {
        try {
            setIsLoading(true)
            const res = await axios.post(`${POST_API_ENDPOINT}/delete/${post?._id}`, {}, { withCredentials: true })
            if (res?.data?.success) {
                const updatedPost = allPost.filter((p) => p?._id !== post?._id)
                dispatch(setAllPost(updatedPost))
                toast.success(res?.data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg mx-auto overflow-hidden mt-8 mb-16">

            <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <div className="flex cursor-pointer gap-3 items-center" onClick={() => navigate(`/profile/${post?.author?._id}`)}>
                    <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={post?.author?.profilePic || "/placeHolder.png"}
                        alt="User Avatar"
                    />
                    <div>
                        <p className="text-lg font-semibold text-gray-800">{post?.author?.fullname}</p>
                        <p className="text-sm text-gray-500">@{post?.author?.username}</p>
                    </div>
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Dialog>
                        <DialogTrigger>
                            <MoreHorizontal className="text-gray-600 cursor-pointer" />
                        </DialogTrigger>
                        <DialogContent className="w-[350px] lg:w-[50vw] rounded-lg">
                            <DialogHeader>
                                {
                                    user?._id !== post?.author?._id ?
                                        <Button onClick={followUnfollowUser} variant="ghost" className="text-sm text-[14px] font-semibold"> {isfollowing ? "Unfollow" : "Follow"}</Button>
                                        : <></>

                                }
                                <Button onClick={BookMarksPost} variant="ghost" className="text-sm text-[14px] font-semibold">{isBookMarked ? "Remove to Favorites" : "Add to Favorites"}</Button>
                                {/* {
                                    user?._id !== post?.author?._id ?
                                        <Button onClick={BlockUser} variant="ghost" className="text-sm text-[14px] font-semibold">{isBlocked ? "Unblock" : "Block"}</Button>
                                        : <></>

                                } */}
                                <Button onClick={() => navigate(`/post/${post?._id}`)} variant="ghost" className="text-sm text-[14px] font-semibold">Go To Post</Button>
                                <Button onClick={DeletePost} variant="ghost" className="text-sm text-[14px] text-red-600 font-semibold">{loading ? "Delete...." : "Delete"}</Button>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </button>
            </div>


            <div onClick={() => navigate(`/post/${post._id}`)} className="relative cursor-pointer ">
                <img
                    className="w-full h-[400px] object-cover"
                    src={post?.image}
                    alt="Post Image"
                />

                <div className="absolute bottom-4 left-4 text-white text-lg font-semibold">
                    {post?.caption}
                </div>
            </div>


            <div className="flex justify-between items-center p-4">
                <div className="flex gap-6 items-center">

                    <button className="text-gray-500 hover:text-red-500">
                        {
                            isLikedPost ? <IoMdHeart onClick={LikePost} className='text-red-600' size={22} /> : <Heart onClick={LikePost} width={22} />
                        }

                    </button>

                    <button onClick={() => {
                        dispatch(setSelectedPost(post))
                        setOpen(true)
                    }}
                        className="text-gray-500 hover:text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M9 2a7 7 0 00-7 7v4a7 7 0 007 7h2a7 7 0 007-7V9a7 7 0 00-7-7H9zm3 7v4a3 3 0 01-3 3H8a3 3 0 01-3-3V9a3 3 0 013-3h2a3 3 0 013 3z" />
                        </svg>
                        <CommentDialog open={open} setOpen={setOpen} />
                    </button>


                </div>
                <div className="flex gap-3 items-center">
                    {/* <button className="text-gray-500 hover:text-gray-700"><Forward /></button> */}
                    <button onClick={BookMarksPost} className="text-gray-500 hover:text-gray-700"> {isBookMarked ? <FaBookmark size={23} className='text-black ' /> : <Bookmark size={23} />}  </button>
                </div>
            </div>

        </div>
    )
}

export default PostCards
