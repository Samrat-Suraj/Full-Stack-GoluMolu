import { Heart, MessageCircle, MoreHorizontal, Send, Share2 } from 'lucide-react'
import React, { useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useNavigate, useParams } from 'react-router-dom'
import useGetPostById from '@/hooks/useGetPostById'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { COMMENT_API_ENDPOINT, POST_API_ENDPOINT, USER_API_ENDPOINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { setAllPost, setPostById } from '@/redux/postSlice'
import { setAllComment } from '@/redux/commentSlice'
import useGetAllComment from '@/hooks/useGetAllComment'


const PostDetails = () => {
    const params = useParams()
    useGetAllComment(params.id);
    useGetPostById(params.id)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setIsLoading] = useState(false)
    const [text, setText] = useState("")
    const { user } = useSelector(store => store.auth)
    const {allComment} = useSelector(store => store.comment)
    const { postById, allPost } = useSelector(store => store.post)

    const DeletePost = async () => {
        try {
            setIsLoading(true)
            const res = await axios.post(`${POST_API_ENDPOINT}/delete/${params.id}`, {}, { withCredentials: true })
            if (res?.data?.success) {
                const updatedPost = allPost.filter((p) => p?._id !== params.id)
                navigate("/")
                dispatch(setAllPost(updatedPost))
                dispatch(setPostById(""))
                toast.success(res?.data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setIsLoading(false)
        }
    }

    const CommentHander = async () => {
        try {
            const res = await axios.post(`${COMMENT_API_ENDPOINT}/${params.id}/create`, { text }, { withCredentials: true })
            if (res?.data?.success) {
                setText("")
                dispatch(setAllComment([...allComment , res.data.comment]))
                toast.success(res?.data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }


    return (
        <div className="h-screen w-screen overflow-auto  p-6 flex flex-col lg:flex-row">

            <div className="w-full lg:w-1/2 h-1/2 rounded-lg p-1 lg:h-full flex justify-center items-center bg-gray-200">
                <img className="w-full h-full object-cover rounded-lg" src={postById?.image} alt="Post Image" />
            </div>


            <div className="w-full lg:w-1/2 p-4 lg:p-6 flex flex-col h-[480px] lg:h-full">

                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <img className="h-12 w-12 rounded-full" src={postById?.author?.profilePic || "/placeHolder.png"} alt="User" />
                        <div>
                            <p className="font-semibold">{postById?.author?.fullname}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(postById?.createdAt).toLocaleString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true,
                                })}
                            </p>

                        </div>
                    </div>

                    <Popover className="">
                        {/* <PopoverTrigger><MoreHorizontal className="text-gray-700 cursor-pointer" /></PopoverTrigger> */}
                        <PopoverContent className="w-[200px] p-2 mr-10">
                            <div className='flex flex-col gap-2'>
                                {/* <p className='p-2 text-[14px] font-bold cursor-pointer'>Block</p> */}
                                {/* <hr /> */}

                                <p onClick={DeletePost} className='p-2 text-[14px] font-bold cursor-pointer text-red-600'>{loading ? "Delete...." : "Delete"}</p>
                                {/* <hr /> */}
                                {/* <p className='p-2 text-[14px] font-bold cursor-pointer text-red-600'>Make Private</p> */}
                            </div>
                        </PopoverContent>
                    </Popover>


                </div>


                <div className="mb-4">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <Heart className="text-red-500" />
                            <span>{postById?.likes?.length}</span>
                        </div>
                        {/* <div className="flex gap-2 items-center">
                            <MessageCircle className="text-blue-500" />
                            <span>{commentCount}</span>
                        </div> */}
                    </div>
                    <div className="h-px my-4 bg-gray-300"></div>
                    {/* <div className="flex justify-between text-gray-600">
                        <p className="cursor-pointer"><Heart /></p>
                        <p className="cursor-pointer"><MessageCircle /></p>
                        <p className="cursor-pointer"><Share2 /></p>
                    </div>
                    <div className="h-px my-4 bg-gray-300"></div> */}
                </div>


                <div className="flex-1 overflow-y-auto mb-4">
                    <h2 className="text-xl font-semibold mb-3">Comments</h2>
                    <div className="space-y-3">
                        {allComment?.map((comment) => (
                            <div key={comment?._id} className="flex items-center gap-3">
                                <img className="h-8 w-8 rounded-full" src={comment?.author?.profilePic || "/placeHolder.png"} alt="User" />
                                <div>
                                    <p className="font-semibold"> {comment?.author?.fullname} </p>
                                    <p className="text-gray-700">{comment?.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="lg:flex hidden items-center gap-2 mt-4">
                    <input
                        className="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="Add a comment..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <Send onClick={CommentHander} className="text-blue-500 cursor-pointer" />
                </div>

                <div className="flex lg:hidden items-center gap-2 mt-4 mb-14">
                    <input
                        className="p-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="Add a comment..."
                        onChange={(e) => setText(e.target.value)}
                    />
                    <Send onClick={CommentHander} className="text-blue-500 cursor-pointer" />
                </div>
            </div>
        </div>
    )
}

export default PostDetails
